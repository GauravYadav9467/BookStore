import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import SellerRegister from './pages/SellerRegister'
import SellerDashboard from './pages/SellerDashboard'
import SellerAnalytics from './pages/SellerAnalytics'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SellerProtectedRoute from './components/SellerProtectedRoute'

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-xl text-gray-600">Loading...</p>
  </div>
)

// Protected Route Component
const ProtectedCheckout = () => {
  const { token, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Checkout />
}

// Protected Orders Route
const ProtectedOrders = () => {
  const { token, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Orders />
}

// Protected Profile Route
const ProtectedProfile = () => {
  const { token, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Profile />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Suspense fallback={<LoadingSpinner />}><ProductDetail /></Suspense>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/seller/register" element={<SellerRegister />} />
            <Route path="/seller/dashboard" element={<SellerProtectedRoute><SellerDashboard /></SellerProtectedRoute>} />
            <Route path="/seller/analytics" element={<SellerProtectedRoute><SellerAnalytics /></SellerProtectedRoute>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedCheckout />} />
            <Route path="/orders" element={<ProtectedOrders />} />
            <Route path="/profile" element={<ProtectedProfile />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App
