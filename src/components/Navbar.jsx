import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getProducts } from '../services/api'

function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [greeting, setGreeting] = useState('')
  const [pendingOrders, setPendingOrders] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return 'Good Morning'
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon'
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening'
    } else {
      return 'Good Night'
    }
  }

  // Fetch products for search
  useEffect(() => {
    getProducts().then(res => {
      setAllProducts(res.data)
    }).catch(err => {
      console.error('Error fetching products:', err)
    })
  }, [])

  useEffect(() => {
    if (user) {
      setGreeting(getGreeting())
    }
  }, [user])

  // Fetch pending orders count for seller
  useEffect(() => {
    if (user?.role === 'seller' && token) {
      fetchPendingOrdersCount()
      // Refresh every 30 seconds
      const interval = setInterval(fetchPendingOrdersCount, 30000)
      return () => clearInterval(interval)
    }
  }, [user, token])

  const fetchPendingOrdersCount = async () => {
    try {
      const response = await fetch('/api/seller/orders/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setPendingOrders(data.pendingCount || 0)
      }
    } catch (err) {
      console.error('Error fetching pending orders:', err)
    }
  }

  useEffect(() => {
    // Update cart count when cart changes
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || []
      const count = cart.reduce((total, item) => total + item.quantity, 0)
      setCartCount(count)
    }

    updateCartCount()
    window.addEventListener('storage', updateCartCount)

    // Also check periodically for localStorage changes from same tab
    const interval = setInterval(updateCartCount, 500)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      clearInterval(interval)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowDropdown(false)
  }

  const handleNavigate = (path) => {
    navigate(path)
    setShowDropdown(false)
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim().length === 0) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Filter products based on query
    const queryLower = query.toLowerCase()
    const filtered = allProducts.filter(product => {
      const name = (product.name || '').toLowerCase()
      const author = (product.author || '').toLowerCase()
      const publisher = (product.publisher || '').toLowerCase()
      const categories = product.category || []
      const categoriesStr = categories.map(c => c.toLowerCase()).join(' ')

      return (
        name.includes(queryLower) ||
        author.includes(queryLower) ||
        publisher.includes(queryLower) ||
        categoriesStr.includes(queryLower)
      )
    }).slice(0, 8) // Limit to 8 suggestions

    setSuggestions(filtered)
    setShowSuggestions(true)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product._id || product.id}`)
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <nav className='flex items-center justify-between bg-white py-2 px-2 md:px-4 lg:px-6 shadow-md gap-1.5 md:gap-3 lg:gap-4 flex-wrap min-h-16'>
      {/* Logo */}
      <Link to="/" className="no-underline flex-shrink-0">
        <h2 className="text-base sm:text-lg md:text-2xl lg:text-3xl text-gray-900 hover:text-blue-600 transition font-bold whitespace-nowrap">BookStore</h2>
      </Link>

      {/* Search Bar - Visible on all sizes */}
      <div className="relative flex-1 min-w-32 sm:min-w-40 md:max-w-md order-3 sm:order-2 w-full sm:w-auto" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery && setSuggestions(allProducts.filter(p =>
              (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              (p.author || '').toLowerCase().includes(searchQuery.toLowerCase())
            ).slice(0, 8)) || setShowSuggestions(true)}
            className="w-full px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded hover:bg-blue-600 transition text-xs"
          >
            Go
          </button>
        </form>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-96 overflow-y-auto">
            {suggestions.map((product) => (
              <button
                key={product._id || product.id}
                onClick={() => handleSuggestionClick(product)}
                className="w-full px-2 sm:px-3 py-2 hover:bg-blue-50 transition text-left flex items-start gap-2 border-b last:border-b-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-8 h-10 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                  <p className="text-xs text-gray-600 line-clamp-1">
                    {product.author || product.publisher || 'N/A'}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-blue-600">₹{product.price.toFixed(2)}</p>
                </div>
              </button>
            ))}
            {suggestions.length > 0 && (
              <button
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
                  setSearchQuery('')
                  setSuggestions([])
                  setShowSuggestions(false)
                }}
                className="w-full px-2 sm:px-3 py-2 text-center text-xs sm:text-sm text-blue-600 font-semibold hover:bg-blue-50 transition"
              >
                View all results
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right side items - Utils */}
      <div className="flex gap-1 sm:gap-2 md:gap-3 items-center flex-wrap justify-end order-2 sm:order-3">
        {user ? (
          <>
            {/* Greeting - Hidden on mobile */}
            <span className="hidden lg:inline text-gray-700 font-semibold text-xs whitespace-nowrap">
              {greeting}
            </span>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2 text-gray-900 hover:text-blue-600 transition cursor-pointer text-xs md:text-sm"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="font-semibold hidden md:inline">{user.username.split(' ')[0]}</span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-1 w-40 sm:w-44 md:w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 text-xs md:text-sm">
                  <button
                    onClick={() => handleNavigate('/profile')}
                    className="w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-gray-900 hover:bg-blue-50 transition flex items-center gap-2 border-b"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                    <span>Profile</span>
                  </button>

                  {user?.role === 'seller' ? (
                    <>
                      <button
                        onClick={() => handleNavigate('/seller/dashboard')}
                        className="w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-gray-900 hover:bg-blue-50 transition flex items-center gap-2 border-b"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                        </svg>
                        <span>Dashboard</span>
                      </button>

                      <button
                        onClick={() => handleNavigate('/seller/analytics')}
                        className="w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-gray-900 hover:bg-blue-50 transition flex items-center gap-2 border-b"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-9l-5 7h12z" />
                        </svg>
                        <span>Analytics</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigate('/orders')}
                        className="w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-gray-900 hover:bg-blue-50 transition flex items-center gap-2 border-b"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l0.03-.12 0.9-1.63h7.45c0.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-0.9-2-2-2z" />
                        </svg>
                        <span>Orders</span>
                      </button>

                      <button
                        onClick={() => handleNavigate('/seller/register')}
                        className="w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-gray-900 hover:bg-amber-50 transition flex items-center gap-2 border-b"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S15.33 8 14.5 8 13 8.67 13 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S8.33 8 7.5 8 6 8.67 6 9.5 6.67 11 7.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                        </svg>
                        <span>Be a Seller</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="no-underline text-black hover:text-blue-600 transition text-xs sm:text-sm whitespace-nowrap">
              <button className="font-semibold px-1 sm:px-1.5 md:px-3 py-1 sm:py-1.5 md:py-2">Login</button>
            </Link>
            <Link to="/register" className="no-underline text-black hover:text-blue-600 transition text-xs sm:text-sm whitespace-nowrap">
              <button className="font-semibold px-1 sm:px-1.5 md:px-3 py-1 sm:py-1.5 md:py-2">Register</button>
            </Link>
          </>
        )}

        {/* Cart */}
        <Link to="/cart" className="relative no-underline text-black hover:text-blue-600 transition text-xs md:text-sm flex-shrink-0">
          <button className="flex items-center gap-1 px-1 sm:px-1.5 md:px-2 py-1 sm:py-1.5 md:py-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="hidden sm:inline font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

