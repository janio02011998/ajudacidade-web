import React, { useEffect, useState } from 'react';

import logo from '../../assets/logo.png';
import background from '../../assets/background.svg';

import './styles.css';
import { Link, useHistory } from 'react-router-dom';
import adminIcon from '../../assets/icons/admin.png';
import { Popup } from 'reactjs-popup';
import { ImFacebook2 } from 'react-icons/im';

import FacebookLogin from 'react-facebook-login';

import GoogleLogin from 'react-google-login';
import { FormEvent } from 'react';
import api from '../../services/api';

// import { motion } from "framer-motion";

interface Accounts {
    id: number;
    email: string;
    password: string;
}

interface BlockAccountsProps {
    id: number;
    email: string;
    name: string;
    deadline: string;
}

export default function Landing() {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [block_account, setBlockAccount] = useState<BlockAccountsProps[]>([]);
    const [accounts, setAccounts] = useState<Accounts[]>([]);
    var isBlock = false;

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var newdate = year + "-" + month + "-" + day;

    const responseFacebook = (response: any) => {
        console.log(response);

        block_account.forEach(account => {
            if (account.email === email) {
                alert('Conta suspensa até ' + account.deadline);
                isBlock = true;
            }
        });

        if (response.status !== 'unknown' && !isBlock) {
            history.push({
                pathname: '/home',
                state: {
                    response: response
                }
            });
        }
    }

    useEffect(() => {
        api.get('admin_accounts', {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Authorization",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
                "Content-Type": "application/json;charset=UTF-8"
            },
        }).then((response) => {
            setAccounts(response.data);
        });

        api.get('block_account', {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Authorization",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
                "Content-Type": "application/json;charset=UTF-8"
            },
        }).then((response) => {
            setBlockAccount(response.data);
        });

    }, []);

    block_account.forEach(account => {
        if (account.deadline === newdate) {
            api.delete(`delete_account_block/${account.id}`);
        }
    })

    async function responseGoogle(response: any) {

        const email = response.profileObj.email;
        const name = response.profileObj.name;
        const picture = {
            data: {
                url: response.profileObj.imageUrl
            }
        }

        const data = {
            name,
            email,
            picture
        }

        block_account.forEach(account => {
            if (account.email === email) {
                alert('Conta suspensa até ' + account.deadline);
                isBlock = true;
            }
        });

        if (response.status !== 'unknown' && !isBlock) {
            history.push({
                pathname: '/home',
                state: {
                    response: data,
                }
            });
        }
    }

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const data = new FormData();

        data.append('email', email);
        data.append('password', password);

        accounts.forEach(acc => {
            if (acc.email === email && acc.password === password) {
                // console.log("sao iguais");

                history.push({
                    pathname: '/home',
                    state: {
                        response: 'admin',
                    }
                });
            } else {
                alert('Senha ou Email incorretos!');
            }
        })
    }

    return (
        <div className="landing-page">
            <div className="login-admin">
                {/* <RiAdminFill size={60} /> */}
                <Popup trigger={<img src={adminIcon} alt="Login administrador" />
                } position="top center" modal className="popup">
                    <form className="login-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="email"
                            autoComplete="off"
                            onChange={event => setEmail(event.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="password"
                            onChange={event => setPassword(event.target.value)}
                            required
                        />
                        <button type="submit">Login</button>
                    </form>
                </Popup>
            </div>
            <div className="content">
                {/* <motion.div className="content-top"
                    transition={{ delay: 0, duration: 2 }}
                    variants={{
                        show: { opacity: 1, y: '0' },
                        hidden: { opacity: 0, y: '100%' },
                    }}
                    initial="hidden"
                    animate="show"
                > */}
                <div className="content-top">
                    <img alt="Logo ajuda cidade" src={logo} />
                    <h1 className="titulo">O novo jeito de admnistrar e ajudar a sua cidade</h1>
                </div>
                {/* </motion.div> */}
                <div className="section-block">
                    <div className="input-block">

                        <FacebookLogin
                            appId="219399459902681" //APP ID NOT CREATED YET
                            fields="name,email,picture"
                            callback={responseFacebook}
                            cssClass='buttonFacebookGoogle'
                            icon={<ImFacebook2 style={{ marginRight: '10px' }} size={24} />}

                            textButton='Facebook'
                        />
                        <GoogleLogin
                            clientId="805626430205-9tki8rrftnhmj6k19inusoncipp2448u.apps.googleusercontent.com" //APP ID NOT CREATED YET
                            buttonText="GOOGLE"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            className="buttonFacebookGoogle"
                    //
                        />
                    </div>
                    <div className="content-nologin">
                        <h1>Faça o login ou acesse diretamente <Link to={{
                            pathname: "/home",
                            state: {
                                response: null,
                            }
                        }}> aqui</Link></h1>
                    </div>
                </div>
            </div>
            <div className="footer">
                <img alt="imagem background" src={background} />
            </div>
        </div >
    );
}