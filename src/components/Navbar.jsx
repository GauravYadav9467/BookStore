import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [cartCount, setCartCount] = useState(0)

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
          <button className="mr-4 hover:text-blue-600 transition">Profile</button>
          <button className="hover:text-blue-600 transition">Wishlist</button>
          <Link to="/checkout" className="relative no-underline text-black hover:text-blue-600 transition">
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
