import React, { FormEvent } from 'react';
import Leaflet from 'leaflet';
import { FiPlus } from 'react-icons/fi';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { GrFormClose } from 'react-icons/gr';

import aguaIcon from '../../assets/icons/agua.png';
import energiaIcon from '../../assets/icons/energia.png';
import asfaltoIcon from '../../assets/icons/asfalto.png';
import mapMarkerImg from '../../assets/icons/map-marker.svg';
import outrosIcon from '../../assets/icons/outro.png';

import api from '../../services/api';

import Header from '../../Component/Header';

import { useHistory, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ChangeEvent } from 'react';

import './styles.css';

interface ColaboreFormProps {
    latitude: number;
    longitude: number;
    tipo: string;
    location: any;
}


const ColaboreForm = (props: ColaboreFormProps) => {

    const location = useLocation();
    const history = useHistory();
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [about, setAbout] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    if (location.state === undefined) {
        history.push("/");
        window.location.reload();        // return;
    }
    const tipo: string = props.location.state.tipo;

    function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) {
            return;
        }

        const selectedImages = (Array.from(event.target.files));

        setImages(images.concat(selectedImages).slice(0, 5));

        const selectedImagesPreview = selectedImages.map(image => {
            return URL.createObjectURL(image);
        });

        setPreviewImages(previewImages.concat(selectedImagesPreview).slice(0, 5));

        if (images.length > -1) {
            var popup = document.getElementById("myPopup");
            if (popup !== null) popup.classList.remove("show");
        }

    }

    function handleImage(tipo: string) {
        if (tipo === "energia") {
            return energiaIcon;
        } else if (tipo === "agua") {
            return aguaIcon;
        } else if (tipo === "outro") {
            return outrosIcon;
        } else if (tipo === "asfalto") {
            return asfaltoIcon;
        }
        return mapMarkerImg;
    }

    function handleRemoveImages(key: number) {
        let photosImages: File[] = [];

        for (let i = 0; i < images.length; i++) {
            if (key !== i) {
                photosImages.push(images[i]);
            }
        }

        setImages(photosImages);

        const selectedImagesPreview = photosImages.map(image => {
            return URL.createObjectURL(image);
        });

        setPreviewImages(selectedImagesPreview);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const latitude = props.location.state.latitude;
        const longitude = props.location.state.longitude;
        var name = props.location.state.response.name;
        var email = props.location.state.response.email;
        if (props.location.state.response === 'admin') {
            name = "Admin";
            email = "projetoajudacidade@gmail.com"
        }

        const data = new FormData();

        data.append('name', name);
        data.append('street', street);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('tipo', tipo);
        data.append('schedule', 'no_check');
        data.append('deadline', 'no_check');
        data.append('about', about);
        data.append('status_problem', String(false));
        data.append('name_user', name);
        data.append('email', email);

        if (images.length === 0) {
            // alert('Campo fotos obrigatório!!!');

            var popup = document.getElementById("myPopup");
            if (popup !== null) popup.classList.toggle("show");
            return;
        }

        images.forEach(image => {
            data.append('images', image);
        });

        // console.log(name, email);
        await api.post('colaboreform', data);

        history.push({
            pathname: '/colabore',
            state: {
                response: props.location.state.response
            }
        });


        alert('Cadastro realizado com sucesso!');
    }

    return (
        <div className="page-create-ajude">
            <Header title="Formulário" rota="/colabore" data={props.location.state.response} />
            <main>
                <form className="create-ajude-form" onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Dados</legend>
                        <Map
                            className="mymap"
                            center={[props.location.state.latitude, props.location.state.longitude]}
                            zoom={16}
                            zoomControl={false}
                            dragging={false}
                            touchZoom={false}
                            scrollWheelZoom={false}
                            doubleClickZoom={false}

                        >
                            <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker
                                icon={Leaflet.icon({
                                    iconUrl: handleImage(tipo),

                                    iconSize: [20, 30],
                                    iconAnchor: [10, 32],
                                    popupAnchor: [0, -60]
                                })}
                                position={[props.location.state.latitude, props.location.state.longitude]}
                            ></Marker>

                        </Map>

                        <div className="input-block">
                            <label htmlFor="name">Qual problema ?</label>
                            <input
                                placeholder="Ex: Poste sem lâmpada"
                                maxLength={60}
                                className="input-line"
                                value={name}
                                required
                                autoComplete="off"
                                onChange={event => setName(event.target.value)} />

                        </div>
                        <div className="input-block">
                            <label htmlFor="street">Rua, Bairro<span></span></label>
                            <input
                                placeholder="Ex: Praça Mario Batista"
                                className="input-line"
                                id="street"
                                value={street}
                                autoComplete="off"
                                required
                                onChange={event => setStreet(event.target.value)} />
                        </div>
                        <div className="input-block">
                            <label htmlFor="images">Fotos<span>Máximo 5 fotos</span></label>

                            <div className="images-container">
                                {previewImages.map((image, key) => {
                                    return (
                                        <div className="close-images" key={key}>
                                            <img key={image} src={image} alt={image} />
                                            <GrFormClose
                                                id="icon"
                                                size={24}
                                                color="#ff0000"
                                                key={key}
                                                onClick={() => handleRemoveImages(key)}
                                            />
                                        </div>

                                    )
                                })}

                                <label htmlFor="image[]" className="new-image">
                                    <FiPlus size={24} color="#15b6d6" />

                                </label>
                                <div className="popup">
                                    <span className="popuptext" id="myPopup">Foto obrigatória !!!</span>
                                </div>
                            </div>
                            {previewImages.length < 5 && (
                                <input
                                    multiple
                                    onChange={(e) => {
                                        handleSelectImages(e);
                                        (e.target as HTMLInputElement).value = '';
                                    }}
                                    type="file"
                                    id="image[]"

                                />
                            )}
                        </div>

                        <div className="input-block">
                            <label htmlFor="about">Mais informações <span>Máximo de 300 caracteres</span></label>
                            <textarea
                                placeholder="Ex: Digite a descrição do problema!"
                                id="about"
                                maxLength={300}
                                value={about}
                                onChange={event => setAbout(event.target.value)}
                            />
                        </div>
                        <button className="confirm-button" type="submit">
                            Enviar
                        </button>
                    </fieldset>
                </form>
            </main>
        </div>
    )
}

export default ColaboreForm;