import React from 'react';

function WithListLoading(Component) {
  return function WihLoadingComponent({ isLoading, posts, postState, setPostState }) {
    if (!isLoading && posts != null) return (posts.map((post, key) => <Component key={key} {...post} postState={postState} setPostState={setPostState} /> ))

    return (
      <p style={{ textAlign: 'center', fontSize: '30px' }}>
        Hold on, fetching data may take some time :)
      </p>
    );
  };
}
export default WithListLoading;
