# Personal Record

## A web app to track running workouts

This is the start of v2 of Personal Record. Originally it was built atop a RESTful API, storing data in a MongoDB database, with a basic roll-your-own authentication. This version uses Apollo Server and Apollo Federation to stitch together a few services (Auth0 for authorization & authentication, a MongoDB collection for profile info, and another MongoDB collection for workouts) into one unified GraphQL API, consumed on the front-end by a React app using Apollo Client 3 and Styled-Components.

## Installation

Clone the repo. You'll have to run npm install inside both the `/client` and `/server` directories, as the front- and back-end each have different dependencies. 

## Starting the app locally

To run the app, currently it's a bit of a Frankenstein's monster - in the `/server` directory, run `npm run start:mongo` to start the MongoDB driver, then run `redis-server` to start the Redis instance, then finally `npm run dev` to start the various back-end services. (There are three services: accounts, profiles and runs; they're stitched together with Apollo Federation to present one GraphQL endpoint to the client.)

Then, in the `/client` directory, run `npm run start` to launch the front-end React client.

The plan is to shortly move things to PM2 and a Docker instance to tidy all this up before deploying.