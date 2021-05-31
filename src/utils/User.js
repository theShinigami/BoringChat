/**
 * 
 * Users.js
 * 
 */


class User {

    constructor() {

      this.users = [];

    }


    addNewUser( id, username, room ) {

        let newUser = {
            id,
            username,
            room
        };

        this.users.push( newUser );

        return newUser;

    }


    getUserById( id ) { return this.users.filter( (user) => user.id == id )[0] }
    
    removeUser( id ) { this.users = this.users.filter((user) => user.id !== id); }

    idToRoom( id ) { return this.users.filter( (user) => user.id == id )[0].room; }

    idToUsername( id ) { return this.users.filter( (user) => user.id == id )[0].username; }

    getAllUsers() { return this.users; }
    
  
  }
  
  module.exports.User = User;