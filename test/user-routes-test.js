'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user');

mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const testUser = {
  username: 'christina',
  password: 'thebestpasswordever',
  email: 'christina@narratus.io',
};

describe.only('User routes', function() {

  describe('POST: /api/signup', function(){
    describe('user filled out form data correctly', function(){
      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(testUser)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('string');
          done();
        });
      });
    });
    describe('user entered missing or incorrect form data', function(){
      it('should respond with a 400 bad request error', done => {
        request.post(`${url}/api/signup`)
        .send('badrequest')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
    after(done => {
      User.remove({})
      .then(done())
      .catch();
    });
  });

  describe('GET: /api/signin', function() {
    describe('user put in a bad url path', function() {
      it('return a bad request 404 not found', done => {
        request.get(`${url}/api/badrequest`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  describe('GET: /api/signin', function(){
    before(done => {
      let user = new User(testUser);
      user.generatePasswordHash(testUser.password)
      .then(user => user.save())
      .then(user => {
        this.temporaryUser = user;
        done();
      })
      .catch();
    });
    after(done => {
      User.remove({})
      .then(() => done())
      .catch(done);
    });

    describe('user logged in with correct credentials', function() {
      it('should respond with 200 ok status and token', done => {
        request.get(`${url}/api/signin`)
        .auth('christina', 'thebestpasswordever')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.a('string');
          done();
        });
      });
    });
    describe('user entered incorrect login information', function(){
      it('should repond with a 401 unauthorized error', done => {
        request.get(`${url}/api/signin`)
        .auth('wronguser', 'wrongpassword')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

});
