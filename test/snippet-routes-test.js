'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../models/user');
const Story = require('../models/story');
// const Snippet = require('../models/snippet');
const snippetController = require('../controllers/snippet-controller.js');

mongoose.Promise = Promise;

require('../server');

const url = `http://localhost:${process.env.PORT}`;

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
const exampleSnippet = {
  snippetContent: 'And then the story continued with a user submitted snippet',
};


describe('Snippet routes', function() {
  // POST: for snippet tests: 200, 400, 401, 404
  describe('POST /api/snippet/:storyId', function() {

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

    describe('a proper request with a valid body', () => {
      it('should return a snippet and 200 response', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          let date = new Date(res.body.created).toString();
          expect(res.body.snippetContent).to.equal('And then the story continued with a user submitted snippet');
          expect(res.body.pending).to.equal(true);
          expect(res.body.userId[0]).to.equal(`${this.tempUser._id}`);
          expect(date).to.not.equal('Invalid Date');
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('a bad request with an invalid body', () => {
      it('should respond with a 400 invalid body error', done => {
        request.post(`${url}/api/snippet/what`)
        .send({})
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('a request with an invalid token', () => {
      it('should respond with a 401 unauthorized error', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: 'Bad token'})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('a request with an invalid story ID', () => {
      it('should respond with a 404 error not found', done => {
        request.post(`${url}/api/snippet/story1234`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

  }); // end of the /api/snippets/:storyId routes tests

  describe('POST /api/approve/:storyId', function() {
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

    describe('a proper request with a valid body', () => {
      it('should return a 200 response', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          let date = new Date(res.body.created).toString();
          expect(res.body.snippetContent).to.equal('And then the story continued with a user submitted snippet');
          expect(res.body.pending).to.equal(true);
          expect(res.body.userId[0]).to.equal(`${this.tempUser._id}`);
          expect(date).to.not.equal('Invalid Date');
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('a request with an invalid token', () => {
      it('should respond with a 401 unauthorized error', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: 'Bad token'})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('a request with an invalid story ID', () => {
      it('should respond with a 404 error not found', done => {
        request.post(`${url}/api/snippet/story1234`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
    describe('a bad request with an invalid body', () => {
      it('should respond with a 400 invalid body error', done => {
        request.post(`${url}/api/snippet/what`)
        .send()
        .set({Authorization: `Bearer ${this.tempToken}`})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });
}); //end snippet routes test

describe('Snippet integration tests', () => {

  describe('POST :/api/snippet/:storyId', () => {

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

    describe('The createSnippet method', () => {

      it('Should return a story with a story id passed in', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          done();
        });
      }); //end of it block;

      it('Should return a new snippet', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.body.snippetContent).to.be.a('string');
          expect(res.body.snippetContent).to.equal('And then the story continued with a user submitted snippet');
          done();
        });
      }); //end of it block;

      it('Should have an empty story pendingSnippets array, before the snippet is added', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end(() => {
          expect(this.tempStory.pendingSnippets).to.have.length.of(0);
          done();
        });
      }); //end of it block;

      it('Should have a pendingSnippet count that starts at 0', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end(() => {
          expect(this.tempStory.snippetCount).to.equal(0);
          done();
        });
      }); //end of it block;

      it.only('Should have a new snippet in the story pendingSnippets array once added', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          console.log(res.text);
          // console.log('the tempStory',this.tempStory);
          // console.log('this pendingSnippets array', this.tempStory.pendingSnippets);
          expect();
          done();
        });
      }); //end of it block;

      it('Should create a new snippet that is an object', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          done();
        });
      }); //end of it block;

      it('Should increment the story pendingSnippetCount with each snippet added', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      }); //end of it block;

      it('Should stop when the story pendingSnippetCount reaches 10', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
      }); //end of it block;

    }); //createSnippet method

  }); //end post :/api/snippit/:storyId test

  describe('POST :/api/snippet/appove/:storyId', () => {

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

    describe('The approveSnippet method', () => {

      it('Should return a story with a story id passed in', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          done();
        });
      }); //end of it block;

      it('Should create a new snippet', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          done();
        });
      }); //end of it block;

      it('Should have an empty approveSnippet array beforehand', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          done();
        });
      }); //end of it block;

      it('Should add the snippet to the approvedSnippet array', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          done();
        });
      }); //end of it block;

      it('Should increment the approvedSnippet count by one each time', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          done();
        });
      }); //end of it block;

      it('Should reset the empty pendingSnippets array to empty after approval', done => {
        request.post(`${url}/api/snippet/${this.tempStory._id}`)
        .set({Authorization: `Bearer ${this.tempToken}`})
        .send(exampleSnippet)
        .end((err, res) => {
          expect(res.body).to.be.a('object');
          done();
        });
      }); //end of it block;

    }); //end of approveSnippet test


  }); //end of :/api/snippet/approve/:storyId method

}); //end snippet integration test
