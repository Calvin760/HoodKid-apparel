import { useState } from "react"

export const useOrderForm = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        notes: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    return { form, handleChange }
}