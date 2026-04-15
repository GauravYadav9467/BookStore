import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function SellerAnalytics() {
  const { token } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seller/sales-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveOrder = async () => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/seller/orders/${selectedOrder._id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      setData({
        ...data,
        orders: data.orders.map(o => o._id === selectedOrder._id ? result.order : o)
      })
      setSelectedOrder(null)
      setRejectionReason('')
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectOrder = async () => {
    if (!rejectionReason.trim()) {
      setError('Please provide a rejection reason')
      return
    }

    setActionLoading(true)
    try {
      const response = await fetch(`/api/seller/orders/${selectedOrder._id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectionReason })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      setData({
        ...data,
        orders: data.orders.map(o => o._id === selectedOrder._id ? result.order : o)
      })
      setSelectedOrder(null)
      setRejectionReason('')
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-600">Loading sales data...</p>
      </div>
    )
  }

  if (error && !selectedOrder) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-600">No data available</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Sales Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 text-white shadow-lg">
          <h3 className="text-lg font-semibold opacity-90">Total Sales</h3>
          <p className="text-4xl font-bold mt-3">₹{Number(data.totalSales || 0).toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg p-6 text-white shadow-lg">
          <h3 className="text-lg font-semibold opacity-90">Total Orders</h3>
          <p className="text-4xl font-bold mt-3">{data.totalOrders || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white shadow-lg">
          <h3 className="text-lg font-semibold opacity-90">Items Sold</h3>
          <p className="text-4xl font-bold mt-3">{data.totalItemsSold || 0}</p>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 text-white shadow-lg">
          <h3 className="text-lg font-semibold opacity-90">Active Products</h3>
          <p className="text-4xl font-bold mt-3">{data.products?.length || 0}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200">Recent Orders</h2>

        {data.orders && data.orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Order ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Items</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Total Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Approval</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-3 text-gray-700">{order._id.toString().slice(-6)}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm">{item.name} x{item.quantity}</div>
                      ))}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">₹{(order.total || order.totalPrice || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.sellerApproval?.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : order.sellerApproval?.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {order.sellerApproval?.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No orders yet</p>
        )}
      </div>

      {/* Your Products */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200">Your Products</h2>

        {data.products && data.products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Product Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Author</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Price</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Stock</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Sold</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50 border-b">
                    <td className="px-4 py-3 text-gray-900 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-gray-700">{product.author || '-'}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">₹{(product.price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-700">{product.stock}</td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">{product.sold}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">₹{((product.price || 0) * (product.sold || 0)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No products listed</p>
        )}
      </div>

      {/* Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h2>

            {/* Order ID and Status */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-gray-900">{selectedOrder._id.toString().slice(-8)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Status</p>
                <p className="font-semibold text-gray-900">{selectedOrder.status}</p>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4 pb-4 border-b">
              <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-700 mb-1">
                  {item.name} × {item.quantity} - ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              ))}
            </div>

            {/* Customer Info */}
            <div className="mb-4 pb-4 border-b">
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <p className="text-sm text-gray-700"><strong>{selectedOrder.customerInfo.name}</strong></p>
              <p className="text-sm text-gray-700">{selectedOrder.customerInfo.address}</p>
              <p className="text-sm text-gray-700">{selectedOrder.customerInfo.city} - {selectedOrder.customerInfo.pincode}</p>
              <p className="text-sm text-gray-700">Phone: {selectedOrder.customerInfo.phone}</p>
            </div>

            {/* Total */}
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">₹{(selectedOrder.total || 0).toFixed(2)}</p>
            </div>

            {/* Rejection Reason Display */}
            {selectedOrder.sellerApproval?.status === 'rejected' && selectedOrder.sellerApproval?.reason && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="text-sm font-semibold text-red-800">Rejection Reason:</p>
                <p className="text-sm text-red-700">{selectedOrder.sellerApproval.reason}</p>
              </div>
            )}

            {/* Action Buttons */}
            {(!selectedOrder.sellerApproval || selectedOrder.sellerApproval.status === 'pending') ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleApproveOrder}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : '✓ Approve Order'}
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Close
                  </button>
                </div>

                {/* Rejection Section */}
                <div className="space-y-2 pt-4 border-t">
                  <label className="block text-sm font-semibold text-gray-900">
                    Reason for Rejection (if rejecting):
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows="2"
                  />
                  <button
                    onClick={handleRejectOrder}
                    disabled={actionLoading}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : '✗ Reject Order'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Approval Status</p>
                  <p className={`text-lg font-bold ${selectedOrder.sellerApproval.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedOrder.sellerApproval.status.charAt(0).toUpperCase() + selectedOrder.sellerApproval.status.slice(1)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
