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

$(document).ready(function() {

    
    $conversation = $('#conversation');
    $sendMessage = $('#sendMessage');


    // btns...
    $connectWSBtn = $('#connect-ws-btn');

    // inputs
    $wsURL = $('#ws-url');


    // $sendMessage.keypress(function( event ) {
    //     if ( event.which === 13 ) {
    //         console.info( "You've pressed enter..." );
    //     }
    // });


    // ws connect handle click
    $connectWSBtn.click( function() {

        // replace with empty if it starts with ws://
        $url = "ws://" + $wsURL.val().replace( "ws://", '' );

        connectWS( $url );

    });


    handleWindowResize();


});