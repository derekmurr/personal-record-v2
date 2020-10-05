# Personal Record

## A web app to track running workouts

This is the start of v2 of Personal Record. Originally it was built atop a RESTful API, storing data in a MongoDB database, with a basic roll-your-own authentication. This version uses Apollo Server and Apollo Federation to stitch together a few services (Auth0 for authorization & authentication, a MongoDB collection for profile info, and another MongoDB collection for workouts) into one unified GraphQL API, consumed on the front-end by a React app using Apollo Client 3 and Styled-Components.

## Installation

Clone the repo. You'll have to run npm install inside both the `/client` and `/server` directories, as the front- and back-end each have different dependencies. 

## Starting the app locally

It's a Docker image – you can build the containers and launch the front- and back-end by running `docker-compose -f docker-compose.yml -f docker.compose.dev.yml up` in the terminal, in the root directory of the project. The front-end will be served at http://localhost:3000 and the back-end can be explored via GraphQL Playground at http://localhost:4000/graphql

