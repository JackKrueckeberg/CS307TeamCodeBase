# CS307TeamCodeBase
This is the total code base for all of the documents and code shared between the CS 307 Group.

Inside the FindYourHome folder, there is a client, server, and documents folder.

The documents folder contains all the documents we have submitted.

The client folder is our react application, this serves as the front end interface where all UI/UX will be happening. This application can access and make requests to our server in ther server folder.

The server folder is our express application, this is where most of our backend processing should happen, this is also the best avenue to access the mongoDB server.

Jason also has set up a basic MongoDB project and cluster, if you do not have a .env file in your local repo, reach out to Jason to get it set up.

Notes:

* Run `npm i` in both the client and server folder before working (do this every time you pull or checkout)
* To run our project, start 2 terminals, in the server folder run `node server.mjs` in the client folder run `npm run start` in order to succesfully run our application.

Overall, please create branches for your work and create individual files for your components, the way we are dividing work, you should almost never be editing the same file as someone else, therefore if you have a merge conflict, you likely are not coding in the best way (avoid spaggheti code)

 










