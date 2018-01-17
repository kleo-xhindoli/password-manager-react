/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import Storage from './storage.js'
import PasswordManager from './passwordManager.js'

import CreateMasterPw from './components/CreateMasterPw'
import LogIn from './components/LogIn'
import Footer from './components/Footer'

class App extends Component {
    constructor() {
        super();
        this.storage = new Storage();
        this.pwManager = new PasswordManager();
        this.master = null;
        this.state = {
            isSetMaster: false,
            isLogged: false,
        }
    }

    componentDidMount() {
        chrome.runtime.sendMessage({action: "GET_STATE"}, (response) => {
            console.log(response);
            this.setState(response, () => {
                console.log(this.state)
            })
        });

        chrome.runtime.sendMessage({action: 'GET_MASTER'}, (val) => {
            console.log(`Got master: ${val}`)
            this.master = val;
        })
    }

    createPassword({ newPass, confirmPass }) {
        if (newPass === confirmPass) {
            this.setState({isSetMaster: true}, () => {
                // this.master = newPass;
                const { hash, salt } = this.pwManager.hash(newPass);
                this.storage.set('master', hash);
                this.storage.set('salt', salt);
            })
            chrome.runtime.sendMessage({action: 'SET_STATE', params: {isSetMaster: true}});
        }
        else {
            console.log('passwords do not match');
        }
    }

    logIn(pass) {
        let masterHash;
        this.storage.get('master')
        .then((master) => {
            masterHash = master;
            return this.storage.get('salt')
        })
        .then((salt) => {
            if (this.pwManager.hash(pass, salt).hash === masterHash) {
                this.master = this.pwManager.generateKeyFromPassword(pass, salt);
                this.setState({isLogged: true});
                chrome.runtime.sendMessage({action: 'SET_STATE', params: {isLogged: true}})
                chrome.runtime.sendMessage({action: 'SET_MASTER', value: this.master})
            }
            else {
                console.log('passwords do not match')
            }
        })
    }

    logOut() {
        //TODO: CHANGE THIS
        this.storage.clear()
        .then(() => {
            this.setState({isSetMaster: false, isLogged: false});
            chrome.runtime.sendMessage({action: 'SET_STATE', params: {isSetMaster: false, isLogged: false}})
        })
    }

    render() {
        const { isSetMaster, isLogged } = this.state;
        let view;
        if (!isSetMaster) {
            view = <CreateMasterPw onCreatePassword={this.createPassword.bind(this)}/>
        }
        else if (!isLogged){
            view = <LogIn onLogIn={this.logIn.bind(this)}/>
        }
        else {
            view = <h1>You are logged in {this.master}</h1>
        }

        return (
            <div className="App">
                { view }
                <Footer onLogOut={this.logOut.bind(this)}/>
            </div>
        );
    }
}

export default App;
