import React, { useState } from 'react'
import BookCard from './BookCard'

const BodyContent = ({ products, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Books')

  const categories = [
    'All Books',
    'Railway',
    'Defence',
    'SSC',
    'Banking',
    'GK',
    'Biography',
    'History',
    'English',
    'Maths',
    'Reasoning'
  ]

  const filteredProducts = selectedCategory === 'All Books' 
    ? products 
    : products.filter(product => product.category && product.category.includes(selectedCategory))

  return (
    <div>
      <div className="content grid grid-cols-[1fr_7fr] gap-6 px-11 py-12">
        <div className="left bg-white p-5 rounded-[10px]">
            <ul className='text-2xl font-bold mb-5'>
                {categories.map(category => (
                  <li key={category}>
                    <a 
                      href="#" 
                      className={`text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 w-full duration-200 hover:bg-[#6e6d6e] hover:text-white ${
                        selectedCategory === category ? 'bg-[#6e6d6e] text-white' : ''
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        setSelectedCategory(category)
                      }}
                    >
                      {category}
                    </a>
                  </li>
                ))}
            </ul>
        </div>
        <div className="right bg-white p-2.5 rounded-[10px] flex flex-wrap gap-4.25 align-middlev justify-start mr-3.5">
          {loading ? (
            <p>Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <BookCard key={product.id || index} product={product} />
            ))
          ) : (
            <p>No products available in this category</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BodyContent
