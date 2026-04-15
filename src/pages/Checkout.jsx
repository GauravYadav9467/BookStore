import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Checkout = () => {
  const navigate = useNavigate()
  const { token, user, updateProfile } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [orderTotal, setOrderTotal] = useState(0)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addressForm, setAddressForm] = useState({
    phone: '',
    address: '',
    city: '',
    pincode: ''
  })

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(cart)
    calculateTotal(cart)

    // Check if user has address details
    if (user && (!user.phone || !user.address || !user.city || !user.pincode)) {
      setShowAddressForm(true)
      setAddressForm({
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        pincode: user.pincode || ''
      })
    }
  }, [user])

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    setOrderTotal(total)
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddressForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateAddress = async (e) => {
    e.preventDefault()
    setError('')

    if (!addressForm.phone || !addressForm.address || !addressForm.city || !addressForm.pincode) {
      setError('Please fill all address fields')
      return
    }

    setLoading(true)
    const result = await updateProfile(addressForm.phone, addressForm.address, addressForm.city, addressForm.pincode)
    setLoading(false)

    if (result.success) {
      setShowAddressForm(false)
    } else {
      setError(result.message || 'Failed to update address')
    }
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          customerInfo: {
            name: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            pincode: user.pincode
          },
          total: orderTotal
        })
      })

      const data = await response.json()

      if (data.success) {
        setOrderPlaced(true)
        localStorage.removeItem('cart')
      } else {
        setError(data.message || 'Failed to place order')
      }
    } catch (err) {
      setError('Error placing order: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-3 md:px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8 text-center">
          <div className="text-5xl md:text-6xl text-green-500 mb-4">✓</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-4 text-sm md:text-base">Thank you for your order. We'll deliver it soon.</p>
          <p className="text-gray-700 font-semibold mb-6 text-sm md:text-base">Order Total: ₹{orderTotal.toFixed(2)}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full px-4 md:px-6 py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition"
            >
              View My Orders
            </button>
            <button
              onClick={() => {
                setOrderPlaced(false)
                navigate('/')
              }}
              className="w-full px-4 md:px-6 py-2 bg-gray-400 text-white text-sm md:text-base rounded-lg hover:bg-gray-500 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show address form if user hasn't provided address
  if (showAddressForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-3 md:px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base">Please provide your delivery address to proceed with checkout</p>

          {error && (
            <div className="mb-4 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm md:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdateAddress} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={addressForm.phone}
                onChange={handleAddressChange}
                required
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Address *</label>
              <textarea
                name="address"
                value={addressForm.address}
                onChange={handleAddressChange}
                required
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="Enter your full address"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  placeholder="Enter your city"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={addressForm.pincode}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  placeholder="Enter your pincode"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 md:py-3 bg-blue-600 text-white font-bold text-sm md:text-base rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mt-6"
            >
              {loading ? 'Updating...' : 'Continue to Checkout'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-12 px-3 md:px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/cart')}
          className="mb-4 md:mb-6 px-3 md:px-4 py-2 bg-gray-400 text-white text-sm md:text-base rounded-lg hover:bg-gray-500 transition"
        >
          ← Back to Cart
        </button>

        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Order Items & Delivery Address */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-4 md:p-6">
            {/* Order Items */}
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Order Items</h2>

            <div className="space-y-4 mb-6 md:mb-8 pb-6 md:pb-8 border-b">
              {cartItems.map(item => (
                <div key={item.productId} className="flex flex-col sm:flex-row gap-3 sm:gap-4 border-b pb-4 text-sm md:text-base">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-20 h-32 sm:h-28 object-cover rounded-lg shadow-md shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <button
                      onClick={() => navigate(`/product/${item.productId}`)}
                      className="text-base md:text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline transition text-left line-clamp-1"
                    >
                      {item.name}
                    </button>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">Price: ₹{item.price.toFixed(2)}</p>
                    <p className="text-xs md:text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-base md:text-lg font-bold text-gray-900 mt-2">
                      Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Delivery Address</h2>

            <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6 border border-gray-200 text-sm md:text-base">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-900 break-words">{user.username}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-gray-900 break-words">{user.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-semibold text-gray-900">{user.phone}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-semibold text-gray-900 break-words">{user.address}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600">City:</span>
                  <span className="font-semibold text-gray-900">{user.city}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600">Pincode:</span>
                  <span className="font-semibold text-gray-900">{user.pincode}</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddressForm(true)}
                className="mt-4 text-blue-600 hover:text-blue-800 font-semibold text-xs md:text-sm"
              >
                Edit Address
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 md:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm md:text-base">
                {error}
              </div>
            )}

            <form onSubmit={handlePlaceOrder}>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 md:py-3 bg-green-600 text-white font-bold text-sm md:text-base rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 sticky top-4">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-6">Order Total</h2>

              <div className="space-y-4 mb-6 pb-6 border-b text-sm md:text-base">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₹{orderTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%):</span>
                  <span className="font-semibold">₹{(orderTotal * 0.05).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl md:text-2xl font-bold">
                <span>Total:</span>
                <span>₹{(orderTotal * 1.05).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
