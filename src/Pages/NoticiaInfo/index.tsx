import React, { useEffect, useState } from 'react';

import ImageNoticia from '../../assets/noticia/camacanLogo.jpg';
import ImageSlider from '../../Component/ImageSlider';

import {FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon} from 'react-share';

import BarLoading from '../../assets/loadingBar.gif';

import api from '../../services/api';

import './styles.css';

interface ToogleProps {
    idNoticia: number;
    closeHandler: any;
};

interface News{
    title: string;
    description: string;
    images: {
        id: number;
        url: string;
    }[];
};

const NoticiaInfo: React.FC<ToogleProps> = ({idNoticia, closeHandler}) => {
    const [noticia, setNoticia] = useState<News>();

    useEffect(() => {
        api.get(`noticias/${idNoticia}`).then(response => {
            setNoticia(response.data);
        });
    }, []);

    if(!noticia) {
        // return ;
        return <img src={BarLoading} style={{"textAlign": "center", "width": "100%", "height": "100%"}} alt="Loading..."/>;
    }

    return (
        <div className="container-noticiaInfo">
            <div className="header-noticia">
                <img id="image-header-noticia" src={ImageNoticia} alt="Logo da Cidade"/>
                <h3>{noticia.title}</h3>
                <span className="close" onClick={closeHandler}>
                    &times;
                </span>
            </div>
            <div className="content-noticiaInfo">
                <div className="content">
                    <div className="imageArea">
                        <ImageSlider images={noticia.images}/>
                    </div>
                    <div className="paragraphArea">
                        <p>{noticia.description}</p>
                    </div>
                </div>
                <div className="buttonsSharing"> 
                    <FacebookShareButton 
                        url={"http://www.ajudacidade.tk"}
                        quote={`${noticia.description}`}
                        hashtag="#ajudacidadeapp"
                    >
                        <FacebookIcon className="facebookButton" borderRadius={50} />
                    </FacebookShareButton>
                    <WhatsappShareButton
                        url={"http://www.ajudacidade.tk"}
                        title={`${noticia.description}`}
                    >
                        <WhatsappIcon className="whatsappButton" borderRadius={50} />
                    </WhatsappShareButton>
                
                </div>
            </div>
           
        </div>
    );
}

export default NoticiaInfo;