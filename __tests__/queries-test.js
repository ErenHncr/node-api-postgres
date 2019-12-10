//const { validate } = require('../validation.js');
const request = require('supertest');
const app = require('../index.js');
const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: '123456',
  port: 5432,
});

//Number Check
// const isNumber = (n) => {
//  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
// }

const getRandomInt = (max) => {
  return (Math.floor(Math.random() * Math.floor(max)));
};

let fakeUser={
  id:null,
  name:'test',
  email:'test@example.com'
};
let randomUser;
const madeUpUrl = '/random';
describe('All Endpoints', () => {

  test('should return all users', async() => {
    await request(app)
    .get('/users')
    .set('Accept', 'application/json')
    .expect(200)
    .then((res)=>{
      expect(res.body.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body)).toBe(true);
      randomUser = getRandomInt(res.body.length);
      expect(res.body[randomUser].id).not.toBe(null);
      expect(res.body[randomUser].name).not.toBe(null);
      expect(res.body[randomUser].email).not.toBe(null);
    });
  });

  test('should return users with id or error', async () => {
    await request(app)
    .get(`/users/${randomUser}`)
    .set('Accept', 'application/json')
    .then((res)=>{
      expect(res.body).not.toBe(null);
      if(res.body.error===undefined){
        expect(res.body.id).not.toBe(undefined);
        expect(res.body.name).not.toBe(undefined);
        expect(res.body.email).not.toBe(undefined);
        expect(res.body.email).not.toBe(null);
        expect(res.body.id).not.toBe(null);
        expect(res.statusCode).toBe(200);
      }
      else{
        expect(res.body.error).not.toBe(null);
        expect(res.body.error).not.toBe(undefined);
        expect(res.statusCode).toBe(400);
      }
    });
  });

  test('should create a test user', async () => {
    await request(app)
    .post('/users')
    .set('Content-type' , 'application/json')
    .set('Accept', 'application/json')
    .expect(200)
    .send({name:fakeUser.name,email:fakeUser.email})
    .then((res) => {
      fakeUser.id = res.body.id;
    })
  });

  test('should not create existing test user', async () => {
    await request(app)
    .post('/users')
    .set('Accept', 'application/json')
    .send({name:fakeUser.name,email:fakeUser.email})
    .expect(400)
  });

  test('should delete existing test user', async() => {
    await request(app)
    .delete(`/users/${fakeUser.id}`)
    .expect(200)

  });

  test('should not delete nonexistent test user', async() => {
    await request(app)
    .delete(`/users/${fakeUser.id}`)
    .set('Accept', 'application/json')
    .expect(400)    
  });

  test('should get 404 error when nonexistent url requested', async() => {
    await request(app)
    .get(`/${madeUpUrl}`)
    .set('Accept', 'application/json')
    .expect(404)    
  });


});

