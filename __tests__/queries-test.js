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

describe('All Endpoints', () => {
  test('should return all users', async() => {
    await request(app)
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

  test('should return users with id or error', async() => {
    await request(app)
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

  const fakeUser={
    id:undefined,
    name:'test',
    email:'test@example.com'
  };
  test('should create a test user', async() => {
    await request(app)
    .post('/users')
    .set('Accept', 'application/json')
    .expect(200)
    .send({name:fakeUser.name,email:fakeUser.email})
    .expect(`User added with email: ${fakeUser.email}`);
  });

  test('should not create existing test user', async() => {
    await request(app)
    .post('/users')
    .set('Accept', 'application/json')
    .expect(400)
    .send({name:fakeUser.name,email:fakeUser.email})
    .expect('Existing user can not be added. Please change mail.');
  });

  test('should delete existing test user', () => {
    pool.query(`SELECT id FROM users WHERE email = '${fakeUser.email}';`, async(error, results) => {
      if (error) {
        console.log('error');
      }
      else{
        const id = (results.rows[0].id);
        fakeUser.id=id;
        await request(app)
        .delete(`/users/${fakeUser.id}`)
        .set('Accept', 'application/json')
        .then((res)=>{
          expect(res.statusCode).toBe(200);
        })
        .expect(`User deleted with ID: ${fakeUser.id}`)
      }
    })  
  });

  
  test('should not delete not existing test user', async() => {
    await request(app)
    .delete(`/users/${fakeUser.id}`)
    .set('Accept', 'application/json')
    .expect(`User not deleted with ID: ${fakeUser.id}. User with ${fakeUser.id} does not exist.`)
    .then((res)=>{
      expect(res.statusCode).toBe(400);
    });
  });

});