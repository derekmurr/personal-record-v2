#Personal Record

##A web app to track running workouts

This is the start of v2 of Personal Record. Originally it was built atop a RESTful API, storing data in a MongoDB database, with a basic roll-your-own authentication. This version uses Apollo Server and Apollo Federation to stitch together a few services (Auth0 for authorization & authentication, a MongoDB collection for profile info, and another MongoDB collection for workouts) into one unified GraphQL API, consumed on the front-end by a React app using Apollo Client 3.

It's early days, yet. Nothing works.