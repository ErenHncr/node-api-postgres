const request = require('supertest');
const app = require('../index.js');
const testid=21;

describe('All Endpoints', () => {
    test('should return all users', async() => {
      await request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200)
      .then((res)=>{
          expect(res.body[0].id).not.toBe(undefined);
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
      });
    });

    test('should return users with id or error', async() => {
      await request(app)
      .get(`/users/${testid}`)
      .set('Accept', 'application/json')
      .then((res)=>{
        expect(res.body).not.toBe(null);
        if(res.body.error===undefined){
          expect(res.body.id).not.toBe(null);
          expect(res.body.name).not.toBe(null);
          expect(res.body.email).not.toBe(null);
          expect(res.statusCode).toBe(200);
        }
        else{
          expect(res.body.error).not.toBe(null);
          expect(res.statusCode).toBe(400);
        }
      });
    });


  });