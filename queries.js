const { validate } = require('./validation.js');

const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: '123456',
  port: 5432
})

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    //console.log(result.rows)
  })
});

//Number Check
// const isNumber = (n) => {
//  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
// }

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
  const { error } = validate(req.params);
  if(error) return res.status(400).send(error.details[0].message);
  
  const id = req.params.id;
  pool.query(`SELECT * FROM users WHERE id = ${id}`, (error, results) => {
    if (error) {
      throw error;
    }
    else if(results.rows[0]!==undefined){
      res.status(200).json(results.rows[0]);
    }
    else{
      res.status(400).json({ "error":`User with id:${id} does not exist!`});
    }
  });
}

//create a new user
const createUser = (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);
  
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
                  pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
                    if (error) {
                        throw error;
                    }
                    else{
                      res.status(200).json(results.rows[0]);
                    }
                  });
                }
            })
        }
        else{
          res.status(400).send('Existing user can not be added. Please change mail.');
        }
    }
  })
};

//update an existing user by id
const updateUser = (req, res) => {
    const { error } = validate({...req.params, ...req.body});
    if(error) return res.status(400).send(error.details[0].message);

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
      });
  }
  //delete an existing user
const deleteUser = (req, res) => {
  const id = req.params.id;
  const toid = req.params.toid;
  const { error } = validate(req.params);
  if(error) return res.status(400).send(error.details[0].message);
  
  let query=`DELETE FROM users WHERE id between ${id} and ${toid}`;

  if(toid===undefined||toid==null){
    query=`DELETE FROM users WHERE id = ${id};`;
  }
  
  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    else{
      if(results.rowCount===0){
        res.status(400).send(`User not deleted with ID: ${id}${toid===undefined?'':'-'+toid}. User with ${id} does not exist.`);
      }
      else{
        res.status(200).send(`User deleted with ID: ${id} ${(toid===undefined||toid===null)?'':'-'+toid}`);
      }
    }
  });
}

  module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  }