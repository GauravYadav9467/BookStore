import React from 'react'
import { Link } from 'react-router-dom'

const BookCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id || product.id}`} className="no-underline">
      <div className="book-card bg-[#e5e6ea] w-56.25 h-80 p-1 rounded-[10px] m-1 pl-1.5 pr-1.5 cursor-pointer hover:shadow-lg transition-shadow">
        <img src={product.image} alt={product.name} className='h-50 w-full object-cover rounded-2xl flexitems-center ' />
        <h3 className="text-lg font-bold mt-2">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.author}</p>
        <p className="text-xs text-gray-500 mt-1">{product.description}</p>
        <p className="text-sm text-gray-800 mt-1 ">{"\u20B9"}{product.price.toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default BookCard
