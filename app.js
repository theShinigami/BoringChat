// express js
var express = require( "express" );

// morgan
var morgan = require( "morgan" );

// dotenv to load the env configuration
require("dotenv").config()

// routes
const userRoute = require( "./src/routes/user.route" );



// declare an app
var app = express();

// middleware
app.use( morgan( "dev" ) )
app.use( express.static( "public" ) )


// routes
app.use( "/user", userRoute );


// start express
app.listen(process.env.PORT, () => {
    console.log( `listening at http://localhost:${process.env.PORT}` );
});
