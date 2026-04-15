import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Orders = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [token])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`/api/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setOrders(data.orders)
      } else {
        setError(data.message || 'Failed to fetch orders')
      }
    } catch (err) {
      setError('Error fetching orders: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setOrders(orders.map(order => order._id === orderId ? data.order : order))
      } else {
        setError(data.message || 'Failed to cancel order')
      }
    } catch (err) {
      setError('Error cancelling order: ' + err.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="mb-6 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            ← Back to Home
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-2xl text-gray-600 mb-4">No orders yet</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
        >
          ← Back to Home
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-lg p-6">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-lg font-bold text-gray-900">{order._id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 border-b pb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-24 object-cover rounded-lg shadow-md shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <button
                          onClick={() => navigate(`/product/${item.productId}`)}
                          className="text-base font-semibold text-blue-600 hover:text-blue-800 hover:underline transition text-left"
                        >
                          {item.name}
                        </button>
                        <p className="text-sm text-gray-600 mt-1">Price: ₹{item.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-bold text-gray-900 mt-2">
                          Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Address</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>{order.customerInfo.name}</strong></p>
                  <p>{order.customerInfo.address}</p>
                  <p>{order.customerInfo.city} - {order.customerInfo.pincode}</p>
                  <p>Phone: {order.customerInfo.phone}</p>
                  <p>Email: {order.customerInfo.email}</p>
                </div>
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{(order.total * 1.05).toFixed(2)}</p>
                  <p className="text-xs text-gray-600 mt-1">Including 5% tax</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <p className="text-xs text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Orders
