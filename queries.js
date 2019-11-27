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
    res.status(200).json(results.rows);
  });
}

//display a single user
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  })
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
    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).send(`User modified with ID: ${id}`);
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