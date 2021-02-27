import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './components/Home';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

/*
    This loads the entirety of the app's frontend
    
    Wait for user data to come in 
        When it does render the app

    In the meantime, just tell the user the app is loading

    When the app is done loading, 
        Either load the switches (which will allow the user to log in/create account if that is the url they chose)
        Or just send the user to the landing page. This will keep them from getting to log in when they are already logged in

*/

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // When the component mounts, fetch user data if there is any
    useEffect(() => {
        fetch('/api/auth/current-user', {
            method: 'GET',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then((response) => response.json()).then(({user}) => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <Router>
            {
            (user !== undefined)
            ? <Switch>
                <Route exact path="/">
                    <Home initialAccountValue={0} user={user} setUser={setUser}/>
                </Route>

                <Route path="/create-account">
                    <Home initialAccountValue={1} user={user} setUser={setUser}/>
                </Route>

                <Route path="/log-in">
                    <Home initialAccountValue={2} user={user} setUser={setUser}/>
                </Route>
            </Switch>
            : <Home initialAccountValue={0} user={user} setUser={setUser}/>}
        </Router>
    );
}

export default App;
