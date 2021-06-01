// chat.js


// socket
var $socket;

// chat bubble
var $chatWindow;

// is thinking
var $isThinking = false;

const handleWindowResize = function() {
    const outerMargin = $('#upper').height() + $('#sendMessageDetails').height() + 60;
    const height = $(window).outerHeight() - outerMargin;
    $conversation.css('height', height + 'px');
    $('#user-list').css('height', (height) + 'px');
};


const makeAllStatusInvisible = function() {

    $("#loading_spinner").css({ "display": "none" });
    $("#disconnect_chat").css({ "display": "none" });
    $("#connect_btn").css({ "display": "none" });

};

const changeToConnecting = function() {

    // clear all status
    makeAllStatusInvisible();

    $loadingSpinner = $('#loading_spinner');
    $loadingSpinner.css({ "display": "" });
};

const changeToDisconnect = function() {

    // clear all status
    makeAllStatusInvisible();

    $disconnectDiv = $('#disconnect_chat');
    $disconnectDiv.css({"display": ""});
}


const changeToConnect = function() {

    // clear all status
    makeAllStatusInvisible();

    $connect_btn = $("#connect_btn");
    $connect_btn.css({ "display": "" });

}

const save2LocalStorage = function( k, v ) {

    const $myStorage = window.localStorage;

    $myStorage.setItem( k, v );

};

const updateUsernameToStatus = function( username ) {

    $("#usr_name").html( username );

};


const getFromLocalStorage = function( k ) {

    const $myStorage = window.localStorage;

    return $myStorage.getItem( k );

}


const clearLocalStorage = function() {

    window.localStorage.clear();

};


const localStorageListener = function() {

    window.onstorage = (e) => {
        // When local storage changes, dump the list to
        // the console.
        if (e.isTrusted) {

            if ( e.key == "username" ) updateUsernameToStatus( e.newValue );
            else if ( e.key == "url" ) {
                console.log( "url has been updated!" );
            }

        }

    };

}


const saveWSID = function( id ) {

    save2LocalStorage( "ws_id", id );

};


const getWSIDFromLocalStorage = function() {

    return getFromLocalStorage( "ws_id" );

};


const saveUsername = function( username ) {

    save2LocalStorage( "username", username );
    
};


const getUsernameFromLocalStorage = function() {

    return getFromLocalStorage( 'username' );

};


const saveURL = function( url ) {

    save2LocalStorage( "url", url );

};


const getURLFromLocalStorage = function() {

    return getFromLocalStorage( 'url' );

};

const saveRoom = function( room ) {

    save2LocalStorage( "room", room );

};


const getRoomFromLocalStorage = function() {

    return getFromLocalStorage( "room" );

};

// connect to ws server
const connectWS = function( url, username, room ) {

    const $totalReconnectAttempt = 15;
    var $attemptCount = 0;

    changeToConnecting();

    $socket = io( url, {
        reconnectionDelayMax: 1000,
        reconnectionAttempts: $totalReconnectAttempt,
        query: {
            "username": username
        }
    });

    // when connection error encounters
    $socket.on("connect_error", () => {

        $attemptCount += 1;

        changeToConnecting();
        console.log( "error: error while connecting to the server!: ", $attemptCount);
        if ( $attemptCount >= $totalReconnectAttempt ) changeToConnect();

    });



    // when socket connected§
    $socket.on("connect", () => {

        console.log( "socket has been connected!: " );

        changeToDisconnect();

        // save the username
        saveUsername( username );

        // save the url
        saveURL( url );

        // save ws id
        saveWSID( $socket.id );

        // save the room
        saveRoom( room );
        
        // update username at the status 
        updateUsernameToStatus( username );

        // join
        $socket.emit( "room", room );

    });

    // on disconnect
    $socket.on("disconnect", () => {
        
        console.log( "disconnected!" );

        // change status to connect
        changeToConnect();

        // clear local storage
        clearLocalStorage();

    });

    // when socket connection fails
    $socket.on('reconnect_failed', () => {
        console.log('reconnect_failed Failed');
    });


    // on incoming message
    $socket.on('message', function( data ) {
    
        console.log('Incoming message:', data);
    
    });

    // on new user joined the room
    $socket.on( 'newUserJoined', function( data ) {

        console.log( "new user: ", data );

        addUserToListBody( `${data.username}`, "message..." );

    });

    // on user disconnects
    $socket.on( 'userDisconnected', function( data ) {
        
        console.log( "user disconnected: ", data );

        removeUserFromList( `${data.username}` );

    });

    // fetchs all connect client in the room
    $socket.on( 'allClientsInRoom', function( data ) {

        if ( data.length > 0 ) {
            
            data.forEach(clientInRoom => {
                
                if ( $socket.id != clientInRoom.id ) addUserToListBody( `${clientInRoom.username}`, "message..." );

            });

        } else {

            console.log( "No clients in the room." );

        }

    });

    // on client typing
    $socket.on( 'typing', function( data ) {
        
        if ( !$isThinking ) {

            // set the bubble to thinking
            $chatWindow.think();

            // change thinking status
            $isThinking = true;

            // set thinking to 4 seconds
            setTimeout(function() { 
                $isThinking = false;
                $chatWindow.stop(); 
            }, 4000);


        }

    });

    // on new message
    $socket.on( 'message', function( data ) {

        getReply( data.message );

    });


 
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
                    <p class="media-heading">${username.split('_')[0]}</p>
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
    $chatWindow = new Bubbles(

        document.getElementById("chat"), // ...passing HTML container element...
        "$chatWindow", // ...and name of the function as a parameter
        {
            inputCallbackFn: function (chatObject) {

            if ( $socket !== undefined && $socket.connected )
                $socket.emit( "message", { "message": chatObject.input, "id": $socket.id } );


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

const getReply = function( msg ) {

    $chatWindow.talk(
        {
        ice: {

            says: [ msg ]
        }, 

        }
    );

}


// generate username handler
const generateUsernameHandler = function() {

    $generateGenerateUsername = $( "#generateUsername" );
    $usernameInput = $( "#ws-username" );

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
    $wsUsername = $("#ws-username");
    $wsRoom = $("#ws-room");

    // forms 
    $wsConnectForm = $("#ws-connect-form")

    // a
    $disconnect = $("#a-disconnect");

    // form submit hadnle
    $wsConnectForm.submit( function(event) {

        // replace with empty if it starts with ws://
        $url = "ws://" + $wsURL.val().replace( "ws://", '' );
        $username = $wsUsername.val();
        $room = $wsRoom.val();

        // connect to ws
        connectWS( $url, $username, $room );

        // close the modal
        $("#connectModal").modal("toggle");

        // clear inputs
        $wsURL.val("");
        $wsUsername.val("");

        event.preventDefault();

    });


    // on disconnected clicked
    $disconnect.click( function() {

        // disconnect socket
        if ( $socket.connected ) $socket.close();

    });


    // on char input 
    $sendMessage.on( "input", function(e) {
        
        // on input change send typing event
        if ( $socket !== undefined && $socket.connected ) $socket.emit( "typing", { id: $socket.id } );
    });


    // on keypress event
    // $sendMessage.keypress(function( event ) {

    //     if ( $socket !== undefined && $socket.connected )
    //         if ( event.keyCode == 13 ) $socket.emit( "message", { "message": $sendMessage.val(), "id": $socket.id } );

    // });


    chatBubbleHandler();

    localStorageListener();

    generateUsernameHandler();

    handleWindowResize();


});