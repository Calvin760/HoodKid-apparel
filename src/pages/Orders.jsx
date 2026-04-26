import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../components/Loading'
import { useAuth } from '@clerk/clerk-react'

const API_URL = import.meta.env.VITE_API_URL

const Orders = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const { getToken, isSignedIn } = useAuth()

  useEffect(() => {

    const fetchOrders = async () => {
      try {

        // 🔥 Clerk session check (replaces localStorage)
        if (!isSignedIn) {
          setLoading(false)
          return
        }

        const token = await getToken()

        const { data } = await axios.get(
          `${API_URL}/api/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (data.success) {

          const paidOrders = (data.orders || [])
            .filter(order => order.paymentStatus === "paid")
            .sort((a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt)
            )

          setOrders(paidOrders)
        }

      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isSignedIn])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading text="Loading your orders..." />
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">No Orders Yet</h2>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-semibold mb-8">My Orders</h1>

      <div className="space-y-6">

        {orders.map((order) => (

          <div key={order._id} className="border p-6 rounded-lg">

            <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2">

              <div>
                <p className="font-medium">
                  {order.orderNumber || order._id}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-sm text-right">

                <p>
                  Payment:
                  <span className="ml-2 font-medium text-yellow-600">
                    {order.paymentStatus}
                  </span>
                </p>

                <p>
                  Delivery Status:
                  <span className="ml-2 font-medium">
                    {order.status}
                  </span>
                </p>

              </div>

            </div>

            <div className="text-sm text-gray-700 mb-4 space-y-1">

              <p><span className="font-medium">Name:</span> {order.shippingInfo?.name}</p>
              <p><span className="font-medium">Phone:</span> {order.shippingInfo?.phone}</p>
              <p><span className="font-medium">Address:</span> {order.shippingInfo?.address}</p>
              <p><span className="font-medium">City:</span> {order.shippingInfo?.city}</p>

            </div>

            <div className="space-y-3">

              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {item.name} ({item.size}{item.color ? ` / ${item.color}` : ""}) x {item.quantity}
                  </span>

                  <span>
                    R {item.price * item.quantity}
                  </span>
                </div>
              ))}

            </div>

            <div className="border-t mt-4 pt-3 flex justify-between font-medium">
              <span>Total</span>
              <span>R {order.total}</span>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default Orders