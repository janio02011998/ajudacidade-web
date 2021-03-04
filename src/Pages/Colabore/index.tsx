import React, { useEffect, useState } from 'react';
import { TileLayer, Map, Marker, Popup } from 'react-leaflet';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Leaflet from 'leaflet';
import { Popup as PopupImg } from 'reactjs-popup';
import Geolocation from '@react-native-community/geolocation';

import Header from '../../Component/Header';
import mapIcon from '../../utils/mapIcon';

import aguaIcon from '../../assets/icons/agua.png';
import inBuildIcon from '../../assets/icons/build.png';
import smileIcon from '../../assets/icons/smile.png';
import outrosIcon from '../../assets/icons/outro.png';
import energiaIcon from '../../assets/icons/energia.png';
import asfaltoIcon from '../../assets/icons/asfalto.png';
import mapMarkerImg from '../../assets/icons/map-marker.svg';
import BarLoading from '../../assets/loadingBar.gif';

import './styles.css';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';
import { FiArrowRight } from 'react-icons/fi';

interface Colabore {
    id: number,
    longitude: number,
    latitude: number,
    name: string,
    tipo: string,
    schedule: string,
    deadline: string,
    about: string,
    status_problem: boolean,
    images: Array<{
        id: number;
        url: string;
    }>;
}

interface LoginProps {
    location: any,
    name: string,
    picture: any,
    response: any,
}

