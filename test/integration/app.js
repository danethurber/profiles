const chai = require('chai');
const app = require('../../server');
const constants = require('../../app/lib/constants');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('app', () => {
  describe('security headers', () => {
    it('should be returned for a valid request', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.header('X-Xss-Protection', '1; mode=block');
          expect(res).to.have.header('X-Frame-Options', 'DENY');
          expect(res).to.have.header('X-Content-Type-Options', 'nosniff');
          expect(res).to.have.header('X-Download-Options', 'noopen');
          expect(res).to.not.have.header('X-Powered-By');
          done();
        });
    });
  });

  describe('redirect to root of app', () => {
    it('should return a 200 response as html', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          expect(err).to.equal(null);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.redirect;
          expect(res).to.have.status(200);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.html;
          expect(res.text).to.be.equal('Hello World!');
          done();
        });
    });
  });

  describe('existing GP page', () => {
    it('should return a GP Page for a valid Org Code', (done) => {
      chai.request(app)
        .get(`${constants.SITE_ROOT}/A81001`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res.text).to.contain('GP Page');
          done();
        });
    });
  });

  describe('an unknown page', () => {
    it('should return a 404', (done) => {
      chai.request(app)
        .get('/not-known')
        .end((err, res) => {
          expect(err).to.not.be.equal(null);
          expect(res).to.have.status(404);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.html;
          expect(res.text).to.equal('Page not found');
          done();
        });
    });
  });

  describe('non-existant GP page', () => {
    it('should return a 404', (done) => {
      chai.request(app)
        .get(`${constants.SITE_ROOT}/unknown`)
        .end((err, res) => {
          expect(err).to.not.be.equal(null);
          expect(res).to.have.status(404);
          // eslint-disable-next-line no-unused-expressions
          expect(res).to.be.html;
          expect(res.text).to.equal('Page not found');
          done();
        });
    });
  });

  describe('Book a GP appointment page', () => {
    it('should return a book a GP Appointment Page for a valid Org Code', (done) => {
      chai.request(app)
        .get(`${constants.SITE_ROOT}/A81001/book-appointment`)
        .end((err, res) => {
          expect(err).to.equal(null);
          expect(res).to.have.status(200);
          expect(res.text).to.contain('Book an appointment');
          done();
        });
    });
  });
});
