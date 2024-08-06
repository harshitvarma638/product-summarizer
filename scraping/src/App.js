import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import Card from './components/Card';

const itemPerPage = 8;

function App() {
  const [url, setUrl] = useState('');
  const [products, setProducts] = useState([]);
  // const [currentPage, setCurrentPage] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({url:url}),
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
        // setCurrentPage(1);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // const indnexOfLastProduct = currentPage * itemPerPage;
  // const indexOfFirstProduct = indnexOfLastProduct - itemPerPage;
  // const currentProducts = products.slice(indexOfFirstProduct, indnexOfLastProduct);

  // const totalPages = Math.ceil(products.length / itemPerPage);

  // const handlePageChange = (page) => {
  //   if(page > 0 && page <= totalPages)
  //   setCurrentPage(page);
  // };

  // const getPageNumbers = () => {
  //   const pageNumbers = [];
  //   const startPage = Math.max(1, currentPage - Math.floor(10/2));
  //   const endPage = Math.min(totalPages, startPage + 10 - 1);

  //   if(startPage > 1){
  //     pageNumbers.push(1);
  //     if(startPage > 2){
  //       pageNumbers.push('...');
  //     }
  //   }

  //   for(let i = startPage; i <= endPage; i++){
  //     pageNumbers.push(i);
  //   }

  //   if(endPage < totalPages){
  //     if(endPage < totalPages - 1){
  //       pageNumbers.push('...');
  //     }
  //     pageNumbers.push(totalPages);
  //   }
  //   return pageNumbers;
  // }
  return (
    <div className='container'>
      <label>Domain Name:
        <form onSubmit={handleSubmit} className='submit'>
          <input type="text" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required/>
          <button type="submit">Start Scraping</button>
        </form>
      </label>
      
      <div>
        <Card products={products}/>
      </div>
      {/* <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active' : ''}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}   
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div> */}
    </div>
  );
}

export default App;
