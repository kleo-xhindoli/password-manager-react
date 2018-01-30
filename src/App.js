/*global chrome*/
import React, { Component } from 'react';
import './App.css';
import Storage from './storage/storage'
import PasswordManager from './passwordManager'

import CreateMasterPw from './components/CreateMasterPw'
import LogIn from './components/LogIn'
import Footer from './components/Footer'
import Main from './components/Main'

class App extends Component {
    constructor() {
        super();
        this.storage = new Storage();
        this.pwManager = new PasswordManager();


        this.state = {
            isSetMaster: false,
            isLogged: false,
            master: null
        }
    }

    componentDidMount() {
        chrome.runtime.sendMessage({action: "GET_STATE"}, (response) => {
            this.setState(response)
        });

        chrome.runtime.sendMessage({action: 'GET_MASTER'}, (val) => {
            this.setState({master: val});
        });
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
                let master = this.pwManager.generateKeyFromPassword(pass, salt);
                this.setState({isLogged: true, master});
                chrome.runtime.sendMessage({action: 'SET_STATE', params: {isLogged: true}}, () => {
                    chrome.runtime.sendMessage({action: 'SET_MASTER', value: master});
                });
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
            view = <Main master={this.state.master} storage={this.storage} pwManager={this.pwManager}/>
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
