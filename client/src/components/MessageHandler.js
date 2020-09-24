import React, { useState } from 'react';
import '../css/Message.css';
import FlashMessage from 'react-flash-message';
import MessageQueue from '../resources/MessageQueue';

/*
    message: 
        message: Holds the message that will be displayed to the user 
        type: Determines the color of the message
            error: red
            warn: yellow
            success: green
*/

const Queue = new MessageQueue(10);

const testData = {
    type: 'error',
    message: 'This is some test message.'
}

function MessageHandler() {
    // const message = useState("This is a test message.");
    // const type = useState("error");

    return (
        <div>
            <strong>{testData.type}: </strong>{testData.message}
        </div>
    );
}

export default MessageHandler;
