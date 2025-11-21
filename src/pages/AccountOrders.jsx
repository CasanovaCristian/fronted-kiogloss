import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function decodeJwt(token) {
    try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payload = parts[1];
        const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(atob(b64).split('').map((c) => ('%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))).join(''));
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}

const AccountOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    async function fetchOrders() {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const params = { page, page_size: 8 };
            const resp = await api.get('/user/orders', { params });
            const content = resp.data?.content || [];
            setOrders(content);
            setPages(resp.data?.totalPages || 1);
        } catch (e) {
            console.error('Error fetching orders', e);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }

    function openInvoiceWindow(order) {
        const vm = order.shopping.map(compra => ({
            descripcion: `${compra.title} ${compra.size ? ' Talla: ' + compra.size : ''} ${compra.color ? ' Color: ' + compra.color : ''}`,
            cantidad: compra.quantity,
            precioUnitario: `${compra.price}$`,
            importe: `${compra.priceXquantity || (compra.price * compra.quantity)}$`
        }));

        const html = `
            <html><head><title>Factura ${order.id}</title>
            <style>body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px}</style>
            </head><body>
            <h2>Factura N°${order.id}</h2>
            <p>Fecha: ${order.date}</p>
            <h3>Productos</h3>
            <table><thead><tr><th>Descripcion</th><th>Cantidad</th><th>Precio unit.</th><th>Importe</th></tr></thead><tbody>
            ${vm.map(r => `<tr><td>${r.descripcion}</td><td>${r.cantidad}</td><td>${r.precioUnitario}</td><td>${r.importe}</td></tr>`).join('')}
            </tbody></table>
            <h3>Total: $${order.amount}</h3>
            </body></html>
        `;
        const w = window.open('', '_blank');
        if (!w) { alert('No se pudo abrir la ventana de impresión. Revisa el bloqueador de ventanas emergentes.'); return; }
        w.document.write(html);
        w.document.close();
        setTimeout(() => w.print(), 600);
    }

    return (
        <div className="container py-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-medium">Mis Pedidos</h2>
                <Link to="/" className="text-primary">Volver al inicio</Link>
            </div>

            {loading && <p>Cargando órdenes...</p>}
            {!loading && orders.length === 0 && <p>No tienes Pedidos.</p>}

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border p-4 rounded flex justify-between items-start">
                        <div>
                            <h4 className="font-medium">Factura N°{order.id}</h4>
                            <p className="text-sm text-gray-600">Productos:</p>
                            <ol className="ml-4 list-decimal">
                                {order.shopping.map((p, idx) => <li key={idx}>{p.title}</li>)}
                            </ol>
                            <p className="text-sm">Valor Total: ${order.amount}</p>
                            <p className="text-sm">Fecha: {order.date}</p>
                            <p className="text-sm">Estado: {order.status}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button className="py-2 px-3 bg-primary text-white rounded" onClick={() => openInvoiceWindow(order)}>Exportar PDF</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center items-center gap-3">
                <button onClick={() => { if (page > 0) setPage(page - 1); }} className="px-3 py-1 border rounded">Prev</button>
                <span>Página {page + 1} / {pages}</span>
                <button onClick={() => { if (page + 1 < pages) setPage(page + 1); }} className="px-3 py-1 border rounded">Next</button>
            </div>
        </div>
    );
};

export default AccountOrders;
