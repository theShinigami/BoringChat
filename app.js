// express js
var express = require( "express" );

// morgan
var morgan = require( "morgan" );

// dotenv to load the env configuration
require("dotenv").config();

// http
const http = require('http');

// socket
const { Server } = require("socket.io");


// routes
const userRoute = require( "./src/routes/user.route" );

// declare an app
var app = express();

// http express server
const server = http.createServer(app);

// socket setup
var io = new Server(server);


// middleware
app.use( morgan( "dev" ) )
app.use( express.static( "public" ) )


// routes
app.use( "/user", userRoute );



// start socket
io.on( "connection", (socket) => {

    console.log( "connected!" );

});


// start express
server.listen(process.env.PORT, () => {
    console.log( `listening at http://localhost:${process.env.PORT}` );
});
