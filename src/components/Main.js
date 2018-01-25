/*global chrome*/
import React, { Component } from 'react';
import AppStorage from '../storage/appStorage';
import PasswordStorage from '../storage/passwordStorage'

class Main extends Component {
    constructor(props) {
        super(props);
        this.storage = props.storage;
        this.appStorage = new AppStorage(this.storage);
        this.passwordStorage = new PasswordStorage(this.storage, this.props.master);
        this.state = {
            currentDomain: null,
            existsPassword: false,
            pagePassword: null,
            inputType: 'password'
        }
    }

    componentDidMount() {
        chrome.runtime.sendMessage({action: 'GET_CURRENT_DOMAIN'}, (res) => {
            this.setState({currentDomain: res});
            this.appStorage.getByDomain(res)
            .then((apps) => {
                if (apps && apps.length) {
                    this.passwordStorage.getByAppId(apps[0].id)
                    .then((passwords) => {
                        if (passwords && passwords.length) {
                            this.setState({
                                existsPassword: true,
                                pagePassword: this.passwordStorage.findActivePasswordInObject(passwords[0])
                            });
                        }
                    })
                }
            })
        })
    }

    generateStrongPass() {
        this.setState({pagePassword: 'pass1234.'});
    }

    createPassword() {
        this.appStorage.insert({domain: this.state.currentDomain})
        .then((newApp) => {
            console.log(newApp);
            this.setState({existsPassword: true});
            return this.passwordStorage.createNewPassword(newApp.id, this.state.pagePassword);
        })
        .then((newPass) => {
            this.setState({pagePassword: newPass.passwords[0].value});
        })
    }

    render() {
        let view;
        if (this.state.existsPassword) {
            view = (
                <div className="exists-password">
                    <h4>You have a saved password for {this.state.currentDomain}</h4>
                    <h4>{this.state.pagePassword}</h4>
                </div>
            )
        }
        else {
            view = (
                <div className="exists-password">
                    <h4>You don't have a saved password for {this.state.currentDomain}. Create a new one</h4>
                    <input 
                        type={this.state.inputType} 
                        className="new-password"
                        name="new-password"
                        placeholder="New Password"
                        value={this.state.pagePassword}
                        onChange={(e) => this.setState({pagePassword: e.target.value})}
                    />
                    <div classname="icon-btn">
                        <i className="fas fa-eye"></i>
                    </div>
                    <button 
                        class="btn btn-block" 
                        onClick={this.generateStrongPass.bind(this)}
                    >Generate Strong Password</button>
                    <button 
                        class="btn btn-block btn-primary" 
                        onClick={this.createPassword.bind(this)}
                    >Save Password</button>
                </div>
            )
        }
        return (
            <div className="Main">
                {view}
            </div>
        );
    }
}

export default Main;
