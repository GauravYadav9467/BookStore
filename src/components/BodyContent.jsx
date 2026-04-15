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
      <div className="content grid grid-cols-1 md:grid-cols-[1fr_7fr] gap-4 md:gap-6 px-2 md:px-8 lg:px-11 py-4 md:py-8 lg:py-12">
        {/* Left Sidebar - Categories - Horizontal on mobile, Vertical on desktop */}
        <div className="left bg-white p-3 md:p-4 lg:p-5 rounded-[10px] w-full md:w-auto md:sticky md:top-4 md:h-fit md:max-h-[calc(100vh-2rem)]">
            <ul className='flex flex-row md:flex-col gap-2 md:gap-0 text-base md:text-lg lg:text-2xl font-bold mb-3 md:mb-5 overflow-x-auto md:overflow-x-visible md:overflow-y-auto'>
                {categories.map(category => (
                  <li key={category} className="py-1 whitespace-nowrap md:whitespace-normal flex-shrink-0 md:flex-shrink">
                    <a
                      href="#"
                      className={`text-[12px] md:text-[14px] lg:text-[15px] flex text-black no-underline transition-colors p-2 rounded-[5px] px-2 duration-200 hover:bg-[#6e6d6e] hover:text-white ${
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

        {/* Right Section - Products */}
        <div className="right bg-white p-2 md:p-3 lg:p-2.5 rounded-[10px] flex flex-wrap gap-2 md:gap-3 lg:gap-4 align-start md:align-middle justify-start md:justify-start w-full">
          {loading ? (
            <p className="text-center w-full py-4 text-sm md:text-base">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <BookCard key={product.id || index} product={product} />
            ))
          ) : (
            <p className="text-center w-full py-4 text-sm md:text-base">No products available in this category</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BodyContent
