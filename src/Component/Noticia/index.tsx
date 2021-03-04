import React from 'react';
import { /* FiHeart, FiShare2, FiMessageCircle, */ FiEdit, FiDelete } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import { Popup } from 'reactjs-popup';

// Import the Page NoticiaInfo to use in the button
import NoticiaInfo from '../../Pages/NoticiaInfo';

// Import the API 
import api from '../../services/api';

// Import the Stylesheet
import "./styles.css";

// Interface to use the Page Noticia props in the component
interface NoticiaProps {
    id: number;
    title: string;
    description: string;
    images: {
        id: number;
        url: string;
    }[];
    isAdmin: boolean;
    props: any;
};

interface LoginProps {
    location: any;
}

// Function or Component where the Noticia will be showed
const Noticia : React.FC<NoticiaProps> = ({id, title, description, images, isAdmin, props}) => {
    // const props = useParams<LoginProps>();

    // console.log("Props Noticia: ", props);
    // const data = (props.location.state.response);

    // To delete the news
    async function handleDeleteNoticia(idNoticia: number) {
        let response = window.confirm("Tem certeza que quer excluir a Notícia?");

        if(response) {
            await api.delete(`noticias/${idNoticia}`);
            // console.log("Noticia ", idNoticia, " was deleted forever!");
        }

        window.location.reload();
    };
    
    // Constructor of description in 103 characters
    const countCharacters = (descriptionNoticia: string) => {
        // Aux variable 
        let aux = 0;

        // New description to set in the news
        let descriptionTag = "";

        while(aux < 103 && aux < descriptionNoticia.length){
            if(/\s/g.test(descriptionNoticia)) {
                descriptionTag += descriptionNoticia[aux];
            } else if(descriptionTag.length <= 18) {
                aux = descriptionNoticia.length;
            }
            aux++;
        }

        descriptionTag += " ...";

        return descriptionTag;
    };
    
    return (
        <div className="container-noticia">
            <div className="content-noticia">
                <div className="content-content-noticia">
                    <div className="image">
                        <img src={images[0].url} alt="Camacan Imagem"/>
                    </div>
                    <div className="content">
                        <h3>{title}</h3>
                        <p>{countCharacters(description)}<br/>
                        <Popup
                            trigger={<button>Leia Mais!</button>}
                            modal
            
                        >
                             {(close:any) => ( 
                                    <NoticiaInfo idNoticia={id} closeHandler={close}/>               
                                )
                            }
                        </Popup></p>
                    </div>
                </div>
                <div className="content-buttons">
                    <div className={isAdmin ? "edit-remove-admin" : "no-edit-remove-admin"}>
                        <Link to={{
                            pathname: "/createnoticia",
                            state: {
                                idNoticia: id,
                                isUpdate: true,
                                response: props
                            }
                        }}>
                            <FiEdit className="iconFiEdit" size={20}/>
                        </Link>
                        <FiDelete onClick={() => handleDeleteNoticia(id)} className="iconFiDelete" size={20} />
                    </div>
                </div>
            </div>
            <div className="social-noticia">
              {/*   <p><FiHeart /></p>
                <p><FiShare2 /></p>
                <p><FiMessageCircle /></p> */}
            </div>
        </div>
    );
}

export default Noticia;