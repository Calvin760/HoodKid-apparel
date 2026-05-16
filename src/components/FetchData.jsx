import axios from "axios";
import { useState, useEffect } from "react";
import React from 'react'


const FetchData = () => {

    const API_URL = import.meta.env.VITE_API_URL;
    const [products, setProducts] = useState([])

    const getData = async () => {

        const { data } = await axios.get(`${API_URL}/api/products`)
        setProducts(data.products)

        

    }

    const dataFetch = async () => {
        const data = await fetch(API_URL)
        console.log(data)
        
    }

    useEffect(() =>{
        getData();
    }, [])

    useEffect(() =>{
        console.log("PRODUCTS: ", products)
    }, [products])


  return (
      <h1>
        {products[0].name}
      </h1>
  )
}

export default FetchData