export default function Colabore(props: LoginProps) {
    
    const history = useHistory();
    const location = useLocation();
    const [selected, setSelected] = useState(true);
    const [selectedItem, setSelectedItem] = useState<String>();
    const [position, setPosition] = useState({ latitude: -15.4165288, longitude: -39.493368 });
    const [login, setLogin] = useState(false);
    const [marker, setMaker] = useState(false);
    const [status_admin, setStatusAdmin] = useState(false);
    const [colabore, setColabore] = useState<Colabore[]>([]);
    
    if (location.state === undefined) {
        history.push("/");
        window.location.reload();      
    }

    const data = props.location.state.response;

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var dateNow = year + "-" + month + "-" + day;

    useEffect(() => {

        Geolocation.getCurrentPosition(info => setPosition({ latitude: info.coords.latitude, longitude: info.coords.longitude }));
        api.get('colaboreform').then((response) => {
            setColabore(response.data);
        });

        if (data) {
            setLogin(true);
            if (data ==="admin"){
                setStatusAdmin(true);
            }
        }
    }, []);

    
    if(!colabore) {
        // return ;
        return <img src={BarLoading} style={{"textAlign": "center", "width": "100%", "height": "100%"}} alt="Loading..."/>;
    }

    function handleMapClick(event: LeafletMouseEvent) {
        if (marker) {
            const { lat, lng } = event.latlng;

            setPosition({
                latitude: lat,
                longitude: lng,
            });
            setSelected(true);
            setSelectedItem('');
        }
    }

    function handleSelectItem(selected: boolean, type: string) {
        setSelected(selected);
        setSelectedItem(type);
    }

    function handleImage(colabore: Colabore) {
        if (colabore.tipo === "smile") {
            return smileIcon;
        } else if (colabore.tipo === "energia") {
            return energiaIcon;
        } else if (colabore.tipo === "agua") {
            return aguaIcon;
        } else if (colabore.tipo === "outro") {
            return outrosIcon;
        } else if (colabore.tipo === "asfalto") {
            return asfaltoIcon;
        } else if (colabore.tipo === "build") {
            return inBuildIcon;
        } else {
            return mapMarkerImg;
        }
    }

    async function handleStatusProblemn(colabore_id: number) {
        const data = new FormData();

        data.append('status_problem', String(true));

        await api.put(`colaboreform/${colabore_id}`, data);
    }

    return (
        <div className="colabore-page">

            <Header title="Colabore" rota="/home" data={data} />
            <div className="colabore-main">
                <label className="title">Legenda</label>
                <div className="container-grid">
                    <div className="legend-icons">
                        <img src={smileIcon} alt='Icone de concluído' />
                        <label>Concluído</label>
                    </div>
                    <div className="legend-icons">
                        <img src={inBuildIcon} alt='Icone de Verificado' />
                        <label>Verificado</label>
                    </div>
                    <div className="legend-icons">
                        <img src={aguaIcon} alt='Icone sobre Água' />
                        <label>Água</label>
                    </div>

                    <div className="legend-icons">
                        <img src={energiaIcon} alt='Icone sobre Energia' />
                        <label>Iluminação</label>
                    </div>
                    <div className="legend-icons">
                        <img src={asfaltoIcon} alt='Icone sobre Asfalto' />
                        <label>Asfalto</label>
                    </div>
                    <div className="legend-icons">
                        <img src={outrosIcon} alt='Icone sobre outros' />
                        <label>Outros</label>
                    </div>
                </div>

                <span className="title">Clique no mapa e na sua localização e ajude Camacan.</span>
                {login && (
                    <div className="checkbox-switch">
                        <span className="title">Ative o marcador.</span>
                        <label className="switch">
                            <input type="checkbox" onClick={() => {
                                setMaker(marker ? false : true);
                            }} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                )}
                <Map
                    className="mymap"
                    center={[position.latitude, position.longitude]}
                    zoom={15.2}
                    zoomControl={false}
                    minZoom={15}
                    maxZoom={18}
                    onclick={handleMapClick}
                >
                    <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {colabore.map(colabore_item => {
                        if (colabore_item.deadline === dateNow || colabore_item.status_problem) {
                            handleStatusProblemn(colabore_item.id);
                            return;
                        }
                        return (
                            <Marker
                                icon={Leaflet.icon({
                                    iconUrl: handleImage(colabore_item),

                                    iconSize: [25, 35],
                                    iconAnchor: [10, 32],
                                    popupAnchor: [0, -60]
                                })}
                                position={[colabore_item.latitude, colabore_item.longitude]}
                                key={colabore_item.id}

                            >
                                {login ? (
                                    <Popup
                                        closeButton
                                        minWidth={140}
                                        maxWidth={250}
                                        onOpen={() => {
                                        }}
                                        className="map-popup">
                                        <div className="popup-colabore">
                                            <label id="title-name">{colabore_item.about}</label>
                                            <div className="images-container-popup">
                                                <label htmlFor="image[]">
                                                    {colabore_item.images.map((image, key) => {
                                                        return (
                                                            <PopupImg key={key} trigger={<img key={key} src={image.url} alt={colabore_item.name} />
                                                            } position="top center" modal >

                                                                <img className='imgs-colabore' key={key} src={image.url} alt={colabore_item.name} />
                                                            </PopupImg>
                                                        )
                                                    })}
                                                </label>
                                                {status_admin && (
                                                    <Link to={{
                                                        pathname: `/ajude/${colabore_item.id}`, 
                                                        state: {
                                                            response: 'admin'
                                                        }
                                                    }}>
                                                        <FiArrowRight size={24} color="#15b6d6" />
                                                    </Link>
                                                )}
                                            </div>
                                            <p>{colabore_item.about}</p>
                                            {colabore_item.schedule !== 'no_check' && (
                                                <p>Prazo Conclusão: {colabore_item.schedule}</p>
                                            )}

                                            {colabore_item.deadline !== 'no_check' && (
                                                <p>Prazo Exibição: {colabore_item.deadline}</p>
                                            )}
                                        </div>
                                    </Popup>
                                ) : (
                                        <Popup
                                            closeButton
                                            minWidth={140}
                                            maxWidth={250}
                                            onOpen={() => {
                                            }}
                                            className="map-popup">
                                            <div className="popup-colabore">
                                                <label id="title-name">{colabore_item.about}</label>
                                                <div className="images-container-popup">
                                                    <label htmlFor="image[]">
                                                        {colabore_item.images.map((image, key) => {
                                                            return (
                                                                <PopupImg key={key} trigger={<img key={key} src={image.url} alt={colabore_item.name} />
                                                                } position="top center" modal >

                                                                    <img className='imgs-colabore' key={key} src={image.url} alt={colabore_item.name} />
                                                                </PopupImg>
                                                            )
                                                        })}
                                                    </label>
                                                </div>
                                                <p>{colabore_item.about}</p>
                                                {colabore_item.schedule !== 'no_check' && (
                                                    <p>Prazo Conclusão: {colabore_item.schedule}</p>
                                                )}
                                            </div>
                                        </Popup>
                                    )}
                            </Marker>
                        );
                    })}


                    {marker && (
                        <Marker
                            icon={mapIcon}
                            position={[position.latitude, position.longitude]}
                        >
                            <Popup
                                closeButton={false}
                                minWidth={280}
                                maxWidth={240}
                                className="map-popup">
                                <form>
                                    <fieldset>
                                        <legend>Tipo</legend>

                                        <ul className="items-grid">
                                            <li onClick={() => handleSelectItem(false, 'agua')}
                                                className={selectedItem === 'agua' ? 'selected' : ''}
                                            >
                                                <img src={aguaIcon} alt="" />
                                                <span>Água</span>
                                            </li>
                                            <li onClick={() => handleSelectItem(false, 'energia')}
                                                className={selectedItem === 'energia' ? 'selected' : ''}
                                            >
                                                <img src={energiaIcon} alt="" />
                                                <span>Energia</span>
                                            </li>
                                            <li onClick={() => handleSelectItem(false, 'asfalto')}
                                                className={selectedItem === 'asfalto' ? 'selected' : ''}
                                            >
                                                <img src={asfaltoIcon} alt="" />
                                                <span>Asfalto</span>
                                            </li>
                                            <li onClick={() => handleSelectItem(false, 'outro')}
                                                className={selectedItem === 'outro' ? 'selected' : ''}
                                            >
                                                <img src={outrosIcon} alt="" />
                                                <span>Outro</span>
                                            </li>
                                        </ul>
                                    </fieldset>
                                    {!selected && (
                                        <button type="button">
                                            <Link to={{
                                                pathname: '/colaboreformulario',
                                                state: {
                                                    latitude: position.latitude,
                                                    longitude: position.longitude,
                                                    tipo: selectedItem,
                                                    response: props.location.state.response
                                                }
                                            }}
                                            >Ajudar</Link>
                                        </button>
                                    )}
                                </form>
                            </Popup>
                        </Marker>
                    )}

                </Map>
            </div>
        </div >
    );
}