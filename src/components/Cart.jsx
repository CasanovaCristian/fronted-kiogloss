import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const readStorage = () => {
    
   try {
      // Support multiple possible storage keys for compatibility
      const keys = ['products', 'cart', 'shopping'];
      let arr = [];
      let foundKey = null;
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            arr = parsed;
            foundKey = k;
            break;
          }
        } catch (e) {
          // ignore parse errors, try next key
        }
      }

      // If nothing found, return empty
      if (!arr || arr.length === 0) return [];

      // Normalize shape: handle both 'products' shape (productId, title...) and 'cart' shape (id, title...)
      return arr.map(i => ({
        id: i.productId ?? i.id,
        name: i.title ?? i.name,
        price: i.price ?? i.unitPrice ?? 0,
        quantity: i.quantity ?? 1,
        image: i.image ?? i.imageUrl ?? '',
        size: i.size ?? '',
        color: i.color ?? '' ,
       stock: i.stock ?? i.available ?? 9999,
      }));
    } catch (e) {
      console.error('Error leyendo carrito desde localStorage', e);
      return [];
    }
  };
  
  const saveStorage = (items) => {
    try {
      // items is normalized shape used by component
      const productsArray = items.map(i => ({
        productId: i.id,
        title: i.name,
        price: Number(i.price),
        quantity: i.quantity,
        stock: i.stock,
        image: i.image,
        subtotal: Number((i.price * i.quantity).toFixed(2))
      }));

      const cartArray = items.map(i => ({
        id: i.id,
        title: i.name,
        price: Number(i.price),
        quantity: i.quantity,
        image: i.image,
        stock: i.stock,
        subtotal: Number((i.price * i.quantity).toFixed(2))
      }));

      localStorage.setItem('products', JSON.stringify(productsArray));
      localStorage.setItem('cart', JSON.stringify(cartArray));

      // Also update a cartTotal key for compatibility with other parts
      const total = productsArray.reduce((s, it) => s + (Number(it.subtotal) || 0), 0);
      localStorage.setItem('cartTotal', String(total));
      window.dispatchEvent(new Event('cart_updated'));
    } catch (e) {
      console.error('Error guardando carrito', e);
    }
  };

  const [cartItems, setCartItems] = useState(readStorage());

  useEffect(() => {
    const onStorage = () => setCartItems(readStorage());
    const onCartUpdated = () => setCartItems(readStorage());
    window.addEventListener('storage', onStorage);
    window.addEventListener('cart_updated', onCartUpdated);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cart_updated', onCartUpdated);
    };
  }, []);

  // No coupon features - backend doesn't support discounts

  const updateQuantity = (id, change) => {
    setCartItems(items => {
      const updated = items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(item.stock ?? 9999, item.quantity + change)) }
          : item
      );
     // Persist to storage (both 'products' and 'cart')
      saveStorage(updated);
      return updated;
    });
  };

  const removeItem = (id) => {
    setCartItems(items => {
      const updated = items.filter(item => item.id !== id);
     // Persist to storage (both 'products' and 'cart')
      saveStorage(updated);
      return updated;
    });
  };

  // applyCoupon removed (not supported by backend)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
            <ShoppingBag className="text-blue-600" />
            Carrito de Compras
          </h1>
          <p className="text-slate-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <ShoppingBag className="w-24 h-24 mx-auto text-slate-300 mb-4" />
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                  Tu carrito está vacío
                </h2>
                <p className="text-slate-600">Agrega productos para comenzar tu compra</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex gap-6">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-800">
                            {item.name}
                          </h3>
                          <p className="text-slate-600 mt-1">
                            Talla: {item.size} | Color: {item.color}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-white rounded-md transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:bg-white rounded-md transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Resumen del Pedido
              </h2>

              {/* No coupon UI - handled by backend if ever supported */}

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {/* no discounts */}
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-slate-500">
                    Envío gratis en compras superiores a $100
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-slate-800">Total</span>
                <span className="text-3xl font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button onClick={() => navigate('/checkout')}
                disabled={cartItems.length === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Proceder al Pago
              </button>

              <button className="w-full mt-3 border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                Seguir Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}