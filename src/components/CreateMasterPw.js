import React, { Component } from 'react';

class CreateMasterPassword extends Component {
    constructor() {
        super();
        this.newPass = null;
        this.confirmPass = null;
    }

    render() {
        return (
            <div className="CreateMasterPw">
                <h3>Create a new master password</h3>
                <div className="form-wrapper">
                    <input 
                        type="password" 
                        className="master-password" 
                        placeholder="Password"
                        name="master-password-create"
                        onChange={(e) => this.newPass = e.target.value}
                    />
                    <input 
                        type="password" 
                        className="master-password confirm" 
                        placeholder="Confirm Password"
                        onChange={(e) => this.confirmPass = e.target.value}
                    />
                    <button 
                        class="btn btn-block btn-primary" 
                        onClick={() => this.props.onCreatePassword({
                            newPass: this.newPass,
                            confirmPass: this.confirmPass
                        })}
                    >
                        Create Password
                    </button>
                </div>
            </div>
        );
    }
}

export default CreateMasterPassword;
