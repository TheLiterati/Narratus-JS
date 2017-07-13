# Narratus API

## Overview
Narrutus is a collaborative writing app that allows users to initiate a theme-based short story and for other users to contribute to the story sequentially.

With this RESTful API, users can sign-up and sign-in, read and subscribe to short stories, create and moderate short stories, and contribute to other short stories. Users who do not sign-up with an account can only read stories.

## Team Members

iOS
  * Christina Lee
  * Mike Miksch
  * Serg Tsogtbaatar

JavaScript
  * Allie Grampa
  * Caleb Wells
  * Michael Padget
  * Shelly Tang

## Sites
* Deployed API  
  * https://dashboard.heroku.com/apps/narratus-production
* GitHub
  * Organization: https://github.com/TheLiterati
  * JS: https://github.com/TheLiterati/Narratus-JS
  * iOS: https://github.com/TheLiterati/Narratus-ios

## Version 0.6.1

## Schemas
### User
A user with an account
```
  username
  email
  password
  ownedStories
  followedStories
  snippetsWritten
  findHash
```

### Story
A story created by a user
```
  userId
  title
  description
  startSnippet
  created
  genre
  snippets
  snippetCount
  pendingSnippets
  pendingSnippetCount
```
### Snippet
A contribution to an existing story
```
  userId
  snippetContent
  created
  pending
  accepted
```

## Endpoints
The below example requests for each model uses HTTPie and localhost PORT: 3000.

### User

* Sample JSON user:
```javascript
{ "_id" : "591fe9819fb22c13f9b516d8",
"password" : "$2a$10$Ht6TDXnUxDu1SHbUlczCmuuIa.5iA4a9CnjLyxjZIVcduc6rICvFa",
"username" : "username",
"email" : "email",
"snippetsWritten" : [ ],
"followedStories" : [ ],
"ownedStories" : [ ],
"__v" : 0,
"findHash" : "524d9a5fb9524c33909090144d3625374086f515182f3ee69c4a4d39f7d6b" }
```

* **POST:** /api/signup
  * Requires a username, password, email
  * Returns an authorization token
```
HTTP POST: 3000/api/signup username="username" password="password" email="email"
```
  * Example token:
```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImVlZmRlNzJlMWM1NGRmMjRlZmI1OTA4MDVhYmNjYjlmMmQzOTFiODA2YTM0MDE1NjVmYzkwNTMzMDFjOGZhMTYiLCJpYXQiOjE0OTUyNjM2MTd9.86P1g6Y_OxZlRpy0V9x1OfUFldFTMiEij212ksROD4g"
```

* **GET:** /api/signin
  * Requires basic authorization (username, password)
  * Returns an authorization token - *this will be used for all subsequent requests*
```
HTTP GET: 3000/api/signin -a username:password
```

* **GET:** /api/snippetapproval/:storyId
  * Requires storyId, authorization token
  * Pushes approved story to the snippets array and increments snippetCount
```
HTTP GET: 3000/api/snippetapproval/:storyId 'Authorization:Bearer <token>'
```

* **GET:** /api/dashboard
  * Requires authorization token
  * Returns user ownedStories and followedStories
```
HTTP GET: 3000/api/dashboard 'Authorization:Bearer <token>'
```

* **PUT:** /api/follow/story/:storyId
  * Requires storyId, authorization token
  * Pushes story to the user followedStories array
```
HTTP PUT: 3000/api/follow/story/:storyId 'Authorization:Bearer <token>'
```

### Story

* Sample JSON Story:
```Javascript
{
    "__v": 1,
    "_id": "591fec019fb22c13f9b516d9",
    "created": "2017-05-20T07:10:57.724Z",
    "description": "thedesc",
    "genre": "Fiction",
    "pendingSnippetCount": 1,
    "pendingSnippets": [
        "591fecc59fb22c13f9b516da"
    ],
    "snippetCount": 0,
    "snippets": [],
    "startSnippet": "thestart",
    "title": "thetitle",
    "userId": [
        "591fe9819fb22c13f9b516d8"
    ]
}
```

* **POST:** /api/story
  * Requires title, description, startSnippet content, authorization token
```
HTTP POST: 3000/api/story title="title" description="description" startSnippet="starter" 'Authorization:Bearer <token>'
```

* **GET:** /api/story
  * This does not require basic or bearer authentication
```
HTTP GET: 3000/api/story
```

* **GET:** /api/story/:storyId
  * Requires storyId, authorization token
```
HTTP GET: 3000/api/story/:storyId 'Authorization:Bearer <token>'
```

* **GET:** /api/snippetapproval/:storyId
  * Requires storyId, authorization token
  * Returns pending snippets of a story
```
HTTP GET: 3000/api/snippetapproval/:storyId 'Authorization:Bearer <token>'
```

* **PUT:** /api/snippetapproval/:storyId
  * Requires storyId, authorization token
  * Pushes pendingSnippet to the snippet array
```
HTTP PUT: 3000/api/follow/story/:storyId 'Authorization:Bearer <token>'
```

### Snippets

* Sample JSON snippet

```Javascript
{
  "__v": 0,
  "_id": "591fecc59fb22c13f9b516da",
  "acceptedDate": "2017-05-20T07:14:13.422Z",
  "created": "2017-05-20T07:10:57.724Z",
  "lastViewDate": "2017-05-20T07:10:57.724Z",
  "pending": true,
  "snippetContent": "and the story continues",
  "userId": [
      "591fe9819fb22c13f9b516d8"
  ]
}
```

* **POST:** /api/snippet/:storyId
  * Requires storyId, authorization token
```
HTTP POST: 3000/api/snippet/:storyId 'Authorization:Bearer <token>' snippetContent="snippetblurb"
```

* **GET:** /api/snippet/:storyId
  * Requires storyId, authorization token 'Authorization:Bearer <token>'
  * Returns snippet body
```
HTTP GET: 3000/api/snippet/:storyId 'Authorization:Bearer <token>'
```

## Dependencies
* bcrypt
* bluebird
* body-parser
* cors
* crypto
* debug
* dotenv
* express
* http-errors
* jsonwebtoken
* mongoose

## License
This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/TheLiterati/Narratus-JS/blob/master/LICENSE) file for details.
