const { validate } = require('../validation.js');
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

const testid=21;
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const fakeUser={
  id:null,
  name:'test',
  email:'test@example.com'
};
describe('All Endpoints', () => {

  test('should return all users', () => {
    request(app)
    .get('/users')
    .set('Accept', 'application/json')
    .expect(200)
    .then((res)=>{
      expect(res.body.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body)).toBe(true);
      const randomUser=getRandomInt(res.body.length);
      expect(res.body[randomUser].id).not.toBe(null);
      expect(res.body[randomUser].name).not.toBe(null);
      expect(res.body[randomUser].email).not.toBe(null);
    });
  });

  test('should return users with id or error', () => {
    request(app)
    .get(`/users/${testid}`)
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

  test('should create a test user', () => {
    request(app)
    .post('/users')
    .set('Accept', 'application/json')
    .expect(200)
    .send({name:fakeUser.name,email:fakeUser.email})
    .expect(`User added with email: ${fakeUser.email}`);
  });

  describe('test user id assignment', () => {
    beforeAll((done) => {
      pool.query(`SELECT id FROM users WHERE email = '${fakeUser.email}';`, (error, results) => {
          if (error) {
            console.log('error');
          }
          else{
            fakeUser.id = results.rows[0].id;   
            console.log(fakeUser.id);

          }       
            
         });
    });
    test('should not create existing test user', () => {
      request(app)
      .post('/users')
      .set('Accept', 'application/json')
      .send({name:fakeUser.name,email:fakeUser.email})
      .expect(400)
      .expect('Existing user can not be added. Please change mail.');
    });

    test('should delete existing test user', () => {
      const { error } = validate(fakeUser.id);
      if(error) expect(true).toBe(false);
      request(app)
      .delete(`/users/${fakeUser.id}`)
      .set('Accept', 'application/json')
      .expect(200)
    });

    test('should not delete not existing test user', () => {
      const { error } = validate(fakeUser.id);
      if(error) expect(true).toBe(false);
      request(app)
      .delete(`/users/${fakeUser.id}`)
      .set('Accept', 'application/json')
      .expect(400)
    });

  })
});