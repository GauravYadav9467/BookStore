import React from 'react'
import { Link } from 'react-router-dom'

const truncateText = (text, maxWords = 5) => {
  if (!text) return ''
  const words = text.split(' ')
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...'
  }
  return text
}

const BookCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id || product.id}`} className="no-underline">
      <div className="book-card bg-[#e5e6ea] w-56.25 h-80 p-1 rounded-[10px] m-1 pl-1.5 pr-1.5 cursor-pointer hover:shadow-lg transition-shadow">
        <img src={product.image} alt={product.name} className='h-50 w-full object-cover rounded-2xl flexitems-center' loading="lazy" />
        <h3 className="text-sm font-bold mt-2 line-clamp-1">{truncateText(product.name, 5)}</h3>
        <p className="text-sm text-gray-600 line-clamp-1">{truncateText(product.author, 5)}</p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{truncateText(product.description, 5)}</p>
        <p className="text-sm text-gray-800 mt-1 ">{"\u20B9"}{product.price.toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default BookCard
