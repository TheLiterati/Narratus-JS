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

describe('Story routes', () =>  {

  // Setup and teardown
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
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Story.remove({}),
    ])
    .then(() => done())
    .catch(() => done());
  });

  // POST: for story tests: 200, 400, 401
  describe('POST: /api/story', () => {


    // 400 (bad request with invalid body)
    describe('bad request TBD', () => {
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    // 401 (unauthorized with invalid username/password)
    describe('unauthorized TBD', () => {
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

  });

  // GET: for story tests: 200, 401, 404
  describe('GET: /api/story', () => {



    // 401 (unauthorized with invalid username/password)
    describe('unauthorized TBD', () => {
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    // 404 (bad request, not found)
    describe('bad request TBD', () => {
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/signin`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });

  // TODO: Story GET: /api/story/:storyId

  // PUT: for story tests: 200, 400, 401, 404
  describe('PUT: /api/story', () => {



    // 400 (bad request with invalid body)
    describe('bad request TBD', () => {
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api//:storyId`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    // 401 (unauthorized with invalid username/password)
    describe('unauthorized TBD', () => {
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/story/:storyId`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    // 404 (bad request, not found)
    describe('bad request TBD', () => {
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/story/:storyId`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

  });

  // DELETE: for story tests: 204
  describe('DELETE: /api/story', () => {

    // 204 (no content)
    describe('no content TBD', () => {
      it('TBD', done => {
        // TODO:
        request.post(`${url}/api/story`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
  });
// End
});

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
      
      // NOT WORKING YET, OWNED STORIES ARRAY IS EMPTY
      it.only('Should push the new story into the owner\'s ownedStories array', done => {
        request.post(`${url}/api/story`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleStory)
        // .then(data => {
        //   this.tempUser.save();
        //   User.findById(this.tempUser._id)
        //   .then( user => {
        //     
        //     // console.log('this.tempstory', this.tempStory);
        //     console.log('user', user);
        //     done();
        //   })
        // });
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
      
    }); //fetch stories
    
  }); // GET
  
//   describe('PUT: /story/:storyId', () =>  {
//     
//     describe('Testing the update story method', () =>  {
//       
//       it('Should take in username, password, and email', done => {
//         // TODO:
//         request.put(`${url}/api/signup`)
//         .end((err, res) => {
//           expect(res.status).to.equal(404);
//           done();
//         });
//       });
//       
//       it('Should take in username, password, and email', done => {
//         // TODO:
//         request.put(`${url}/api/signup`)
//         .end((err, res) => {
//           expect(res.status).to.equal(404);
//           done();
//         });
//       });
//       
//       it('Should take in username, password, and email', done => {
//         // TODO:
//         request.put(`${url}/api/signup`)
//         .end((err, res) => {
//           expect(res.status).to.equal(404);
//           done();
//         });
//       });
//       
//       it('Should take in username, password, and email', done => {
//         // TODO:
//         request.put(`${url}/api/signup`)
//         .end((err, res) => {
//           expect(res.status).to.equal(404);
//           done();
//         });
//       });
//       
//     }); // update story
//     
//   }); // PUT
//   
//   describe('DELETE: /story/:storyId', () =>  {
//     
//     describe('Testing the delete story method', () =>  {
//       
//       it('Should return a story when given an id', done => {
//         // TODO:
//         request.delete(`${url}/api/signup`)
//         .end((err, res) => {
//           expect(res.status).to.equal(404);
//           done();
//         });
//       });
//       
//       it('Should remove the story from the database', done => {
//         // TODO:
//         request.delete(`${url}/api/signup`)
//         .end((err, res) => {
//           expect(res.status).to.equal(404);
//           done();
//         });
//       });
//       
//     }); // delete story
//     
//   }); // DELETE
//   
}); //end story integration tests
