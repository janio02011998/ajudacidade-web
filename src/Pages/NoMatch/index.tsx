import React from 'react';


import logo from '../../assets/logo.png';

import "./styles.css";

const NoMatch = () => {
    return (
        <div className="no-match-container">
            <div className="content">
                <img alt="Logo ajuda cidade" src={logo} />
                <span>Desculpe, essa página não está disponível.</span>
                <span>Acesse a nossa página incial<a href="http://localhost:3000">aqui</a></span>
            </div>
        </div>
    );
}

export default NoMatch;