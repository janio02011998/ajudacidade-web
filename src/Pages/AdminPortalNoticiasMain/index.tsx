import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

import BarLoading from '../../assets/loadingBar.gif';
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
    location: any;
}

const AdminPortalNoticiasMain = (props: LoginProps) => {
    const history = useHistory();
    const [isScreen700, setIsScreen700] = useState(window.innerWidth);
    const [news, setNews] = useState<News[]>([]);
    
    // To return if the user try to access the route directly
    if (props.location.state === undefined) {
        history.push("/");
        window.location.reload();        // return;
    }

    const data = (props.location.state.response);
    console.log("Value DATA AdminPortal: ", data);

    useEffect(() => {
        api.get('noticias').then(response => {
            setNews(response.data);
        });
    }, []);
    
    if(!news) {
        // return ;
        return <img src={BarLoading} style={{"textAlign": "center", "width": "100%", "height": "100%"}} alt="Loading..."/>;
    }
    

    function handleResize() {
        // console.log(isScreen700);
        setIsScreen700(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    
    return(
        <div className="container-portalAdmin">
            <Header title="Portal de Notícias" rota="/home"  data={data}/>
            <Link to={{
                    pathname: "/createnoticia",
                    state: {
                        isUpdate: false,
                        response: data
                    }
                }}
                className="create-noticia-button"
            >
                {window.innerWidth >= 700 ? "Criar Noticia" : ""}<FiPlus size={25}/>
            </Link>
            <div className="content-portalAdmin">
                { news.length > 0 ?
                    news.map(noticia => {
                        noticia.isAdmin = true;
                        return( <Noticia key={noticia.id} id={noticia.id} title={noticia.title} description={noticia.description} images={noticia.images} isAdmin={noticia.isAdmin} props={data}/>);
                    })
                    : 
                    <h2>Sem Notícias</h2>
                } 
            </div>
        </div>
    );
};

export default AdminPortalNoticiasMain;
