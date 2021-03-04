import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../../Component/Header';
import Noticia from '../../Component/Noticia';

import api from '../../services/api';

import "./styles.css";

interface News{
    id: number;
    title: string;
    description: string;
    images: {
        id: number;
        url: string;
    }[];
    isAdmin: boolean;
};

interface LoginProps {
    location: any
}

function PortalNoticiasMain(props: LoginProps) {
    const [news, setNews] = useState<News[]>([]);
    const history = useHistory();

    // To return if the user try to access the route directly
    if (props.location.state === undefined) {
        history.push("/");
        window.location.reload();        // return;
    }

    const data = (props.location.state.response);
    
    useEffect(() => {
        api.get('noticias').then(response => {
            setNews(response.data);
        });
    }, [news]);
    
    return(
        <div className="container-portal">
            <Header title="Portal de Notícias" rota="/home" data={data}/>
            <div className="content-portal">
                { news.length > 0 ?
                    news.map(noticia => {
                        noticia.isAdmin = false;
                        return( <Noticia key={noticia.id} id={noticia.id} title={noticia.title} description={noticia.description} images={noticia.images} isAdmin={noticia.isAdmin} props={data}/>);
                    })
                    :
                    <h2>Sem Notícias</h2>
                } 
            </div>
        </div>
    );
}

export default PortalNoticiasMain;