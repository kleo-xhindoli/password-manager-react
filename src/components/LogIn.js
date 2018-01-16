import React, { Component } from 'react';

class LogIn extends Component {
    constructor() {
        super();
        this.password = null;
    }

    render() {
        return (
            <div className="LogIn">
                <h3>Enter the master password</h3>
                    <div className="form-wrapper">
                        <input 
                            type="password" 
                            className="master-password login"
                            name="master-password-login"
                            placeholder="Master Password"
                            onChange={(e) => this.password = e.target.value}
                        />
                        <button class="btn btn-block btn-primary" onClick={() => this.props.onLogIn(this.password)}>Log In</button>
                    </div>
            </div>
        );
    }
}

export default LogIn;
