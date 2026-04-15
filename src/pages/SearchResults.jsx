import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard'
import { getProducts } from '../services/api'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    // Fetch all products
    getProducts().then(res => {
      setProducts(res.data)
      filterProducts(res.data, query)
      setLoading(false)
    }).catch(err => {
      console.error('Error fetching products:', err)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    filterProducts(products, query)
  }, [query, products])

  const filterProducts = (allProducts, searchQuery) => {
    if (!searchQuery.trim()) {
      setFilteredProducts(allProducts)
      return
    }

    const queryLower = searchQuery.toLowerCase()
    const filtered = allProducts.filter(product => {
      const name = (product.name || '').toLowerCase()
      const author = (product.author || '').toLowerCase()
      const publisher = (product.publisher || '').toLowerCase()
      const description = (product.description || '').toLowerCase()
      const categories = product.category || []
      const categoriesStr = categories.map(c => c.toLowerCase()).join(' ')

      return (
        name.includes(queryLower) ||
        author.includes(queryLower) ||
        publisher.includes(queryLower) ||
        description.includes(queryLower) ||
        categoriesStr.includes(queryLower)
      )
    })

    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600 text-lg">
              Found <span className="font-semibold text-blue-600">{filteredProducts.length}</span> result{filteredProducts.length !== 1 ? 's' : ''} for "<span className="font-semibold">{query}</span>"
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading products...</div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600 mb-4">Try searching with different keywords or browse all books</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <div key={product._id || product.id}>
                <BookCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults
