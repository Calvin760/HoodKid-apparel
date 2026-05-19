import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';

export const useOrderForm = () => {
    const { user } = useUser();

    const [form, setForm] = useState({
        name: '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        phone: '',
        address: '',
        city: '',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    return { form, handleChange };
};