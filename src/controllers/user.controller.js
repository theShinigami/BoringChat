// user controller

const generateRandomAnimalName = require( 'random-animal-name-generator' );


const userController = {

    generateUsername( req, res ) {

        const animalName = generateRandomAnimalName();

        return res.json({
            username: animalName.toLowerCase().replace( ' ', '_' )
        });

    }

};


module.exports = userController;


