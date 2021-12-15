// Web API Testing Example: GET, POST

// variable declaration
const rootTestURL = 'https://jsonplaceholder.typicode.com'
const supertestRequest = require('supertest')(rootTestURL);
const chaiAssert = require('chai').assert;
const oKStatusCode = 200;

// helper functions


// main
describe('API Testing: typicode.com', () => {
    // Users: test GET request
    it('API Test: GET: /users', () => {
        return supertestRequest
            .get('/users')
            .expect(oKStatusCode)
            .then((res) => {
                console.log(`\nDEBUG: response: GET: /users: \n${JSON.stringify(res, null, 3)}`);
                chaiAssert.isNotEmpty(res.body);
            });
    });

    // todos: test GET request
    it('API Test: GET: /todos', () => {
        return supertestRequest
            .get('/todos')
            .expect(oKStatusCode)
            .then((res) => {
                console.log(`\nDEBUG: response: GET: /todos \n${JSON.stringify(res, null, 3)}`);
                chaiAssert.isNotEmpty(res.body);
                chaiAssert.hasAllKeys(res.body[1], ['userId', 'id', 'title', 'completed']);
            });
    });

    // users: test POST request
    it('API Test: POST: /users', () => {
        const reqData = {
            name: 'Jane TAYLOR',
            email: 'jane.taylor@abc.org.uk'
        };
        const expResData = {
            name: 'Jane TAYLOR'
        };
        return supertestRequest
            .post('/users')
            .send(reqData)
            .expect(201)
            .then((res) => {
                console.log(`\nDEBUG: response: POST: /users: \n${JSON.stringify(res, null, 3)}`);
                chaiAssert.hasAnyDeepKeys(res.body, ['email', 'name', 'id']);
                const nameErrMsg = 'Err: response: missing user name';
                chaiAssert.equal(res.body.name, expResData.name, nameErrMsg);
            });
    });

    // users: test PUT request
    it('API Test: PUT: /users/:id', () => {
        const reqData = {
            email: 'updated_jane.taylor@abc.org.uk'
        };
        return supertestRequest
            .put('/users/1')
            .send(reqData)
            .expect(oKStatusCode)
            .then((res) => {
                console.log(`\nDEBUG: response: PUT: /users/:id: \n${JSON.stringify(res, null, 3)}`);
                chaiAssert.equal(res.body.email, reqData.email);
            });
    });

    // users: test DELETE request
    it('API Test: DELETE: /users/:id', () => {
        return supertestRequest
            .delete('/users/1')
            .expect(oKStatusCode)
            .then((res) => {
                console.log(`\nDEBUG: response: DELETE: /users/id: \n${JSON.stringify(res, null, 3)}`);
                chaiAssert.isEmpty(res.body);
            });
    });
});