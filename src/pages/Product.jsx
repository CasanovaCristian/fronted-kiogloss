import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import productService from '../services/productService';

const Product = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState({});

    // quantity for the product detail page (min 1, max = product.stock)
    const [quantity, setQuantity] = useState(1);
    const [addedMessage, setAddedMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await productService.getProductBySlug(slug);
            setProduct(data);
        };
        fetchProduct();
    }, [slug]);

    // When product changes, ensure quantity is valid
    useEffect(() => {
        if (!product) return;
        // ensure sensible defaults
        if (!product.stock || product.stock <= 0) {
            setQuantity(1);
            return;
        }
        setQuantity((q) => {
            if (product.stock < 1) return 1;
            return q > product.stock ? product.stock : q < 1 ? 1 : q;
        });
    }, [product]);

    const increment = () => {
        setQuantity((q) => {
            const max = product?.stock ?? q + 1;
            return Math.min(q + 1, max);
        });
    };

    const decrement = () => {
        setQuantity((q) => Math.max(1, q - 1));
    };

    // Add product to cart in localStorage. Cart schema: [{ id, slug, title, price, quantity, subtotal, image, stock }]
    const addToCart = () => {
        const stock = product?.stock ?? 0;
        const price = Number(product?.price ?? 0);

        if (stock <= 0) {
            setAddedMessage('Producto sin stock');
            setTimeout(() => setAddedMessage(''), 2000);
            return;
        }

        if (quantity < 1) {
            setAddedMessage('Cantidad mínima 1');
            setTimeout(() => setAddedMessage(''), 1500);
            return;
        }

        // derive a stable id for item (try id, _id, slug)
        const itemId = product.id ?? product._id ?? product.slug ?? product.title;

        const cartKey = 'cart';
        const raw = localStorage.getItem(cartKey);
        let cart = [];
        try { cart = raw ? JSON.parse(raw) : []; } catch (e) { cart = []; }

        const existingIndex = cart.findIndex((it) => it.id === itemId);

        if (existingIndex > -1) {
            // merge quantities but cap at stock
            const existing = cart[existingIndex];
            const newQty = Math.min(stock, existing.quantity + quantity);
            existing.quantity = newQty;
            existing.subtotal = Number((existing.quantity * price).toFixed(2));
            cart[existingIndex] = existing;
        } else {
            const newItem = {
                id: itemId,
                slug: product.slug,
                title: product.title,
                price: price,
                quantity: Math.min(quantity, stock),
                subtotal: Number((Math.min(quantity, stock) * price).toFixed(2)),
                image: product.images && product.images[0] ? product.images[0] : null,
                stock: stock
            };
            cart.push(newItem);
        }

        // persist cart and cart total
        localStorage.setItem(cartKey, JSON.stringify(cart));
        const cartTotal = cart.reduce((s, it) => s + (Number(it.subtotal) || 0), 0);
        localStorage.setItem('cartTotal', Number(cartTotal.toFixed(2)));

        setAddedMessage('Añadido al carrito');
        setTimeout(() => setAddedMessage(''), 1500);
    };

    return (
        <div className="pb-24 bg-[#F7E6FE]">
            {/* breadcrumb */}
            <div className="container py-4 flex items-center gap-3">
                <Link to="/" className="text-[#610361] text-base">
                    <i className="fa-solid fa-house"></i>
                </Link>
                <span className="text-sm text-gray-400">
                    <i className="fa-solid fa-chevron-right"></i>
                </span>
                <Link to="/shop" className="text-[#610361] text-base font-winkySans">
                    Catálogo
                </Link>
                <span className="text-sm text-gray-400">
                    <i className="fa-solid fa-chevron-right"></i>
                </span>
                <p className="text-[#610361] font-winkySans">{product.title}</p>
            </div>
            {/* ./breadcrumb */}

            {/* product detail */}
            <div className="container grid grid-cols-2 gap-6">
                <div>
                    {product.images && product.images.length > 0 && (
                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover"/>
                    )}
                    <div className="grid grid-cols-5 gap-4 mt-4 mb-10">
                        {product.images && product.images.slice(1, 6).map((img, index) => (
                            <img key={index} src={img} alt={`${product.title} ${index + 2}`} className="w-full h-20 object-cover cursor-pointer" />
                        ))}
                    </div>
                </div>

                <div className="border border- pl-6">
                    <h2 className="text-4xl font-medium font-winkySans mb-2">{product.title}</h2>
                    <div className="space-y-2">
                        <p className="text-[#610361] text-2xl font-semibold space-x-2 font-surfer">
                            <span>Disponibilidad: </span>
                            <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? 'En Stock' : 'Fuera de Stock'}</span>
                        </p>
                        <p className="space-x-2 font-surfer">
                            <span className="text-[#610361] text-2xl font-semibold font-winkySans">Category: </span>
                            <span className="text-[#610361]">{product.tags && product.tags.join(', ')}</span>
                        </p>
                    </div>
                    <div className="flex items-baseline mb-1 space-x-2 font-pacifico mt-4">
                        <p className="text-xl text-[#610361] font-semibold">COP {product.price}</p>
                    </div>

                    {/* description moved to separate collapsible box below to preserve layout */}

                    <div className="pt-4">
                        <h3 className="text-2xl text-[#610361] mb-1 font-semibold font-winkySans">Talla</h3>
                        <div className="flex items-center gap-2">
                            {product.sizes && product.sizes.map((size, index) => (
                                <div className="size-selector" key={index}>
                                    <input type="radio" name="size" id={`size-${size}`} className="hidden" />
                                    <label htmlFor={`size-${size}`}
                                        className="text-xs border border-gray-200 rounded-sm h-6 w-6 flex items-center justify-center  cursor-pointer shadow-sm text-[#610361] bg-white font-surfer">{size}</label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <h3 className="text-2xl text-[#610361] mb-3 font-semibold font-winkySans">Color</h3>
                        <div className="flex items-center gap-2">
                            {product.colors && product.colors.map((color, index) => (
                                <div className="color-selector" key={index}>
                                    <input type="radio" name="color" id={`color-${color}`} className="hidden" />
                                    <label htmlFor={`color-${color}`}
                                        className="border border-gray-200 rounded-sm h-6 w-6  cursor-pointer shadow-sm block"
                                        style={{ backgroundColor: color }}></label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-2xl text-[#610361] mb-1 font-semibold font-winkySans">Cantidad</h3>
                        <div className="flex items-center gap-2">
                            <div className="flex border border-[#610361] rounded-md text-[#610361] divide-x divide-gray-300 w-max">
                                <button
                                    type="button"
                                    onClick={decrement}
                                    disabled={quantity <= 1}
                                    className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none disabled:opacity-50"
                                    aria-label="Disminuir cantidad">-</button>
                                <div className="h-8 w-12 text-base flex items-center justify-center">{quantity}</div>
                                <button
                                    type="button"
                                    onClick={increment}
                                    disabled={product?.stock ? quantity >= product.stock : false}
                                    className="h-8 w-8 text-xl flex items-center justify-center cursor-pointer select-none disabled:opacity-50"
                                    aria-label="Aumentar cantidad">+</button>
                            </div>
                            <div className="text-sm text-[#610361] font-winkySans font-semibold ml-2">Stock: {product?.stock ?? '—'}</div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3 border-b border-gray-200 pb-5 pt-5 items-center">
                        <button
                            type="button"
                            onClick={addToCart}
                            disabled={(product?.stock ?? 0) <= 0}
                            className="bg-linear-to-b from-[#ebbaff] to-[#f3d5ff] border border-[#ebbaff] text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:bg-transparent hover:text-[#610361] transition duration-300 disabled:opacity-50">
                            <i className="fa-solid fa-bag-shopping"></i> Add to cart
                        </button>
                        {addedMessage && (
                            <span className="text-sm text-green-600">{addedMessage}</span>
                        )}
                        <a href="#"
                            className="bg-linear-to-b from-[#ebbaff] to-[#f3d5ff] border border-[#ebbaff] text-white px-8 py-2 font-medium rounded uppercase flex items-center gap-2 hover:text-primary transition duration-300">
                            <i className="fa-solid fa-heart"></i> Wishlist
                        </a>
                    </div>
                </div>
            </div>
            {/* ./product detail */}

            {/* description (separate collapsible box, outside the columns) */}
            <div className="container">
                <details className="product-details">
                    <summary>
                        <span>Descripción</span>
                        <span className="flex items-center">
                            <span className="toggle-plus mr-2">+</span>
                            <span className="toggle-minus">−</span>
                        </span>
                    </summary>
                    <div className="mt-4 text-gray-600">
                        <p>{product.description || 'No hay descripción para este producto.'}</p>
                    </div>
                </details>
            </div>
        </div>
    );
};

export default Product;