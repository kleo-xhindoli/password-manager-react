/*global chrome*/
import './styles/main.css';

import React, { Component } from 'react';
import AppStorage from '../storage/appStorage';
import PasswordStorage from '../storage/passwordStorage'

import ExistingPass from './ExistingPass'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDomain: null,
            existsPassword: false,
            pagePassword: null,
            inputType: 'password'
        }
        this.storage = props.storage;
        this.appStorage = new AppStorage(this.storage);
        this.passwordStorage = new PasswordStorage(this.storage);
        this.pwManager = this.props.pwManager;
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
        const p = this.pwManager.generateStrongPassword();
        this.setState({pagePassword: p});
        
    }

    createPassword() {
        this.appStorage.insert({domain: this.state.currentDomain})
        .then((newApp) => {
            let pass = this.encrypt();
            console.log(newApp);
            this.setState({existsPassword: true, pagePassword: pass});
            return this.passwordStorage.createNewPassword(newApp.id, pass);
        })
        .then((newPass) => {
            this.setState({pagePassword: newPass.passwords[0].value});
        })
    }

    toggleShowPass() {
        if (this.state.inputType === 'password')
            this.setState({inputType: 'text'});
        else
            this.setState({inputType: 'password'});
    }

    encrypt() {
        return this.pwManager.encrypt(this.state.pagePassword, this.props.master);
    }

    render() {
        let view;
        if (this.state.existsPassword) {
            view = (
                <ExistingPass master={this.props.master} pwManager={this.pwManager} pagePassword={this.state.pagePassword} />
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
                    <div className="icon-btn" onClick={this.toggleShowPass.bind(this)}>
                        <i className={this.state.inputType === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
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
