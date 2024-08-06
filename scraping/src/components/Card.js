import React, {useState} from 'react';

const Card = ({products}) => {
    return (
        <div className="cards">
            {products.map((product, index) => (
                <div key={index} className='card'>
                    <img src={product.image} alt={product.imageTitle} className='img'/>
                    <a href={product.link} target="_blank">Link</a>
                    <p>{product.imageTitle}</p>
                    <div className="summary">
                        {product.summary.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Card;