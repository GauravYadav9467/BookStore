import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function OrderApprovals() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(null)

  useEffect(() => {
    fetchPendingOrders()
  }, [])

  const fetchPendingOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seller/orders/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      setOrders(data.orders || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (orderId) => {
    setActionLoading(orderId)
    try {
      const response = await fetch(`/api/seller/orders/${orderId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      setOrders(orders.map(o => o._id === orderId ? data.order : o))
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectSubmit = async (orderId) => {
    if (!rejectReason.trim()) {
      setError('Please provide a rejection reason')
      return
    }

    setActionLoading(orderId)
    try {
      const response = await fetch(`/api/seller/orders/${orderId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectReason })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      setOrders(orders.map(o => o._id === orderId ? data.order : o))
      setRejectReason('')
      setShowRejectForm(null)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const getApprovalStatus = (order) => {
    if (!order.sellerApproval || order.sellerApproval.status === 'pending') {
      return { status: 'pending', label: 'Pending Approval', color: 'yellow' }
    }
    if (order.sellerApproval.status === 'approved') {
      return { status: 'approved', label: 'Approved', color: 'green' }
    }
    return { status: 'rejected', label: 'Rejected', color: 'red' }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-600">Loading pending orders...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Order Approvals</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <p className="text-gray-600 text-lg">No pending orders to approve</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const approval = getApprovalStatus(order)
            const colorMap = {
              yellow: 'bg-yellow-50 border-yellow-200',
              green: 'bg-green-50 border-green-200',
              red: 'bg-red-50 border-red-200'
            }
            const badgeColorMap = {
              yellow: 'bg-yellow-100 text-yellow-800',
              green: 'bg-green-100 text-green-800',
              red: 'bg-red-100 text-red-800'
            }

            return (
              <div key={order._id} className={`border-l-4 rounded-lg p-6 shadow-md ${colorMap[approval.color]}`}>
                {/* Header with Order ID and Status */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Order #{order._id.toString().slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-semibold text-sm ${badgeColorMap[approval.color]}`}>
                    {approval.label}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="bg-white rounded p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{order.customerInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{order.customerInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{order.customerInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">City</p>
                      <p className="font-medium text-gray-900">{order.customerInfo.city}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{order.customerInfo.address}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-gray-600">₹{item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="bg-white rounded p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Total Amount:</p>
                    <p className="text-2xl font-bold text-green-600">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Rejection Reason (if rejected) */}
                {order.sellerApproval?.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                    <p className="text-sm text-gray-600">Rejection Reason:</p>
                    <p className="font-medium text-red-800">{order.sellerApproval.reason}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {approval.status === 'pending' && (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(order._id)}
                        disabled={actionLoading === order._id}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition duration-200"
                      >
                        {actionLoading === order._id ? 'Approving...' : '✓ Approve Order'}
                      </button>
                      <button
                        onClick={() => setShowRejectForm(showRejectForm === order._id ? null : order._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-200"
                      >
                        ✕ Reject Order
                      </button>
                    </div>

                    {/* Reject Form */}
                    {showRejectForm === order._id && (
                      <div className="bg-white rounded p-4 border border-red-200">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Rejection Reason *
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Enter reason for rejecting this order"
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-3"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRejectSubmit(order._id)}
                            disabled={actionLoading === order._id}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition duration-200"
                          >
                            {actionLoading === order._id ? 'Rejecting...' : 'Confirm Rejection'}
                          </button>
                          <button
                            onClick={() => {
                              setShowRejectForm(null)
                              setRejectReason('')
                            }}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded-lg transition duration-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
