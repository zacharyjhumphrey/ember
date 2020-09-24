import React, { useState } from 'react';
import '../css/Account.css';
import { animated } from 'react-spring';
import classNames from 'classnames';
import useMeasure from 'react-use-measure';

function Account({ accountValue, setAccountValue, user, setUser }) {
  const accountClasses = classNames('Account fade');
  const [createAccountRef, createAccountBounds] = useMeasure();
  const [logInRef, logInBounds] = useMeasure();

  const defaultCreateAccountData = { email: "", username: "", password: "", confirmPassword: "" };
  const [createAccountData, setCreateAccountData] = useState(defaultCreateAccountData);
  const [logInData, setLogInData] = useState({ email: "", password: "" });

  const handleLogIn = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/auth/log-in', {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(logInData)
    }).then(response => response.json()).then((data) => {
      console.dir(data);
      if (data.success) {
        setUser(data.user);
        setAccountValue(0);
      }
    });
  }

  const handleCreateAccount = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/auth/create-account', {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(createAccountData)
    }).then(response => response.json()).then(({ success, errors, user, message }) => {
      if (errors) {
        console.error(errors);

        // Message the errors to the UI
        
        return;
      }

      console.log("I'm still making it here");

      setUser(user);
      setAccountValue(0);
    });
  }

  return (
    <div className={accountClasses}
      style={{
        opacity: (accountValue === 0) ? 0 : 1, 
        zIndex: (accountValue === 0) ? -5 : 20
      }}
      onClick={(e) => {
        if (e.target.classList.contains('fade')) { setAccountValue(0) }
      }}
      >
      <div className="account-modal">
        
        <div className="switch-forms">
          <span ref={createAccountRef} onClick={() => setAccountValue(1)}>Create Account</span>
          <span ref={logInRef} onClick={() => setAccountValue(2)}>Log In</span>

          <div className="form-underline"
          style={{
            width: (accountValue === 1) ? createAccountBounds.width : (accountValue === 2) ? logInBounds.width : null,
            left: (accountValue === 1) ? 0 : null,
            right: (accountValue === 2) ? 0 : null
          }}> </div>
        </div>

        <div className="forms-holder">
          {accountValue === 1 ? 
            <form className="create-account" onSubmit={(e) => handleCreateAccount(e)}>
              <animated.input type="text" name="username" placeholder="Username" 
                onChange={(e) => setCreateAccountData({ ...createAccountData, username: e.target.value })} />
              <animated.input type="text" name="email" placeholder="E-mail" 
                onChange={(e) => setCreateAccountData({ ...createAccountData, email: e.target.value })} />
              <animated.input type="password" name="password" placeholder="Password" 
                onChange={(e) => setCreateAccountData({ ...createAccountData, password: e.target.value })} />
              <animated.input type="password" name="confirm-password" placeholder="Confirm Password" 
                onChange={(e) => setCreateAccountData({ ...createAccountData, confirmPassword: e.target.value })} />
              <animated.button type="submit">Create Account</animated.button>
            </form>
          : null}

          {accountValue === 2 ? 
            <form className="log-in" onSubmit={(e) => handleLogIn(e)}>
              <animated.input
                type="text"
                name="email"
                placeholder="Email"
                value={logInData.username}
                onChange={(e) => setLogInData({ ...logInData, email: e.target.value })}
              />
              <animated.input
                type="password"
                name="password"
                placeholder="Password"
                value={logInData.password}
                onChange={(e) => setLogInData({ ...logInData, password: e.target.value })}
              />
              <animated.button type="submit">Log In</animated.button>
            </form>
          : null}
        </div>
      </div>
    </div>
  );
}

export default Account;
