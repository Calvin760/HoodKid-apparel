import React, { useEffect, useState } from 'react'

const Orders = () => {

  const [orders, setOrders] = useState([])

  // 🔥 FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/order/all")
        const data = await res.json()
        setOrders(data.reverse()) // latest first
      } catch (err) {
        console.log(err)
      }
    }

    fetchOrders()
  }, [])

  if (orders.length === 0) {
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

            {/* 🔥 HEADER */}
            <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2">

              <div>
                <p className="font-medium">Order #{order._id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-sm text-right">
                <p>
                  Payment:
                  <span className={`ml-2 font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-red-500"
                    }`}>
                    {order.paymentStatus}
                  </span>
                </p>

                <p>
                  Delivery:
                  <span className="ml-2 font-medium">
                    {order.deliveryStatus}
                  </span>
                </p>
              </div>

            </div>

            {/* 🔥 ITEMS */}
            <div className="space-y-3">

              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">

                  <span>
                    {item.name} ({item.size}) x {item.quantity}
                  </span>

                  <span>
                    R {item.price * item.quantity}
                  </span>

                </div>
              ))}

            </div>

            {/* 🔥 TOTAL */}
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