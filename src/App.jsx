import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Home from './pages/Home'
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-xl text-gray-600">Loading...</p>
  </div>
)

function App() {
  return (
    <Router>
      <Navbar />
      <div className="body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Suspense fallback={<LoadingSpinner />}><ProductDetail /></Suspense>} />
          <Route path="/checkout" element={<Suspense fallback={<LoadingSpinner />}><Cart /></Suspense>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App
