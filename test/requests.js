let chai = require('chai');
let chaiHttp = require('chai-http');
let assert = chai.assert;
let server = require('../dist/app');
chai.use(chaiHttp);

let token = '';
describe("Route /v1/login/account", () => {
    it("should respond", (done) => {
        chai.request(server)
            .post('/v1/login/account')
            .send({email: 'blackyu123@gmail.com', password: 'qwe123'})
            .end((err, res) => {
                basicSuccess(res);
                token = res.body.token;
                done();
            });
    });
});

describe("Route /v1/auth/user", () => {
    it("should respond", (done) => {
        chai.request(server)
            .get('/v1/auth/user')
            .set('x-access-token', token)
            .end((err, res) => {
                basicSuccess(res);
                done();
            });
    });
});

describe("Route /v1/requests", () => {
    it("should respond", (done) => {
        chai.request(server)
            .get('/v1/requests')
            .end((err, res) => {
                basicSuccess(res);
                done();
            });
    });
});

function basicSuccess(res) {
    assert.equal(res.statusCode, 200);
    assert(typeof res.body === 'object');
    assert.property(res.body, 'success');
    assert.equal(res.body.success, true);
}