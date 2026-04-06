import React, { useEffect, useState } from 'react'
import BodyContent from '../components/BodyContent'
import { getProducts } from '../services/api'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts().then(res => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <BodyContent products={products} loading={loading}/>
    </div>
  )
}

export default Home
