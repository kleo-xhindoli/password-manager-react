/*global chrome*/
import React, { Component } from 'react';
import AppsStorage from '../storage/appStorage'

class Main extends Component {
    constructor(props) {
        super(props);
        this.storage = props.storage;
        this.appsStorage = new AppsStorage(this.storage);
        this.state = {
            currentDomain: null,
            existsPassword: false
        }
    }

    componentDidMount() {
        chrome.runtime.sendMessage({action: 'GET_CURRENT_DOMAIN'}, (res) => {
            this.appsStorage.getByDomain(res)
            .then((apps) => {
                if (apps && apps.length) {
                    this.setState({
                        currentDomain: res,
                        existsPassword: true
                    })
                }
                else {
                    this.setState({
                        currentDomain: res
                    });
                }
            })
        })
    }

    createPassword() {
        this.appsStorage.insert({domain: this.state.currentDomain})
        .then(() => {
            this.setState({existsPassword: true});
        })
    }

    render() {
        let view;
        if (this.state.existsPassword) {
            view = (
                <div className="exists-password">
                    <h4>You have a saved password for {this.state.currentDomain}</h4>
                </div>
            )
        }
        else {
            view = (
                <div className="exists-password">
                    <h4>You don't have a saved password for {this.state.currentDomain}</h4>
                    <button class="btn btn-block btn-primary" onClick={this.createPassword.bind(this)}>Create Password</button>
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
