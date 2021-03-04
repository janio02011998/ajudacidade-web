import React, { useState } from 'react';
import { useEffect } from 'react';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { Popup as PopupImg } from 'reactjs-popup';
import { Link, useHistory, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import Leaflet from 'leaflet';


import aguaIcon from '../../assets/icons/agua.png';
import inBuildIcon from '../../assets/icons/build.png';
import smileIcon from '../../assets/icons/smile.png';
import outrosIcon from '../../assets/icons/outro.png';
import energiaIcon from '../../assets/icons/energia.png';
import asfaltoIcon from '../../assets/icons/asfalto.png';
import mapMarkerImg from '../../assets/icons/map-marker.svg'; 
import BarLoading from '../../assets/loadingBar.gif';


import Header from '../../Component/Header';
import api from '../../services/api';

import './styles.css';
import { FormEvent } from 'react';
import { FiDelete } from 'react-icons/fi';
import { ImBlocked } from 'react-icons/im';

interface Colabore {
    id: number,
    longitude: number,
    latitude: number,
    name: string,
    street: string,
    tipo: string,
    schedule: string,
    about: string,
    deadline: string,
    name_user: string,
    email: string,
    images: Array<{
        id: number;
        url: string;
    }>;
}

interface ColaboreAdminParams {
    id: string;
    data: any;
}

export default function ColaboreAdmin() {

    const history = useHistory();
    const params = useParams<ColaboreAdminParams>();
    const [colabore, setColabore] = useState<Colabore>();
    const [schedule, setSchedule] = useState('');

    useEffect(() => {
        api.get(`colaboreform/${params.id}`).then(response => {
            setColabore(response.data);
        });
    }, [params.id, schedule]);

    
    if(!colabore) {
        // return ;
        return <img src={BarLoading} style={{"textAlign": "center", "width": "100%", "height": "100%"}} alt="Loading..."/>;
    }

    function handleImage(tipo: string) {
        if (tipo === "energia") {
            return energiaIcon;
        } else if (tipo === "smile") {
            return smileIcon;
        } else if (tipo === "outro") {
            return outrosIcon;
        } else if (tipo === "agua") {
            return aguaIcon;
        } else if (tipo === "asfalto") {
            return asfaltoIcon;
        } else if (tipo === "build") {
            return inBuildIcon;
        } else {
            return mapMarkerImg;
        }
    }

    async function handleSubmitPopup(event: FormEvent) {
        event.preventDefault();

        const data = new FormData();
        var tipo = '';
        if (colabore !== undefined) {
            if (colabore.deadline === 'no_check') {
                tipo = 'build';
            } else {
                tipo = 'smile';
            }
        }

        data.append('tipo', tipo);
        data.append('schedule', schedule);
        await api.put(`colaboreform/${params.id}`, data);

        history.push({
            pathname: '/colabore',
            state: {
                response: 'admin'
            }
        });

        alert('Cadastro realizado com sucesso!');
    }

    async function handleResolved(event: FormEvent) {
        event.preventDefault();

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        var maxDays = new Date(year, month, 0).getDate();
        var aux = 14;

        if (day + 14 <= maxDays) {
            day = day + 14;
        } else {
            month++;
            while (day++ <= maxDays) {
                aux--;
                continue;
            }
            day = aux;
        }

        var newdate = year + "-" + month + "-" + day;

        const data = new FormData();

        data.append('tipo', 'smile');
        data.append('deadline', newdate);
        await api.put(`colaboreform/${params.id}`, data);

        history.push({
            pathname: '/colabore',
            state: {
                response: 'admin'
            }
        });

        alert('Problema Resolvido!!!');
    }

    async function handleDeleteColabore() {

        if (window.confirm("A postagem será excluída, deseja prosseguir ?")) {
            await api.delete(`colaboreform/${params.id}`);
            alert('Deletado!');
        }
        history.push({
            pathname: '/colabore',
            state: {
                response: 'admin'
            }
        });
    }

    async function handleBlockAccount(colabore: Colabore) {

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        var maxDays = new Date(year, month, 0).getDate();
        var aux = 7;

        if (day + 7 <= maxDays) {
            day = day + 7;
        } else {
            month++;
            while (day++ <= maxDays) {
                aux--;
                continue;
            }
            day = aux;
        }

        var newdate = year + "-" + month + "-" + day;

        if (window.confirm("O usuario será bloqueado por 7 dias, deseja prosseguir ?")) {
            await api.post('block_account', {
                name: colabore.name_user,
                email: colabore.email,
                deadline: newdate
            });
        }
    }

    return (
        <div className="colabore-admin">
            <Header title="Informações" rota="/colabore" data='admin' />

            <div className="content-main">
                <div className="informations">

                    <div className="input-label">
                        <label htmlFor="title">Localização</label>
                        <p>{colabore.street}</p>
                    </div>
                    <div className="input-label">
                        <label htmlFor="title">Descrição do problema</label>
                        <p>{colabore.about}</p>
                    </div>
                    <div className="input-label">
                        <label htmlFor="title">Imagens</label>
                        <div className="images-container">
                            {colabore.images.map((image, key) => {
                                return (
                                    <PopupImg key={key} trigger={<img key={colabore.id} src={image.url} alt="Imagem sobre o problema" />
                                    } position="top center" modal >

                                        <img key={key} src={image.url} alt="Imagem sobre o problema" />
                                    </PopupImg>
                                )

                            })}
                           
                        </div>
                        {colabore.schedule !== 'no_check' && (
                            <div className="input-label">
                                <label htmlFor="title">Prazo atual </label>
                                <p>{colabore.schedule}</p>

                            </div>
                        )}

                    </div>
                </div>

                <div className="map">
                    <Map
                        className="mymap"
                        center={[colabore.latitude, colabore.longitude]}
                        zoom={16.5}
                        zoomControl={false}
                        dragging={false}
                        touchZoom={false}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                    >
                        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker
                            icon={Leaflet.icon({
                                iconUrl: handleImage(colabore.tipo),

                                iconSize: [25, 35],
                                iconAnchor: [10, 32],
                                popupAnchor: [0, -60]
                            })}
                            position={[colabore.latitude, colabore.longitude]}
                            key={colabore.id}
                            interactive={false}
                        ></Marker>
                    </Map>
                    <div className="autor-info">
                        <div className="input-label">
                            <label htmlFor="title">Autor</label>
                            <p>{colabore.name_user}</p>
                            <p>{colabore.email}</p>
                        </div>
                        <div className="input-label">
                            <label htmlFor="title">Opções</label>
                            <p>Deletar Postagem:
                                <FiDelete
                                    size={24}
                                    onClick={handleDeleteColabore}
                                    color="red"
                                ></FiDelete></p>
                            <p>Bloquear Usuário:
                                <ImBlocked
                                    size={24}
                                    color="red"
                                    onClick={() => handleBlockAccount(colabore)}
                                >
                                </ImBlocked></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="input-link">

                {colabore.schedule !== 'no_check' ? (
                    <Popup trigger={<Link to='#'>Atualizar Prazo</Link>
                    } position="top center" modal={true}>
                        <legend>Definir Prazo</legend>
                        <form onSubmit={handleSubmitPopup}>
                            <div className="data">
                                <label htmlFor="">Previsão</label>
                                <input
                                    name="schedule"
                                    type="date"
                                    value={schedule}
                                    onChange={e => setSchedule(e.target.value)}
                                />
                            </div>

                            <button type="submit">Registrar</button>
                        </form>
                    </Popup>
                ) : (
                        <Popup trigger={<Link to='#'>Definir Prazo</Link>
                        } position="top center" modal={true}  >
                            <legend>Definir Prazo</legend>
                            <form onSubmit={handleSubmitPopup}>
                                <div className="data">
                                    <label htmlFor="">Previsão</label>
                                    <input
                                        name="schedule"
                                        type="date"
                                        value={schedule}
                                        onChange={e => setSchedule(e.target.value)}
                                    />
                                </div>

                                <button type="submit">Registrar</button>
                            </form>
                        </Popup>
                    )}

                <Link to="/colabore" onClick={handleResolved}>Resolver</Link>
            </div>
        </div>
    );
}