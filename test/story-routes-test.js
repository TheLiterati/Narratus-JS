'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user');
const Story = require('../models/story');

mongoose.Promise = Promise;

// *** SERVER SETUP ***

require('../server');

const url = `http://localhost:${process.env.PORT}`;

// *** TEST MODEL SETUP ***

const exampleUser = {
  username: 'Christina',
  password: 'iamawesome',
  email: 'hi@hello.what',
};

const exampleStory = {
  title: 'The way we built Narratus',
  description: 'Project week - midterm project for JS backend and final project for iOS',
  startSnippet: 'There were seven of us assigned to a team. And then the murders began',
};

// *** STORY TESTS ***

describe.only('Story integration tests', () =>  {
  
  beforeEach(done => {
    new User(exampleUser)
    .generatePasswordHash(exampleUser.password)
    .then(user => user.save())
    .then(user => {
      this.tempUser = user;
      return user.generateToken();
    })
    .then(token => {
      this.tempToken = token;
      done();
    })
    .catch(() => done());
  });

  
  beforeEach(done => {
    exampleStory.userId = this.tempUser._id.toString();
    new Story(exampleStory).save()
    .then(story => {
      this.tempStory = story;
      done();
    })
    .catch(() => done());
  });
  
  afterEach(() => delete exampleStory.userId);
  
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Story.remove({}),
    ])
    .then(() => done())
    .catch(() => done());
  });
  
  describe('POST: /api/story', () =>  {
    
    describe('Testing the create story method', () =>  {
      
      it('Should create a new story', done => {
        request.post(`${url}/api/story`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        .end((err, res) => {
          expect(this.tempStory).to.exist;
          expect(res.status).to.equal(200);
          done();
        });
      });
      
      it('Should create a new title', done => {
        request.post(`${url}/api/story`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        .end(() => {
          expect(this.tempStory.title).to.equal(exampleStory.title);
          done();
        });
      });
      
      it('Should create a new description', done => {
        request.post(`${url}/api/story`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        .end(() => {
          expect(this.tempStory.description).to.equal(exampleStory.description);
          done();
        });
      });
      
      it('Should create a new start snippet', done => {
        request.post(`${url}/api/story`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        .end(() => {
          expect(this.tempStory.startSnippet).to.equal(exampleStory.startSnippet);
          done();
        });
      });
      
      it('Should push the new story into the owner\'s ownedStories array', done => {
        request.post(`${url}/api/story`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        .end((err, res) => {
          console.log(err);
          expect(res.status).to.equal(200);
          expect(this.tempUser.ownedStories).to.be.a('array');
          done();
        });
      });
      
      it('Should assign the user _id to the story userId property', done => {
        request.post(`${url}/api/story`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        .end(() => {
          expect(this.tempStory.userId[0].toString()).to.equal(this.tempUser._id.toString());
          done();
        });
      });
      
      it('Should push the startSnippet into the story\'s snippet array', done => {
        request.post(`${url}/api/story`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        .end(() => {
          expect(this.tempStory.startSnippet).to.equal(exampleStory.startSnippet);
          done();
        });
      });
      
      it('Should return a 401 error on a bad token request', done => {
        request.post(`${url}/api/story`)
        .set({Authorization: 'Bad token'})
        .send(exampleStory)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
      
      it('should respond with a 404 error not found', done => {
        request.post(`${url}/api/story/story1234`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });  //create story
  });// POST
  
  describe('GET: /api/story', () =>  {
    
    describe('Testing the fetch story method', () =>  {
      // TRY TO ADD MORE STORIES AND PROVE THAT THEY ARE ALL RETURNED - THIS IS A FETCHALL METHOD (FOREACH?)
      it('Should return all of the existing stories', done => {
        request.get(`${url}/api/story`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.body[0].title).to.equal(this.tempStory.title);
          expect(res.body[0].description).to.equal(this.tempStory.description);
          expect(res.body[0].startSnippet).to.equal(this.tempStory.startSnippet);
          expect(res.status).to.equal(200);
          done();
        });
      });
      
      it('should respond with a 404 error not found', done => {
        request.get(`${url}/api/story/story1234`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    }); //fetch story
  }); // GET
  
  describe('GET: /story/:storyId', () =>  {
    
    describe('Testing the fetch stories method', () =>  {
      
      it('Should return a story when given an id', done => {
        request.get(`${url}/api/story/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.body.title).to.equal(this.tempStory.title);
          expect(res.body.description).to.equal(this.tempStory.description);
          expect(res.body.startSnippet).to.equal(this.tempStory.startSnippet);
          expect(res.status).to.equal(200);
          done();
        });
      });
      
      it('Should return all of the snippets in the story\'s snippet array', done => {
        request.get(`${url}/api/story/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.body.startSnippet).to.equal(this.tempStory.startSnippet);
          expect(res.status).to.equal(200);
          done();
        });
      });
      
      it('should respond with a 404 error not found', done => {
        request.get(`${url}/api/story/story1234`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    }); //fetch stories
  }); // GET
});
