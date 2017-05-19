# Narratus

## Description

## Team Name
* The Literati

## Team Members

### iOS
* Christina Lee
* Mike Miksch
* Serg Tsogtbaatar

### JavaScript
* Allie Grampa
* Caleb Wells
* Michael Padget
* Shelly Tang

## Sites
### Deployed Website
### App Store
### iOS GitHub

## Version
* 0.1.0

## Architecture
### Model
### View
### Controller

## Database
### Schemas
* User schema
  * username
  * email
  * password
  * owned stories
  * followed stories
  * snippets written
  * findHash


* Story schema
  * user id
  * title
  * description
  * start snippet
  * created
  * genre
  * open
  * last updated
  * snippets
  * snippet count
  * pending snippets
  * pending snippet count


* Snippet schema
  * user id
  * snippet content
  * created
  * pending
  * approved

### MongoDB

## Routes

### User
* post '/signup'
* get '/signin'
* get '/dashboard'
* put '/follow/story/:storyId'
* put '/logout/:userId'

### Story
* post '/story'
* get '/story'
* get '/story/:storyId'

### Snippets
* post '/snippet/:storyId'
* post '/snippet/approve/:storyId'

## Middleware

## Testing
## Installation
### NPM Packages
### Dependencies
## Application
## Resources
* [MongoDB](https://docs.mongodb.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/TheLiterati/Narratus-JS/blob/master/LICENSE) file for details.

## Acknowledgments
* Code Fellows
