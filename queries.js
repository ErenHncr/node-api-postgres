const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: '123456',
  port: 5432,
})

//display all users
const getUsers = (req, res) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    else if(results.rows[0]!==undefined){
      res.status(200).json(results.rows);
    }
    else{
      res.status(400).json('No data in database');
    }
  });
}

//display a single user
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(`SELECT * FROM users WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    else if(results.rows[0]!==undefined){
      console.log(results.rows[0]);
      res.status(200).json(results.rows);
    }
    else{
      console.log(results.rows[0]);
      res.status(400).json(`User with id:${id} does not exist!`);
    }
  });
}

//create a new user
const createUser = (req, res) => {
  const { name, email } = req.body;
  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
    if (error) {
        throw error;
    }
    else{
        if(results.rows[0]===undefined){
            pool.query(`INSERT INTO users (name, email) VALUES ('${name}','${email}')`, (error, result) => {
                if (error) {
                    throw error;
                }
                else{
                    res.status(200).json('User added with email: '+email);
                }
            })
        }
        else{
            res.status(200).json('Existing user can not be added. Please change mail.');
        }
    }
  })
}

//update an existing user
const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;
    pool.query(`UPDATE users SET name = '${name}', email = '${email}' WHERE id = ${id} AND '${email}' NOT IN (SELECT email FROM users)`,
    (error, results) => {
        if (error) {
          throw error;
        }
        else if(results.rowCount===0){
          res.status(400).send(`User not modified with ID: ${id}. '${email}' already exists.`);
        }
        else{
          res.status(200).send(`User modified with ID: ${id}.`);
        }
      }
    );
  }
  //delete an existing user
  const deleteUser = (req, res) => {
    const id = req.params.id;
    const toid = req.params.toid;
    let query=`DELETE FROM users WHERE id between ${id} and ${toid}`;
    if(toid===undefined){
        query=`DELETE FROM users WHERE id=${id}`;
    }
    pool.query(query, (error, results) => {
        if (error) {
            throw error;;
        }
        else{
            res.status(200).send(`User deleted with ID: ${id}${toid===undefined?'':'-'+toid}`);
        }
    })
  }

  module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  }