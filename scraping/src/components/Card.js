import React from 'react';

const Card = ({products}) => {
    return (
        <div className="cards">
            {products.map((product, index) => (
                <div key={index} className='card'>
                    <div className='details'>
                        <div className='title'>
                            <p>{product.imageTitle}</p>
                            <button onClick={()=>window.open(product.link, '_blank')}>Know More</button>
                        </div>
                        <div className="summary">
                            {product.summary.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>
                    <div>
                        <img src={product.image} alt={product.imageTitle} className='img'/>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Card;