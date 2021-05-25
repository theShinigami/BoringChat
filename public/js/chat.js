// TODO: Don't let an agent send until there is a customer
// TODO: Let users disconnect

/* Processing statement for eslint. Please ignore, but leave in place: */
/* global document window console localStorage getRole ChatConnection */

// Fill the vertical space with the conversation area.
const handleWindowResize = function() {
    const outerMargin = $('#upper').height() + $('#sendMessageDetails').height() + 60;
    const height = $(window).outerHeight() - outerMargin;
    $conversation.css('height', height + 'px');
    $('#user-list').css('height', (height) + 'px');
};

// connect to ws server
const connectWS = function( url ) {

    $loadingSpinner = $('#loading_spinner');
    $connectBtn = $('#connect_btn');
    
    $connectBtn.css({"display": "none"});
    $loadingSpinner.css({ "display": "" });

}


// generates random color hex value
const genRandomColor = function() {

    let color = "";
    var letters = 'abcdef0123456789';

    for (var i=0; i<6; i++) color += letters[Math.floor(Math.random() * 16)];

    return color;

}


// add new user to user list body
const addUserToListBody = function( username, message ) {

    var userListBody = $('#user-list-body');

    userListBody.append( $((`

        <a href="#" class="list-group-item" id="${username}">
            <div class="media">
                <div class="circle" style="background-color: #${genRandomColor()}">
                    <span class="initials">${username[0].toUpperCase()}</span>
                </div>
                <div class="media-body">
                    <p class="media-heading">${username}</p>
                    <small>${message}</p>
                </div>
            </div>
        </a>

    `)) );


};


// remove the user from the list
const removeUserFromList = function( username ) {

    $(`#${username}`).remove();

}


// handle chat bubble
const chatBubbleHandler = function() {

    // initialize by constructing a named function...
    var $chatWindow = new Bubbles(

        document.getElementById("chat"), // ...passing HTML container element...
        "$chatWindow", // ...and name of the function as a parameter
        {
            inputCallbackFn: function (chatObject) {

            console.log( chatObject );

            }
        }
        
    );
  
    // `.talk()` will get your bot to begin the conversation
    $chatWindow.talk(
        // pass your JSON/JavaScript object to `.talk()` function where
        // you define how the conversation between the bot and user will go
        {
        // "ice" (as in "breaking the ice") is a required conversation object
        // that maps the first thing the bot will say to the user
        ice: {
            // "says" defines an array of sequential bubbles
            // that the bot will produce
            says: ["Hey!"]
        }, // end required "ice" conversation object
    
        } // end conversation object
    );

}

// generate username handler
const generateUsernameHandler = function() {

    $generateGenerateUsername = $( "#generateUsername" );
    $usernameInput = $( "#input-username" );

    $generateGenerateUsername.click( function() {

        // fetch random animal username
        fetch('http://localhost:4000/user/generateUsername')
            .then(response => response.json())
            .then(data => {
                
                // update the username input with new fetched
                // username
                $usernameInput.val( data["username"] );

            });

    });


}




$(document).ready(function() {

    
    $conversation = $('#conversation');
    $sendMessage = $('#sendMessage');

    // btns...
    $connectWSBtn = $('#connect-ws-btn');

    // inputs
    $wsURL = $('#ws-url');

    // forms 
    $wsConnectForm = $("#ws-connect-form")


    // form submit hadnle
    $wsConnectForm.submit( function(event) {

        // replace with empty if it starts with ws://
        $url = "ws://" + $wsURL.val().replace( "ws://", '' );

        // connect to ws
        connectWS( $url );

        // close the modal
        $("#connectModal").modal("toggle");

        event.preventDefault();

    });


    

    addUserToListBody( 'myUsername', "This is just a demo message" );

    chatBubbleHandler();

    generateUsernameHandler();

    handleWindowResize();


});