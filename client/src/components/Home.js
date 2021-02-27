import React, { useState } from 'react';
import '../css/Home.css';
import Navbar from './Navbar';
import YourFeed from './YourFeed';
import Toolbar from './Toolbar';
import Account from './Account';

function Home({ initialAccountValue, user, setUser }) {
  const [accountValue, setAccountValue] = useState(initialAccountValue); // 0 = no display, 1 = create account, 2 = log in
  
  // Holding all of the posts
  const [postState, setPostState] = useState({
    loading: false,
    posts: null
  });

  const defaultFeedData = { title: "Your Feed", postsUrl: "/api/posts/" };
  const [feedState, setFeedState] = useState(defaultFeedData); // null = default YourFeed, string = username of author

  const feedProps = {
    feedState, 
    setFeedState,
    postState,
    setPostState,
    user,
    defaultFeedData
  }

  const toolbarProps = {
    feedState, 
    setFeedState,
    postState,
    setPostState,
    defaultFeedData
  }

  return (
    <div className="Home">
      <Navbar accountValue={accountValue} setAccountValue={setAccountValue} user={user} setUser={setUser} />

      <div className="main">
        <YourFeed {...feedProps} />
        <Toolbar {...toolbarProps} />

        {accountValue !== 0 &&
          <Account accountValue={accountValue} setAccountValue={setAccountValue} user={user} setUser={setUser} />
        }
        {/* <Account accountValue={accountValue} setAccountValue={setAccountValue} /> */}
      </div>

    </div>
  );
}

export default Home;
