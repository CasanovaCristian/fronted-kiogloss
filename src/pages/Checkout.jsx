import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Checkout = () => {
    const [loaded, setLoaded] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paidFor, setPaidFor] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    // Decodificar JWT para extraer user_id
    function decodeJwt(token) {
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const payload = parts[1];
            const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(atob(b64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(json);
        } catch (e) {
            console.warn('decodeJwt error', e);
            return null;
        }
    }

    // Parseo robusto de price string a Number
    function parsePriceString(price) {
        if (price == null) return 0;
        if (typeof price === 'number') return price;
        const s = String(price).trim();
        if (s === '') return 0;
        // eliminar símbolos moneda y espacios
        const cleaned = s.replace(/[^0-9.,-]/g, '');
        // Si tiene ambos '.' y ',', decidir formato
        if (cleaned.indexOf('.') > -1 && cleaned.indexOf(',') > -1) {
            // asumir formato europeo: '.' miles, ',' decimales -> eliminar dots, replace comma
            return Number(cleaned.replace(/\./g, '').replace(/,/g, '.')) || 0;
        }
        // si solo tiene ',' -> tratar como decimal
        if (cleaned.indexOf(',') > -1 && cleaned.indexOf('.') === -1) {
            return Number(cleaned.replace(/,/g, '.')) || 0;
        }
        // caso normal (only dots or none)
        return Number(cleaned) || 0;
    }

    // Obtener items del carrito (compatibilidad con varias keys)
    function getCartItems() {
        try {
            const keys = ['products', 'Products', 'cart', 'Cart', 'shopping', 'Shopping'];
            let raw = null;
            for (const k of keys) {
                const v = localStorage.getItem(k);
                if (v && v !== '[]') { raw = v; break; }
            }
            raw = raw || '[]';
            const items = JSON.parse(raw || '[]');
            if (!Array.isArray(items)) return [];
            return items.map((it) => ({
                productId: it.productId ?? it.product ?? it.id,
                title: it.title ?? it.name ?? '',
                price: parsePriceString(it.price),
                quantity: Number(it.quantity) || 0,
                stock: Number(it.stock) || null,
                image: it.image || '',
                subtotal: Number(it.subtotal) || (parsePriceString(it.price) * Number(it.quantity)) || 0,
            }));
        } catch (e) {
            console.error('Error parsing cart items', e);
            return [];
        }
    }

           // Construir payload para POST /user/order
    async function buildOrderPayload() {
        const items = getCartItems();
        const shopping = items.map((it) => ({ product: Number(it.productId), quantity: Number(it.quantity), price: Number(it.price) }));
        const amount = Number(items.reduce((s, i) => s + (Number(i.subtotal) || Number(i.price) * Number(i.quantity)), 0).toFixed(2));
        
        // intentar obtener account id desde token -> GET /user/{id}
            let accountId = null;
            let userId = null;
            // obtain token from common localStorage keys
            let rawToken = null;
            try {
                const maybe = localStorage.getItem('accessToken') || localStorage.getItem('access');
                // try parse in case it was stored JSON
                console.log(maybe)
                try { rawToken = JSON.parse(maybe); } catch { rawToken = maybe; }
                // if object like { access: '...' }
                if (rawToken && typeof rawToken === 'object' && rawToken.access) rawToken = rawToken.access;
            } catch (e) {
                rawToken = null;
            }
            if (rawToken) {
                    // ensure api will include the header
                    localStorage.setItem('accessToken', rawToken);
                    api.defaults.headers.common.Authorization = `Bearer ${rawToken}`;
                try {
                    const decoded = decodeJwt(rawToken);
                    userId = decoded?.user_id || decoded?.userId || decoded?.sub || decoded?.id || null;
                        // also try account claims inside token if present
                        if (!userId) userId = decoded?.user?.id || decoded?.account_id || decoded?.accountId || null;
                } catch (e) {
                    console.warn('Error decoding token for user id', e);
                }
            }

            if (userId) {
                try {
                    const resp = await api.get(`/user/${userId}`);
                    accountId = resp.data?.account?.id || resp.data?.accountId || null;
                } catch (e) {
                    console.warn('Could not fetch user detail to obtain account id', e);
                }
            }

            if (!accountId) {
                setError({ message: 'No se pudo obtener la cuenta asociada. Inicia sesión correctamente.' });
                return;
        }

            const payload = { account: Number(accountId), shopping, amount, status: 'CREATED' };
            console.debug('Checkout payload prepared', { userId, accountId, payload });
            return payload;
    }

    // removed PayPal integration — we'll simulate payment with a progress bar and call the backend

    const items = getCartItems();
    const subtotal = items.reduce((s, i) => s + (Number(i.subtotal) || Number(i.price) * Number(i.quantity)), 0);

        const [lastPayload, setLastPayload] = useState(null);

        function openInvoiceWindow(order) {
                // build simple HTML invoice and open print dialog
                const html = `
                        <html>
                        <head>
                            <title>Factura</title>
                            <style>
                                body{ font-family: Arial, sans-serif; padding: 24px }
                                .header{ display:flex; justify-content:space-between; align-items:center }
                                .items{ width:100%; border-collapse: collapse; margin-top:20px }
                                .items th, .items td{ border:1px solid #ddd; padding:8px }
                                .total{ margin-top: 20px; font-weight: bold }
                            </style>
                        </head>
                        <body>
                            <div class="header">
                                <div>
                                    <h2>Factura</h2>
                                    <div>Factura N° ${order?.id || ('local-' + Date.now())}</div>
                                </div>
                                <div>
                                    <div>Fecha: ${new Date().toLocaleString()}</div>
                                </div>
                            </div>
                            <div>
                                <h3>Productos</h3>
                                <table class="items">
                                    <thead><tr><th>Descripcion</th><th>Cantidad</th><th>Precio unit.</th><th>Importe</th></tr></thead>
                                    <tbody>
                                        ${order.shopping.map(it => `<tr><td>${it.title || it.product || ''}</td><td>${it.quantity}</td><td>$${Number(it.price).toFixed(2)}</td><td>$${(Number(it.price)*Number(it.quantity)).toFixed(2)}</td></tr>`).join('')}
                                    </tbody>
                                </table>
                                <div class="total">Total: $${order.amount.toFixed(2)}</div>
                            </div>
                        </body>
                        </html>
                `;

                const w = window.open('', '_blank');
                if (!w) {
                        alert('No se pudo abrir la ventana de impresión. Revisa el bloqueador de ventanas emergentes.');
                        return;
                }
                w.document.write(html);
                w.document.close();
                setTimeout(() => { w.print(); }, 600);
        }

    return (
        <>
            {/* breadcrumb */}
            <div className="container py-4 flex items-center gap-3">
                <Link to="/" className="text-primary text-base">
                    <i className="fa-solid fa-house"></i>
                </Link>
                <span className="text-sm text-gray-400">
                    <i className="fa-solid fa-chevron-right"></i>
                </span>
                <p className="text-gray-600 font-medium">Checkout</p>
            </div>
            {/* ./breadcrumb */}

            {/* wrapper */}
            <div className="container grid grid-cols-12 items-start pb-16 pt-4 gap-6">

                <div className="col-span-8 border border-gray-200 p-4 rounded">
                   <h3 className="text-lg font-medium capitalize mb-4">Resumen & Simulación de pago</h3>
                    <div className="space-y-4">
                        <p className="text-gray-700">Hemos quitado el formulario de pago real y la integración con PayPal. Aquí puedes revisar tu pedido y pulsar "Simular pago" para generar la orden y la factura (simulada).</p>
                        <p className="text-sm text-gray-500">La orden se enviará al backend para validar stock y quedar registrada. Después podrás descargar la factura.</p>
                    </div>
                </div>

                <div className="col-span-4 border border-gray-200 p-4 rounded">
                    <h4 className="text-gray-800 text-lg mb-4 font-medium uppercase">order summary</h4>
                    <div className="space-y-2">
                       {items.length === 0 && <p className="text-gray-600">No hay productos en el carrito.</p>}
                        {items.map((it) => (
                            <div key={it.productId} className="flex justify-between">
                                <div>
                                    <h5 className="text-gray-800 font-medium">{it.title}</h5>
                                    <p className="text-sm text-gray-600">{it.size || ''}</p>
                                </div>
                                <p className="text-gray-600">x{it.quantity}</p>
                                <p className="text-gray-800 font-medium">${(Number(it.price) || 0).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
                        <p>subtotal</p>
                        <p>${subtotal.toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between border-b border-gray-200 mt-1 text-gray-800 font-medium py-3 uppercas">
                        <p>shipping</p>
                        <p>Free</p>
                    </div>

                    <div className="flex justify-between text-gray-800 font-medium py-3 uppercas">
                        <p className="font-semibold">Total</p>
                          <p>${subtotal.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center mb-4 mt-2">
                        <input type="checkbox" name="aggrement" id="aggrement"
                            className="text-primary focus:ring-0 rounded-sm cursor-pointer w-3 h-3" />
                        <label htmlFor="aggrement" className="text-gray-600 ml-3 cursor-pointer text-sm">I agree to the <a href="#"
                            className="text-primary">terms & conditions</a></label>
                    </div>

                   <div className="mt-3">
                        <div className="space-y-3">
                            <button
                                className="w-full py-3 bg-primary text-white rounded font-medium"
                                onClick={async () => {
                                    setError(null);
                                    const itemsLocal = getCartItems();
                                    if (!itemsLocal || itemsLocal.length === 0) {
                                        setError({ message: 'El carrito está vacío.' });
                                        return;
                                    }

                                    // simulated progress
                                    setProcessing(true);
                                    setProgress(0);
                                    const interval = setInterval(() => setProgress((p) => Math.min(100, p + Math.floor(Math.random() * 20) + 10)), 400);

                                    try {
                                        const payload = await buildOrderPayload();
                                        // ensure Authorization header present on api
                                        const maybeToken = localStorage.getItem('accessToken') || localStorage.getItem('access');
                                        //if (maybeToken) api.defaults.headers.Authorization = `Bearer ${maybeToken}`;
                                        console.debug('Sending POST /user/order with payload', payload);
                                        // send to backend to validate/create order
                                        const resp = await api.post('/user/order', payload, {
                                            headers: {
                                                Authorization: maybeToken ? `Bearer ${maybeToken}` : undefined
                                            }
                                        });
                                        console.debug('Orden creada (simulada):', resp && resp.status, resp && resp.data);
                                        // build a user-friendly order object for invoice (includes titles)
                                        const orderObj = {
                                            id: 'local-' + Date.now(),
                                            shopping: itemsLocal.map(it => ({ title: it.title, quantity: it.quantity, price: it.price, priceXquantity: (Number(it.price) * Number(it.quantity)) })) ,
                                            amount: payload.amount
                                        };
                                        setLastPayload(orderObj);
                                        // clear cart
                                        localStorage.removeItem('products');
                                        localStorage.removeItem('cart');
                                        window.dispatchEvent(new Event('cart_updated'));
                                        setProgress(100);
                                        setPaidFor(true);
                                        setShowModal(true);
                                    } catch (err) {
                                        console.error('Error simulando pago/creando orden', err);
                                        setError(err?.response?.data || { message: err.message || 'Error creando la orden' });
                                    } finally {
                                        clearInterval(interval);
                                        setProcessing(false);
                                        setTimeout(() => setProgress(0), 600);
                                    }
                                }}
                               disabled={processing}
                            >
                                {processing ? 'Procesando...' : 'Simular pago'}
                        </button>

                    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                                <div id="checkout-progress" data-progress={progress} style={{ width: `${progress}%` }} className="h-3 bg-primary transition-all" />
                            </div>

                            {processing && <p className="text-sm text-gray-600">Procesando pago... {progress}%</p>}
                            {error && (
                                <div>
                                    <p className="text-sm text-red-500">Error: {error.message || JSON.stringify(error)}</p>
                                </div>
                    )}
                    </div>
                    </div>
                </div>

            </div>
            {/* ./wrapper */}
            
            {/* Modal de éxito */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#fff', padding: 24, borderRadius: 8, width: 420, maxWidth: '90%' }}>
                        <h3>Compra completada</h3>
                        <p>Tu compra se ha procesado con éxito. Gracias por tu compra.</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <button onClick={() => { setShowModal(false); window.location.href = '/'; }} style={{ padding: '8px 12px' }}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Checkout;
