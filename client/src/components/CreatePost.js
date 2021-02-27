import React, { useState } from 'react';
import '../css/CreatePost.css';
import classNames from 'classnames';

function CreatePost({ left, z, postState, setPostState }) {
  const createPostClasses = classNames({
    'Tool': true,
    'CreatePost': true,
    'current-tool': false
  });

  const defaultFormData = { title: "", body: "" };
  const [formData, setFormData] = useState(defaultFormData);

  // Sending request to create new post to the server
  const handleFormSubmit = (e) => {
    e.preventDefault();

    fetch('/api/posts/', {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(formData)
    }).then(response => response.json()).then(({ success, message, err, data }) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(message);
      console.log(data);

      /* Handling successful creation of post
          Clear out the form
          Flash a message to the user that a post has been created
          Add this post to the list of posts
      */

      setFormData(defaultFormData);

      // Flash message

      setPostState({ posts: [data, ...postState.posts] });

    });
  }

  return (
    <div className={createPostClasses} style={{ left: `${left}%`, transform: `perspective(600px) translateZ(${z}px)` }}>
      <form onSubmit={(e) => handleFormSubmit(e)}>
        <input 
          className="create-post-title" 
          name="title" 
          value={formData.title} 
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          placeholder="Post Name" />
        <textarea 
          className="create-post-body" 
          name="body" 
          value={formData.body} 
          onChange={(e) => setFormData({ ...formData, body: e.target.value })} 
          placeholder="Post Body"></textarea>
        <button type="submit" className="create-post-submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
