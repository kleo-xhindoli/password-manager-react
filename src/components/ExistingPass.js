/*global chrome*/
import './styles/main.css';

import React, { Component } from 'react';
import AppStorage from '../storage/appStorage';
import PasswordStorage from '../storage/passwordStorage'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputType: 'password'
        }
        this.pwManager = this.props.pwManager;
    }


    encrypt() {
        return this.pwManager.encrypt(this.props.pagePassword, this.props.master);
    }

    decrypt() {
        return this.pwManager.decrypt(this.props.pagePassword, this.props.master);
    }

    toggleShowPass() {
        if (this.state.inputType === 'password')
            this.setState({inputType: 'text'});
        else
            this.setState({inputType: 'password'});
    }

    render() {
        return (
            <div className="exists-password">
                <h4>You have a saved password for {this.state.currentDomain}</h4>
                <input 
                    type={this.state.inputType} 
                    className="existing-password"
                    name="existing-password"
                    value={this.decrypt()}
                    readonly
                />
                <div className="icon-btn" onClick={this.toggleShowPass.bind(this)}>
                    <i className={this.state.inputType === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
                </div>
            </div>
        );
    }
}

export default Main;
