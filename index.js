const express = require('express');
const bodyParser = require('body-parser');
const db = require('./queries.js');
const app = express();
const port = 3000;

// support parsing of application/json type post data
app.use(bodyParser.json());
// app.use(bodyParser.json({
//   type: function() {
//       return true;
//   }
// }));
app.get('/', (req, res) => {
    res.json('Node.js, Express, and Postgres API');
});

app.get('/users',db.checkConn, db.getUsers);
app.get('/users/:id',db.checkConn, db.getUserById);
app.post('/users',db.checkConn, db.createUser);
app.put('/users/:id',db.checkConn, db.updateUser);
app.delete('/users/:id/:toid',db.checkConn, db.deleteUser);
app.delete('/users/:id',db.checkConn, db.deleteUser);
app.use((req,res) => {
    res.status(404).send(`404 Not Found : ${req._parsedUrl.href} requested could not be found on this server!`);
})

app.listen(port,db.checkConn,() => {
  console.info('App running on port '+port);
});

module.exports = app;