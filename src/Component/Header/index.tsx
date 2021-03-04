import React from 'react';
import './styles.css';

import logo from '../../assets/logoText.png';
import goBack from '../../assets/goBack.svg';
import { Link, useHistory } from 'react-router-dom';
import AdminIcon from '../../assets/icons/camacan.jpg';
// import { FiLogOut } from 'react-icons/fi';
// import { motion } from "framer-motion";

interface HeaderProps {
    title?: string;
    rota: string;
    data?: any;
};



const Header: React.FC<HeaderProps> = ({ title, rota, data }) => {
    const history = useHistory();

    function handleLogout() {
        history.push({
            pathname: "/",
            state: {
                response: null,
            }
        });

        alert("Saindo.")
    }

    return (
        <div className="header-page">
            <div className="header-top-bar">
                {/* <motion.div className="circular-content"
                    animate={{ scale: 2 }}
                    transition={{ duration: 0.5 }}
                > */}
                <div className="circular-content">
                    {data === 'admin' ? (
                        <Link to={{
                            pathname: `${rota}`,
                            state: {
                                response: 'admin',
                            }
                        }}>
                            <img src={goBack} alt="Logo Ajuda Cidade" />
                        </Link>
                    ) : (
                            <Link to={{
                                pathname: `${rota}`,
                                state: {
                                    response: data,
                                }
                            }}>
                                <img src={goBack} alt="Logo Ajuda Cidade" />;
                            </Link>
                        )}
                    {/* </motion.div> */}
                </div>

                {data !== null && data !== 'admin' ? (
                    <>
                        <h1 className="title">{title}</h1>
                        <div className="dropdown">

                            {/* <motion.div className="circle-div"
                                animate={{ scale: 2 }}
                                transition={{ duration: 0.5 }}
                            > */}
                            <div className="circle-div">
                                <img src={data.picture.data.url} alt="Foto do usúario" className="image-login" />

                            </div>
                            {/* </motion.div> */}
                            <div className="dropdown-content">
                                <p onClick={handleLogout} >Sair</p>
                            </div>
                        </div>
                    </>
                ) : (
                        <>
                            <h1 className="title">{title}</h1>
                            {data === 'admin' ? (
                                <>
                                    <div className="dropdown">
                                        {/* <motion.div
                                            animate={{ scale: 2 }}
                                            transition={{ duration: 0.5 }}
                                        > */}
                                            <img src={AdminIcon} alt="Logo Ajuda Cidade" className="image-login" />
                                        {/* </motion.div> */}
                                        <div className="dropdown-content">
                                            <p onClick={handleLogout} >Sair</p>
                                        </div>
                                    </div>
                                </>

                            ) : (
                                <img src={logo} alt="Logo Ajuda Cidade" />
                                    // <motion.div
                                    //     animate={{ scale: 2 }}
                                    //     transition={{ duration: 0.5 }}
                                    // >
                                        // {/* </motion.div> */}
                                )}
                        </>
                    )}

            </div>
        </div >
    );
};

export default Header;
