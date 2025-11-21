import { Link } from 'react-router-dom';
import api from '../services/api';
import productService from '../services/productService';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
    const [favorited, setFavorited] = useState(false);
    const [select, setSelect] = useState(1); // cantidad seleccionada (select)

    // Valores por defecto si no vienen del backend
    const {
        slug = product.slug,
        name = product?.title || 'Producto sin nombre',
        price = product.price,
        discountPrice,
        image = product?.image,
        rating = 0,
        reviews = 0
    } = product || {};

    // Obtener la primera imagen o usar una por defecto
    const productImage = image || '/assets/images/products/product1.jpg';

    // Calcular precio original si hay descuento
    const displayPrice = discountPrice || price;
    const hasDiscount = discountPrice && discountPrice < price;

    // Obtener stock (siempre entero)
    const stock = Number(product?.stock ?? product?.stock ?? 1) || 0;

    // Parseo seguro de precio (price puede venir como string desde el backend)
    const parsePrice = (p) => {
        if (p == null) return 0;
        if (typeof p === 'number') return p;
        // Eliminar todo lo que no sea dígito, punto o coma y luego unificar coma a punto
        const cleaned = String(p).replace(/[^0-9,\.\-]/g, '');
        // Si contiene coma y punto, asumimos formato US (coma como separador de miles) -> eliminar comas
        if (cleaned.indexOf(',') > -1 && cleaned.indexOf('.') > -1) {
            return Number(cleaned.replace(/,/g, '')) || 0;
        }
        // Reemplazar coma por punto y parsear
        return Number(cleaned.replace(/,/g, '.')) || 0;
    }

    const unitPrice = parsePrice(displayPrice);

    const handleAddToFavorites = async (product) => {
        try {
            // Try to get account id from token
            const rawToken = localStorage.getItem('access') || localStorage.getItem('accessToken');
            let accountId = null;
            if (rawToken) {
                try {
                    const decoded = jwtDecode(rawToken);
                    accountId = decoded?.user_id || decoded?.userId || decoded?.sub || decoded?.id || null;
                } catch (e) {
                    console.warn('Could not decode token for account id', e);
                }
            }

            const payload = {
                product: Number(product.id),
                account: accountId ? Number(accountId) : 1 // fallback to 1 if no token
            };

            const resp = await productService.addFavorite(payload);
            if (resp && (resp.status === 201 || resp.status === 200)) {
                setFavorited(true);

                // Persist minimal product info in localStorage wishlist for client-side fallback
                try {
                    const raw = localStorage.getItem('wishlist');
                    const list = raw ? JSON.parse(raw) : [];
                    const exists = list.find(i => Number(i.productId) === Number(product.id));
                    if (!exists) {
                        list.push({
                            productId: Number(product.id),
                            title: product.title || product.name || product.slug || `Product ${product.id}`,
                            price: Number(unitPrice || 0),
                            image: product.images && product.images[0] ? product.images[0] : productImage,
                            slug: product.slug || product.id
                        });
                        localStorage.setItem('wishlist', JSON.stringify(list));
                    }
                } catch (e) {
                    console.warn('Could not persist wishlist locally', e);
                }
            } else {
                console.error('Error adding favorite, unexpected response', resp);
            }
        } catch (e) {
            console.error('Error adding to favorites', e);
        }
    }    

    return (
        <div className="bg-white shadow rounded-xl overflow-hidden group">
            <div className="relative">
                <img
                    src={productImage}
                    alt={name}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/images/products/product1.jpg';
                    }}
                />
                <div className="absolute inset-0 bg-black/40  flex items-center 
                justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <Link to={`/product/${slug}`}
                        className="text-[#7C86FF] text-lg w-10 h-10 rounded-full bg-[#f3d5ff] flex items-center justify-center hover:bg-[#f8aef8] hover:text-[#615FFF] hover:scale-110 transition"
                        title="Ver producto">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </Link>
                    <button
                        className={`text-[#7C86FF] text-lg w-10 h-10 rounded-full bg-[#f3d5ff] flex items-center justify-center hover:bg-[#f8aef8] hover:text-[#615FFF] hover:scale-110 transition-all duration-330 ${favorited ? "text-red-500 hover:text-red-700 transition-all" : ""}`}
                        onClick={() => handleAddToFavorites(product)}
                        title="Agregar a lista de deseados">
                        <i className="fa-solid fa-heart"></i>
                    </button>
                </div>
            </div>
            <div className="pt-4 pb-3 px-4 bg-linear-to-b from-[#e091ff] to-[#f3d5ff] border border-[#f3d5ff] rounded-1xl">
                <Link to={`/product/${slug}`}>
                    <h4 className="font-medium text-xl mb-2 text-[#610361] text-center transition line-clamp-2 font-winkySans">
                        {name}
                    </h4>
                </Link>
                <div className="flex items-baseline mb-1 space-x-2 justify-center">
                    <p className="text-xl text-[#610361] font-semibold">
                        COP {displayPrice}
                    </p>
                    {hasDiscount && (
                        <p className="text-sm text-gray-400 line-through">
                            COP {price}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
