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

// utils
const { User } = require("./src/utils/User");

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


// user
let users = new User();


// on socket connect[]
io.on( "connection", (socket) => {

    let client_id = socket.client.nsps.values().next().value.id;

    console.log( "User connected!", client_id );


    // when user disconnects
    socket.on( "disconnect", function() {

        console.log( "user has been disconnected!: ", client_id);
        // console.log(socket.leave());

        // annonce a user has been disconnected
        let user = { 
            "id": client_id, 
            "username": users.idToUsername( client_id ), 
            "room": users.idToRoom( client_id ) };

        socket.broadcast.to( users.idToRoom( client_id ) ).emit( "userDisconnected", user );
        
        // remove user from users list
        users.removeUser( client_id );

    });



    // join room
    socket.on('room', function(room) {
       
        socket.join( room );

        // save to users
        let user = users.addNewUser( client_id, socket.handshake.query.username, room );

        // annonce a new user has been connect
        socket.broadcast.to( room ).emit( "newUserJoined", user );

        // display all client in 'room'
        console.log( io.sockets.adapter.rooms );

    });


    // io.sockets.in("black").emit('message', 'what is going on, party people?');




});




// start express
server.listen(process.env.PORT, () => {
    console.log( `listening at http://localhost:${process.env.PORT}` );
});
