import React, { Component } from 'react';
import './App.css';
import Storage from './storage.js'

import CreateMasterPw from './components/CreateMasterPw'
import LogIn from './components/LogIn'

class App extends Component {
    constructor() {
        super();
        this.storage = new Storage();
        this.state = {
            master: null,
            isLogged: false,
        }
    }

    componentDidMount() {
        // this.storage.get('master').then((master) => {
        //     this.setState({ master });
        // })
    }

    createPassword({ newPass, confirmPass }) {
        if (newPass === confirmPass) {
            this.setState({master: newPass}, () => console.log(this.state))
        }
    }

    logIn(pass) {
        if (pass === this.state.master) {
            console.log('perform login')
        }
        else {
            console.log('passwords do not match')
        }
    }

    render() {
        const { master } = this.state;
        if (!master) {
            return (
                <div className="App">
                    <CreateMasterPw onCreatePassword={this.createPassword.bind(this)}/>
                </div>
            );
        }
        return (
            <div className="App">
                <LogIn onLogIn={this.logIn.bind(this)}/>
            </div>
        );
    }
}

export default App;
