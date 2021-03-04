import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { GrFormClose } from 'react-icons/gr';

import Header from '../../Component/Header';

import api from '../../services/api';

import './styles.css';

// Interfaces Section
interface ImageNews {
    id: number;
    url: string;
};

// To use in the Update Action
interface NoticiaProps {
    idNoticia: number;
    titleNoticia: string;
    descriptionNoticia: string;
    photosNoticia: ImageNews[];
    isUpdate: boolean;
    location: any;
};

const CreateNoticia = (props?: NoticiaProps | undefined) => {
    // Use the history to change pages
    const history = useHistory();
    
    // To return if the user try to access the route directly
    if (props?.location.state === undefined) {
        history.push("/");
        window.location.reload();        // return;
    }

    const [arrayDeleteImages, setArrayDeleteImages] = useState<Number[]>([]);
    const [arrayAuxDeleteImages, setArrayAuxDeleteImages] = useState<Number[]>([]);
    
    const [titleNoticia, setTitleNoticia] = useState('');
    const [descriptionNoticia, setDescriptionNoticia] = useState('');
    const [photosNoticia, setPhotosNoticia] = useState<File[]>([]);
    const [previewImagesNoticia, setPreviewImagesNoticia] = useState<string[]>([]);
    const idNoticiaNow = props?.location.state !== undefined ? props.location.state.idNoticia : undefined;
    // const isUpdate: boolean = props?.location.state.isUpdate;
    const isUpdate = props?.location.state.isUpdate;
    
    const data = (props?.location.state.response);



    useEffect(() => {
        if(idNoticiaNow !== undefined) {
            api.get(`noticias/${idNoticiaNow}`).then(response => {

                const arrayUrl = response.data.images.map((image: any) => String(image.url));
                const arrayIdImages = response.data.images.map((image: any) => image.id);

                setArrayAuxDeleteImages(arrayIdImages);

                setTitleNoticia(response.data.title);
                setDescriptionNoticia(response.data.description);
                setPhotosNoticia(photosNoticia.concat(response.data.images));
                setPreviewImagesNoticia(previewImagesNoticia.concat(arrayUrl));

            });
        }
    }, []);

    function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
        if(!event.target.files) {
            return;
        }

        const selectedImages = Array.from(event.target.files);

        setPhotosNoticia(photosNoticia.concat(selectedImages));

        const selectedImagesPreview = selectedImages.map(image => {
            return URL.createObjectURL(image);
        });

        setPreviewImagesNoticia(previewImagesNoticia.concat(selectedImagesPreview));
    }

    function handleRemoveImages(key: Number, idImage: Number) {
        // Set the array to save the new array PhotosNoticia
        let photosImages: File[] = [];

        // This loop will find and set only
        for(let i = 0; i < photosNoticia.length; i++) {
            if(key !== i) {
                photosImages.push(photosNoticia[i]);
            } 
        }

        // It's setting the images array will be deleted in the database (typeorm)
        setArrayDeleteImages(arrayDeleteImages.concat(idImage));

        // Updating the array with the id images
        setArrayAuxDeleteImages(arrayAuxDeleteImages.filter((imageId) => (imageId !== (idImage))));

        setPhotosNoticia(photosImages);

        // To update
        let stringPhotosImages = JSON.stringify(photosImages);
        let objectStringPhotos = JSON.parse(stringPhotosImages);
        let urlPhotosImages = [];

        for(let i = 0; i < objectStringPhotos.length; i++) {
            urlPhotosImages.push(objectStringPhotos[i]["url"]);
        }

        const selectedImagesPreview = (!isUpdate) ? photosImages.map(image => {
            return URL.createObjectURL(image);
        }) : (
            urlPhotosImages.map(urlImage => {
                return urlImage;
            })
        );

        // Update
        setPreviewImagesNoticia(selectedImagesPreview);
    }
    

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const data = new FormData();

        data.append('title', titleNoticia);
        data.append('description', descriptionNoticia);
        data.append('arrayImagesDelete', arrayDeleteImages.toString());
        
        photosNoticia.forEach(image => {
            data.append('images', image);
        });

        // Verify if is the update or not
        if(isUpdate) {
            // setArrayDeleteImages(arrayDeletes);
            await api.put(`noticias/${idNoticiaNow}`, data);
            alert('Noticia Atualizada com Sucesso!');
        } else {
            await api.post('noticias', data);
            alert('Noticia Criada com Sucesso!');
        }

        history.push(
            {
                pathname: '/portaladmin',
                state: {
                    response: 'admin'
                }
            });
    }

    return (
        <div className="page-create-noticia">
            <Header title="Criar Notícia" rota="/portaladmin" data={data} />
            <div className="create-noticia">
                <form onSubmit={handleSubmit} className="create-noticia-form">
                    <div className="input-block">
                        <label className="title-noticia" htmlFor="title-noticia">Título da Notícia</label>
                        <input
                            id="input-title-noticia"
                            placeholder="Digite o título da notícia aqui!"
                            maxLength={50}
                            value={titleNoticia}
                            onChange={event => setTitleNoticia(event.target.value)}
                            required
                        />
                    </div>

                    <div className="input-block">
                        <label htmlFor="images">Fotos</label>

                        <div className="images-container">
                            {previewImagesNoticia.map((image, key) => {
                                return(
                                    <div className="close-images" key={key}>
                                        <img key={image} src={image} alt={titleNoticia} />
                                        <GrFormClose
                                            id="icon"
                                            size={24}
                                            color="#ff0000"
                                            key={key}
                                            onClick={() => handleRemoveImages(key, arrayAuxDeleteImages[key])}
                                        />
                                    </div>
                                );
                            })}
                            <label htmlFor="image[]" className="new-image">
                                <FiPlus size={24} color="#15b6d6" />
                            </label>
                        </div>

                        <input
                            multiple
                            onChange={(e) => {
                                handleSelectImages(e);
                                (e.target as HTMLInputElement).value = "";
                            }}
                            type="file"
                            id="image[]"
                        />
                        <p id="textPhotos">Clique aqui para adicionar fotos</p>
                    </div>

                    <div className="input-block">
                        <label htmlFor="description">Descrição <span>Máximo de 1000 caracteres</span></label>
                        <textarea
                            id="description"
                            maxLength={1000}
                            placeholder="Digite a descrição da notícia aqui!"
                            value={descriptionNoticia}
                            onChange={event => setDescriptionNoticia(event.target.value)}
                            required
                        />
                    </div>
                    <button className="confirm-button" type="submit">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateNoticia;
