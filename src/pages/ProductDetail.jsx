import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../services/api'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    getProductById(id)
      .then(res => {
        setProduct(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError('Product not found')
        setLoading(false)
      })
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      const cartItem = {
        productId: product._id || product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      }
      // Add to cart logic - could store in localStorage or send to backend
      const existingCart = JSON.parse(localStorage.getItem('cart')) || []
      const existingItem = existingCart.find(item => item.productId === cartItem.productId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        existingCart.push(cartItem)
      }

      localStorage.setItem('cart', JSON.stringify(existingCart))
      setAddedToCart(true)

      // Reset message after 2 seconds
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // Navigate to checkout page
    navigate('/checkout')
  }

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">Loading product details...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-2xl text-red-600">{error || 'Product not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
      >
        ← Back to Products
      </button>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-xl text-gray-600 mb-4">by {product.author}</p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
                <span className="ml-2 text-gray-600">(250+ reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
                <p className="text-lg text-green-600 font-semibold">In Stock</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Additional Details */}
              <div className="mb-6 border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-semibold text-gray-900">{product.category || 'Books'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Publisher</p>
                    <p className="font-semibold text-gray-900">{product.publisher || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Language</p>
                    <p className="font-semibold text-gray-900">{product.language || 'English'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Pages</p>
                    <p className="font-semibold text-gray-900">{product.pages || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Action Buttons */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-lg font-semibold text-gray-900">Quantity:</label>
                <select
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Success Message */}
              {addedToCart && (
                <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                  ✓ Added to cart successfully!
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition duration-200"
                >
                  Buy Now
                </button>
              </div>

              {/* Delivery Info */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  <svg className="w-4 h-4 inline mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  Free Delivery on orders above ₹500
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
