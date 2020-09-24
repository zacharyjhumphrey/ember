import React, { useEffect } from 'react';
import classNames from 'classnames';
import '../css/YourFeed.css';
import Post from './Post';
import withListLoading from './withListLoading';

function YourFeed({ feedState, setFeedState, postState, setPostState, user }) {
  const classes = classNames('YourFeed');

  // async onload
  // set loading
  // await fetch for feedState.url
  // apply the posts 

  useEffect(() => {
    setPostState({ loading: true });
    const apiUrl = `${feedState.postsUrl}`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((posts) => {
        // Creating new post members (such as when the post is opened in the ui)
        posts.forEach((post) => {
          post.open = false;

          if (user) {
            // UI variables tracking whether the user has upvoted the post or not
            post.userUpvoted = post.upvotes.includes(user._id) ? true : false;
            post.userDownvoted = post.downvotes.includes(user._id) ? true : false;
          }
        });

        setPostState({ loading: false, posts: posts });
      });
  }, [feedState]);

  // Component Definitions
  const ListLoading = withListLoading(Post);

  return (
    <div className={classes}>
      <div className="title-bar">
        <span className="title">{feedState.title}</span>
      </div>

      <div className="your-feed">
        <ListLoading isLoading={postState.loading} posts={postState.posts} postState={postState} setPostState={setPostState} />
      </div>
    </div>
  );
}

export default YourFeed;
