# CoffeeHub Project

This is the backend component for the SafeChat chat application. The bakcend uses Socket.io to open a web socket connection to clients and forward messages together with sender and room data.

The backend is meant to work with a React-based forntend application found in a [separate repository](https://github.com/BrankoKrstic/safechat-frontend).

## To install

Clone the github repo to your machine.

Execute `cd safechat-backend` into the terminal to go into the repo folder

Execute `npm install` to download all dependencies

`npm start` to open the project on a development server

Make sure to enter the URL of your frontend as an environment variable to avoid CORS blocking by browsers.
## Using the app

Once you set up a test server, connect through the SafeChat frontend and start sending messages.
