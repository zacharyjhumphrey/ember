import React, { useState, useEffect } from 'react';
import '../css/SearchTool.css';
import classNames from 'classnames';

/*
  OOO: 
  When I click on a user in search tool,
    the feed name changes to username
    the feed loads the posts by the user by using the search/user/:userId route
*/

function SearchTool({ left, z, feedState, setFeedState, defaultFeedData }) {
  const searchToolClassNames = classNames({
    'SearchTool': true,
    'Tool': true,
    'current-tool': true
  });
  const [didMount, setDidMount] = useState(false);

  // Set the state of the application to mounted
  useEffect(() => setDidMount(true), []);

  const [results, setResults] = useState([]);

  const handleSearchUser = (substring) => {
    fetch(`/api/search/users/${substring}`, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      }
    }).then(response => response.json()).then(({ users }) => {
      setResults(users);
    });
  }

  if (!didMount) return null;
  return (
    <div 
      className={searchToolClassNames} 
      style={{ 
        left: `${left}%`, 
        transform: `perspective(600px) translateZ(${z}px)` 
      }}>

      <div className="search-bar">
        <span className="at author">@</span>
        <input name="search-bar" placeholder="Search..."
          onChange={(e) => (e.target.value !== "") ? handleSearchUser(e.target.value) : setResults([]) } />
      </div>

      <div className="display-result" style={{ display: (results !== []) ? "block" : "none" }}>
        {results.map((result, key) => (
          <div className="result" key={key}>
            <span className="author" onClick={() => setFeedState({ ...feedState, title: `@${result.username}`, postsUrl: `/api/search/user/${result._id}` })} >@{result.username}</span>
            <span className="email">{result.email}</span>
          </div>
        ))}
      </div>

      <div className="return-to-feed author" 
        style={{ display: (defaultFeedData.postsUrl === feedState.postsUrl) ? "none" : "block" }}
        onClick={() => setFeedState(defaultFeedData)} >
        Return to My Feed
      </div>
    </div>
  );
}

export default SearchTool;
