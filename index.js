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
    res.json({ info: 'Node.js, Express, and Postgres API' });
});

app.get('/users', db.getUsers);
app.get('/users/:id', db.getUserById);
app.post('/users', db.createUser);
app.put('/users/:id', db.updateUser);
app.delete('/users/:id/:toid', db.deleteUser);
app.delete('/users/:id', db.deleteUser);

// app.listen(port,() => {
//   //console.info('App running on port '+port);
// });

module.exports = app;