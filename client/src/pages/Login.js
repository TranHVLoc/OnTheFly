import React from "react";

const Login = (props) => {
    // The URL of Github OAuth route
    const AUTH_URL = `${props.api_url}/auth/github`;

    return (
        <div className="Login">
            <h1>On The Fly ✈️</h1>
            <center>
                <a href={AUTH_URL}>
                    <button className="headerBtn">🔐 Login with GitHub</button>
                </a>
            </center>
        </div>
    )
}

export default Login;