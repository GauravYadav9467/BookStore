import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [greeting, setGreeting] = useState('')
  const [pendingOrders, setPendingOrders] = useState(0)
  const dropdownRef = useRef(null)
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

  return (
    <div className=''>
      <div className='nav flex place-content-between bg-white items-center align-center h-16 pr-12 shadow-md'>
        <Link to="/" className="no-underline">
          <div className="sName text-4xl pl-5">
            <h2 className="text-gray-900 hover:text-blue-600 transition">BookStore</h2>
          </div>
        </Link>
        <div className="relative w-125 ">
          <input type="text" placeholder="Search..." className="w-full p-2 pr-12 border rounded"/>
          <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Go</button>
        </div>
        <div className="utils flex gap-8 items-center">
          {user ? (
            <div className="flex items-center gap-6">
              {/* Greeting Message - Separate */}
              <span className="text-gray-700 font-semibold text-lg">
                {greeting}, {user.username}
              </span>

              {/* Profile Dropdown - Separate */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 text-gray-900 hover:text-blue-600 transition cursor-pointer"
                >
                  {/* Profile Icon/Avatar */}
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Profile</span>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    {/* Profile Option */}
                    <button
                      onClick={() => handleNavigate('/profile')}
                      className="w-full text-left px-4 py-3 text-gray-900 hover:bg-blue-50 transition flex items-center gap-2 border-b"
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span className="font-semibold">My Profile</span>
                    </button>

                    {/* Conditionally show seller or buyer options */}
                    {user?.role === 'seller' ? (
                      <>
                        {/* Seller Dashboard */}
                        <button
                          onClick={() => handleNavigate('/seller/dashboard')}
                          className="w-full text-left px-4 py-3 text-gray-900 hover:bg-blue-50 transition flex items-center gap-2 border-b"
                        >
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                          </svg>
                          <span className="font-semibold">Dashboard</span>
                        </button>

                        {/* Seller Analytics */}
                        <button
                          onClick={() => handleNavigate('/seller/analytics')}
                          className="w-full text-left px-4 py-3 text-gray-900 hover:bg-blue-50 transition flex items-center gap-2 border-b"
                        >
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-9l-5 7h12z" />
                          </svg>
                          <span className="font-semibold">Analytics</span>
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Orders Option (for buyers) */}
                        <button
                          onClick={() => handleNavigate('/orders')}
                          className="w-full text-left px-4 py-3 text-gray-900 hover:bg-blue-50 transition flex items-center gap-2 border-b"
                        >
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-0.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l0.03-.12 0.9-1.63h7.45c0.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-0.9-2-2-2z" />
                          </svg>
                          <span className="font-semibold">My Orders</span>
                        </button>

                        {/* Become a Seller */}
                        <button
                          onClick={() => handleNavigate('/seller/register')}
                          className="w-full text-left px-4 py-3 text-gray-900 hover:bg-amber-50 transition flex items-center gap-2 border-b"
                        >
                          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S15.33 8 14.5 8 13 8.67 13 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S8.33 8 7.5 8 6 8.67 6 9.5 6.67 11 7.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                          </svg>
                          <span className="font-semibold">Become a Seller</span>
                        </button>
                      </>
                    )}

                    {/* Logout Option */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                      </svg>
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="no-underline text-black hover:text-blue-600 transition">
                <button className="font-semibold">Login</button>
              </Link>
              <Link to="/register" className="no-underline text-black hover:text-blue-600 transition">
                <button className="font-semibold">Register</button>
              </Link>
            </>
          )}
          <Link to="/cart" className="relative no-underline text-black hover:text-blue-600 transition">
            <button className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar

