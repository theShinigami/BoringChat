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




$(document).ready(function() {

    
    $conversation = $('#conversation');
    $sendMessage = $('#sendMessage');

    // btns...
    $connectWSBtn = $('#connect-ws-btn');

    // inputs
    $wsURL = $('#ws-url');


    // ws connect handle click
    $connectWSBtn.click( function() {

        // replace with empty if it starts with ws://
        $url = "ws://" + $wsURL.val().replace( "ws://", '' );

        connectWS( $url );

    });


    

    chatBubbleHandler();

    handleWindowResize();


});