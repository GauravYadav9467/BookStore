import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const SellerProtectedRoute = ({ children }) => {
  const { token, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!token || user?.role !== 'seller') {
    return <Navigate to="/seller/register" replace />
  }

  return children
}

export default SellerProtectedRoute
