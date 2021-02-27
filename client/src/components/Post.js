import React, { useState } from 'react';
import { useTransition, animated } from 'react-spring';
import classNames from 'classnames';
import '../css/Post.css';
import Comment from './Comment';
import exampleProfilePic from '../resources/example-profile-pic.png';

function Post({ open, author, title, body, upvotes, downvotes, userUpvoted, userDownvoted, tags, _id, comments, postState, setPostState }) {
  const classes = classNames('Post');
  const [picHover, setHover] = useState(false);
  const [postComments] = useState(comments);

  const transitions = useTransition(picHover, null, {
    config: { tension: 210 },
    from: { transform: 'translate3d(0,-40px,0)', opacity: 0 },
    enter: { transform: 'translate3d(0,0px,0)', opacity: 1 },
    leave: { transform: 'translate3d(0,-40px,0)', opacity: 0 }
  });

  const defaultCommentFormProps = { body: "", originalPost: _id };
  const [commentFormProps, setCommentFormProps] = useState(defaultCommentFormProps);

  const handleCreateComment = (e) => {
    e.preventDefault();

    fetch(`/api/comments/`, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(commentFormProps)
    }).then(response => response.json()).then(({ comment, success, err, message }) => {
      if (err) {
        console.error(err);
        return;
      }

      if (success) setCommentFormProps(defaultCommentFormProps);

      // Updating the post that just got commented
      const i = findParentPost(comment.originalPost);
      let temp = postState.posts;
      temp[i].comments = [...temp[i].comments, comment];
      setPostState({ loading: postState.loading, posts: temp });
    });
  }

  const handleUpvote = () => {
    fetch(`/api/posts/${_id}/upvote`, {
      method: 'PATCH',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      }
    }).then(response => response.json()).then(({ success, err, message }) => {
      if (err) {
        console.error(err);
        return;
      }

      // Handling successfull upvote (just a UI change)
      const i = findParentPost(_id);
      let temp = postState.posts;

      // Adjusting downvotes
      temp[i].userDownvoted = false;
      temp[i].downvotes = removeByValue(author._id, temp[i].downvotes);

      // Adding upvote
      temp[i].userUpvoted = true;
      temp[i].upvotes.push(author._id);

      setPostState({ loading: postState.loading, posts: temp });
    });
  }

  const handleDownvote = () => {
    fetch(`/api/posts/${_id}/downvote`, {
      method: 'PATCH',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      }
    }).then(response => response.json()).then(({ success, err, message }) => {
      if (err) {
        console.error(err);
        return;
      }

      // Handling successfull downvote (just a UI change)
      const i = findParentPost(_id);
      let temp = postState.posts;

      // Adjusting upvotes
      temp[i].userUpvoted = false;
      temp[i].upvotes = removeByValue(author._id, temp[i].upvotes);

      // Adding downvote
      temp[i].userDownvoted = true;
      temp[i].downvotes.push(author._id);

      setPostState({ loading: postState.loading, posts: temp });
    });
  }

  const findParentPost = (post_id) => {
    const posts = postState.posts;
    for (var i = 0; i < posts.length; i++) {
      if (posts[i]._id === post_id) {
        return i;
      }
    }
  }

  // Removes a value from an array by the value of the element
  const removeByValue = (value, arr) => {
    var i = arr.indexOf(value);
    if (i !== -1) arr.splice(i, 1);
    console.log(`i is ${i}`)
    return arr;
  }

  const setOpen = (value) => {
    let temp = postState.posts;
    var i = findParentPost(_id);
    temp[i].open = value;
    // console.log(postState, { loading: false, posts: });

    setPostState({ loading: postState.loading, posts: temp});
  }

  return (
    <div className={classes}>
      <div className="post-main">
        <div className="post-votes">
          <div className="center-y">
            <span className="upvote"
              onClick={() => userUpvoted ? null :handleUpvote()}>
              <svg
                viewBox="0 0 284.929 284.929">
                <g>
                  <path fill={userUpvoted ? "green" : "black"} d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441
                L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082
                c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647
                c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"/>
                </g>
              </svg>
            </span>

            <span className="vote-count">{upvotes.length - downvotes.length}</span>

            <span className="downvote"
              onClick={() => userDownvoted ? null : handleDownvote()}>
              <svg
                viewBox="0 0 284.929 284.929">
                <g>
                  <path fill={userDownvoted ? "red" : "black"} d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441
                  L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082
                  c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647
                  c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"/>
                </g>
              </svg>
            </span>
          </div>
        </div>

        <div className="post-info">
          <div className="post-top">
            <span className="post-title">{title}</span>
            <span className="by">by</span>
            <div className="author-h">
              <a className="author" href="google.com"
                onMouseOver={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                @{author.username}
              </a>

              {transitions.map(({ item, key, props }) => {
                const profilePic = (
                  <animated.div className="profile-pic" key={key} style={props}>
                    <img src={exampleProfilePic} alt={`@${author}'s Profile`} />
                  </animated.div>
                );

                return (item) ? profilePic : null
              })}

            </div>
          </div>

          <div className="post-body">{body}</div>

          <div
            className="show-comments"
            onClick={() => setOpen(!open)}>{open ? "Hide" : "Show"} Comments</div>
        </div>
      </div>
    
      {open ?
        <div className="post-comments">
          <div className="comments">
            {postComments.map((comment, key) => <Comment {...comment} key={key}/>)}

            <form className="create-comment" onSubmit={(e) => handleCreateComment(e)}>
              <textarea 
                className="body" 
                value={commentFormProps.body}
                onChange={(e) => setCommentFormProps({ ...commentFormProps, body: e.target.value })}
                rows="4"></textarea>
              <input className="submit-comment" type="submit"/>
            </form>
          </div>
        </div>
      : null}
    </div>
  );
}

export default Post;
