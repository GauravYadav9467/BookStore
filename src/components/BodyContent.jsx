import React from 'react'
import BookCard from './BookCard'

const BodyContent = ({ products, loading }) => {
  return (
    <div>
      <div className="content grid grid-cols-[1fr_7fr] gap-6 px-11 py-12">
        <div className="left bg-white p-5 rounded-[10px]">
            <ul className='text-2xl font-bold mb-5'>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">All Books</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">Fiction</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">Programming</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">Non-Fiction</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">Self Help</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">All Books</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">Biography</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">History</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">Cooking</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">Fantasy</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">SSC</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">NTPC</a></li>
                <li><a href="#" className="text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white">RRB</a></li>
            </ul>
        </div>
        <div className="right bg-white p-2.5 rounded-[10px] flex flex-wrap gap-4.25 align-middlev justify-start mr-3.5">
          {loading ? (
            <p>Loading products...</p>
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <BookCard key={product.id || index} product={product} />
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BodyContent
