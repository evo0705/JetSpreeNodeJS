let chai = require('chai');
let chaiHttp = require('chai-http');
let assert = chai.assert;
let server = require('../dist/app');
chai.use(chaiHttp);

describe("Route /login/account", () => {
    it("should respond", (done) => {
        chai.request(server)
            .post('/login/account', {email: 'samuel.lee@jetspree.com', password: 'P@ssword'})
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                assert(typeof res.body === 'object');
                assert.property(res.body, 'success');
                done();
            });
    });
});

describe("Route /requests", () => {
    it("should respond", (done) => {
        chai.request(server)
            .get('/requests')
            .end((err, res) => {
                assert.equal(res.statusCode, 200);
                assert(typeof res.body == 'object');
                done();
            });
    });
});