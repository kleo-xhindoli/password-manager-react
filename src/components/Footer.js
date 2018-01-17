import React, { Component } from 'react';
import './styles/footer.css'

class Footer extends Component {

    render() {
        return (
            <div className="Footer">
                <div className="the-footer">
                    <div className="buttons">
                        <div className="icon-btn">
                            <i className="fas fa-cog"></i>
                        </div>
                        <div className="icon-btn" onClick={() => {console.log('logout'); this.props.onLogOut()}}>
                            <i className="fas fa-power-off "></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;
