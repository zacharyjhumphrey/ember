import React from 'react';

function Comment({ author, body}) {
    return (
        <div className="Comment">
            <span className="author">@{author.username}</span>

            <div className="comment-body">
                {body}
            </div>
        </div>
    );
}

export default Comment;
