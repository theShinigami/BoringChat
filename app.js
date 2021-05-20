// express js
var express = require( "express" );

// morgan
var morgan = require( "morgan" );

// dotenv to load the env configuration
require("dotenv").config()



// declare an app
var app = express();

// middleware
app.use( morgan( "dev" ) )
app.use( express.static( "public" ) )



// start express
app.listen(process.env.PORT, () => {
    console.log( `listening at http://localhost:${process.env.PORT}` );
});
