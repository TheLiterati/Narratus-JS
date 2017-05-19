# Narratus

## Overview
Narrutus is a collaborative writing app that allows users to initiate a theme-based short story and for other users to contribute to the story sequentially.

With this RESTful API, users can sign-up and sign-in, read and subscribe to short stories, create and moderate short stories, and contribute to other short stories. Users who do not sign-up with an account can only read stories.

## The Literati - Team Members:
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
### Deployed API  
* https://dashboard.heroku.com/apps/narratus-production
### GitHub
* Organization: https://github.com/TheLiterati
* JS: https://github.com/TheLiterati/Narratus-JS
* iOS: https://github.com/TheLiterati/Narratus-ios
## Version
* 1.0.0

## Schemas
### User schema
  * username
  * email
  * password
  * ownedStories
  * followedStories
  * snippetsWritten
  * findHash

### Story schema
  * userId
  * title
  * description
  * startSnippet
  * created
  * genre
  * open
  * lastUpdated
  * snippets
  * snippetCount
  * pendingSnippets
  * pendingSnippetCount

### Snippet schema
  * userId
  * snippetContent
  * created
  * pending
  * accpeted
  * acceptedDate
  * lastViewDate
  * bookmark

## Server Endpoints
### User
POST: `api/signup`
GET: `api/signin`
GET: `api/snippetapproval/:storyId`
PUT: `api/follow/story/:storyId`

### Story
POST: `api/story`
GET: `api/story`
GET: `api/story/:storyId`

### Snippets
POST: `api/snippet/:storyId`
POST: `api/snippet/approve/:storyId`

## Installation
## Resources
* [MongoDB](https://docs.mongodb.com)

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/TheLiterati/Narratus-JS/blob/master/LICENSE) file for details.

## Acknowledgments
* Code Fellows
