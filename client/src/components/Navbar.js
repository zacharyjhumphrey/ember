import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import useMeasure from 'react-use-measure';
import classNames from 'classnames';
import * as easings from 'd3-ease';
import MessageHandler from './MessageHandler';
import userIcon from '../resources/example-profile-pic.png';
import accountIcon from '../resources/account-icon.svg';
import '../css/Navbar.css';

function Navbar({ accountValue, setAccountValue, user, setUser }) {
  const [dropdownIsHidden, hideDropdown] = useState(true);
  const navClasses = classNames('Navbar nav-shadow');

  const [dropdownRef, dropdownBounds] = useMeasure();
  const dropdownClasses = classNames('account-dropdown nav-shadow');
  const dropdownProps = useSpring({
    config: {
      duration: 320,
      easing: easings.easePoly.exponent(3)
    },
    from: {
      right: -300
    },
    right: dropdownIsHidden ? -dropdownBounds.width : 0
  });

  const logout = () => {
    fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    }).then((response) => response.json()).then(({success, message, user}) => {
      console.log(user, success, message);
      if (success) {
        setUser(undefined);
      }
    });
  }

  return (
    <div
      className={navClasses}
      onMouseLeave={() => hideDropdown(true)}>

      <div className="top-bar">
        <div className="logo">Ember</div>

        {/* {<div className="message-h"> <MessageHandler /> </div>} */}

        <div className="navbar-account-section">
          <div className="show-username">@{(user !== undefined) ? user.username : "username"}</div>

          <img src={user === undefined ? accountIcon : userIcon}
            className="account-icon"
            alt="account-icon"
            onClick={() => { if (accountValue === 0) hideDropdown(!dropdownIsHidden) }} />
        </div>
      </div>

      <animated.div
          className={dropdownClasses}
          style={dropdownProps}
          ref={dropdownRef}
          >
        {user === undefined ? 
          <div className="logged-out">
            <span onClick={() => { setAccountValue(1); hideDropdown(true); }}>Create an Account</span>
            <hr></hr>
            <span onClick={() => { setAccountValue(2); hideDropdown(true); }}>Log In</span>
          </div>
        : 
        <div className="logged-in">
          <span>View Account</span>
          <hr></hr>
          <span onClick={() => logout()}>Logout</span>
        </div>}
      </animated.div>
    </div>
  );
}

export default Navbar;
