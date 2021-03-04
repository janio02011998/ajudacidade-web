import React, { useState } from "react";

import "./styles.css";

interface ImageProps {
    images: {
        id: number;
        url: string;
    }[];
};

const ImageSlider: React.FC<ImageProps> = ({images}) => {
    const [index, setIndex] = useState(0);

    const slideRight = () => {
        setIndex((index + 1) % images.length);
    };

    const slideLeft = () => {
        const nextIndex = index - 1;
        
        if(nextIndex < 0) {
            setIndex(images.length - 1);
        } else {
            setIndex(nextIndex);
        }
    };

    const imagesNoticia = images.length > 0 && images.map((image, id) => {
        const classImage = (id === index) ? "currentImage" : "otherImage";
        

        return(
            <div className={classImage} key={id}>
                <button className="previous" onClick={slideLeft}>&#10094;</button>
                <img src={image.url} className="currentImage" alt="Imagens de Camacan"/>
                <button className="next" onClick={slideRight}>&#10095;</button>
            </div>
        );
    });

    // console.log(imagesNoticia);

    return(
        <>
            {imagesNoticia}
        </>
    );
}

export default ImageSlider;