const {
    VITE_PAYFAST_PROCESS_URL,
    VITE_PAYFAST_MERCHANT_ID,
    VITE_PAYFAST_MERCHANT_KEY,
    VITE_FRONTEND_URL,
    VITE_API_URL,
} = import.meta.env;

export const submitPayfastPayment = ({ orderId, total }) => {
    if (!VITE_PAYFAST_PROCESS_URL || !VITE_PAYFAST_MERCHANT_ID || !VITE_PAYFAST_MERCHANT_KEY) {
        throw new Error('PayFast environment variables are missing');
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = VITE_PAYFAST_PROCESS_URL;

    const fields = {
        merchant_id: VITE_PAYFAST_MERCHANT_ID,
        merchant_key: VITE_PAYFAST_MERCHANT_KEY,
        return_url: `${VITE_FRONTEND_URL}/payment-success`,
        cancel_url: `${VITE_FRONTEND_URL}/cancel`,
        notify_url: `${VITE_API_URL}/api/payfast/notify`,
        m_payment_id: orderId,
        amount: Number(total).toFixed(2),
        item_name: 'Order Payment',
    };

    Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
};