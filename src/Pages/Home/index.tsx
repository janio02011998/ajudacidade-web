import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import logo from '../../assets/logo.png';
import background from '../../assets/background.svg';

import './styles.css';
import Header from '../../Component/Header';

interface LoginProps {
    response?: any,
    session: any,
    location: any,
}

export default function Home(props: LoginProps) {

    const history = useHistory();
    const location = useLocation();
    
    if (location.state === undefined) {
        history.push("/");
        window.location.reload();       
    }
    
    const response = props.location.state.response === null ? null : props.location.state.response;
    
    return (
        <div className="home-page">
            <div className="header">
                <Header data={response} rota='/' />
            </div>

            <div className="content">
                <div className="content-top">
                    <img alt="Logo ajuda cidade" src={logo} />
                    <h1 className="titulo">O novo jeito de admnistrar e ajudar a sua cidade</h1>
                </div>

                <div className="input-link">
                    {(response === 'admin') ? (
                        <Link to={{
                            pathname: '/portaladmin',
                            state: {
                                response,
                            }
                        }} className="labelBtn">Portal de Notícias</Link>
                    ) : 
                        <Link to={{
                            pathname: '/portal',
                            state: {
                                response,
                            }
                        }} className="labelBtn">Portal de Notícias</Link>
                    }
                    <Link to={{
                        pathname: '/colabore',
                        state: {
                            response,
                        }
                    }}>Colabore</Link>
                </div>
            </div>

            <div className="footer">
                <img alt="imagem background" src={background} />
            </div>
        </div>
    );
}