import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';

const Home = () => {
    const [tags, setTags] = useState([]);

    // Cargar tags al montar
    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            const data = await productService.getAllTags();
            setTags(data || []);
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

    // Mapeo de nombres de categorías a IDs (deberás ajustar según tus IDs reales)
    const getCategoryId = (categoryName) => {
        const category = tags.find(tag =>
            tag.name.toLowerCase().includes(categoryName.toLowerCase())
        );
        return category ? category.id : null;
    };

    return (
        <div className="bg-[#F7E6FE]">
            {/* banner */}
            <div className="bg-cover bg-no-repeat bg-center py-36 mt-1" style={{ backgroundImage: "url('/assets/images/banner-bg.jpeg')" }}>
                <div className="container">
                    <h1 className="text-6xl text-gray-800 font-medium mb-4 capitalize font-swash">
                        Las mejores colecciones <br /> de Belleza
                    </h1>
                    <div className="mt-12">
                        <Link to="/shop" className="bg-[#610361] border border-[#e6affc] text-white hover:-translate-y-1 transition-transform duration-300 px-8 py-3 font-medium 
                    rounded-md font-swash">Compra Ahora</Link>
                    </div>
                </div>
            </div>
            {/* ./banner */}

            {/* features */}
            <div className="container py-8">
                <div className="w-10/12 grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto justify-center">
                    <div className="
            border border-[#ebbaff] bg-[#ebbaff] rounded-lg px-3 py-6 flex justify-center items-center gap-5 relative overflow-hidden
            transition-all duration-500 ease-in-out 
            hover:scale-[1.02] 
            hover:shadow-2xl hover:shadow-[#610361]/30 
            hover:border-[#610361] 
            cursor-pointer
        ">
                        <img src="/assets/images/icons/delivery-van.svg" alt="Delivery" className="w-12 h-12 object-contain" />
                        <div>
                            <h4 className="font-medium font-winkySans capitalize text-lg">Envíos a todo el país</h4>
                        </div>
                    </div>

                    <div className="
            border border-[#ebbaff] bg-[#ebbaff] bg-linear-to-b from-[#ebbaff] to-[#f3d5ff] rounded-lg px-3 py-6 flex justify-center items-center gap-5 relative overflow-hidden
            transition-all duration-500 ease-in-out 
            hover:scale-[1.02] 
            hover:shadow-2xl hover:shadow-[#610361]/30 
            hover:border-[#610361] 
            cursor-pointer
        ">
                        <img src="/assets/images/icons/money-back.svg" alt="Reembolso" className="w-12 h-12 object-contain" />
                        <div>
                            <h4 className="font-medium font-winkySans capitalize text-lg">Reembolso</h4>
                            <p className="text-gray-500 font-winkySans text-sm">30 días de devolución de dinero</p>
                        </div>
                    </div>

                    <div className="
            border border-[#ebbaff] bg-[#ebbaff] bg-linear-to-b from-[#ebbaff] to-[#f3d5ff] rounded-lg px-3 py-6 flex justify-center items-center gap-5 relative overflow-hidden
            transition-all duration-500 ease-in-out 
            hover:scale-[1.02] 
            hover:shadow-2xl hover:shadow-[#610361]/30 
            hover:border-[#610361] 
            cursor-pointer
        ">
                        <img src="/assets/images/icons/service-hours.svg" alt="Soporte" className="w-12 h-12 object-contain" />
                        <div>
                            <h4 className="font-medium font-winkySans capitalize text-lg text-[#610361]">Soporte 24/7</h4>
                            <p className="text-gray-500 font-winkySans text-sm">Atención al cliente</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* ./features */}

            {/* categories */}
            <div className="container pb-8">
                <h2 className="text-5xl font-medium text-[#610361] font-swash mb-8 text-center">Comprar por categoria</h2>
                <div className="grid grid-cols-3 gap-3">
                    <div className="relative rounded-sm overflow-hidden group">
                        <img src="/assets/images/category/category-1.jpg" alt="category 1" className="w-full h-full" />
                        <Link to={`/shop?category=facial`}
                            className="absolute inset-0 bg-black/30 hover:bg-black/60 flex items-center justify-center text-xl text-white font-medium group-hover:bg-opacity-60 transition font-surfer">
                            Cuidado Facial
                        </Link>
                    </div>
                    <div className="relative rounded-sm overflow-hidden group">
                        <img src="/assets/images/category/category-2.jpg" alt="category 2" className="w-full h-full" />
                        <Link to={`/shop?category=maquillaje`}
                            className="absolute inset-0 bg-black/30 hover:bg-black/60 flex items-center justify-center text-xl text-white font-surfer font-medium group-hover:bg-opacity-60 transition">
                            Maquillaje
                        </Link>
                    </div>
                    <div className="relative rounded-sm overflow-hidden group">
                        <img src="/assets/images/category/category-3.jpg" alt="category 3" className="w-full h-full" />
                        <Link to={`/shop?category=desmaquillantes`}
                            className="absolute inset-0 bg-black/31 hover:bg-black/60 flex items-center justify-center text-xl text-white font-surfer font-medium group-hover:bg-opacity-60 transition">
                            Desmaquillantes
                        </Link>
                    </div>
                    <div className="relative rounded-sm overflow-hidden group">
                        <img src="/assets/images/category/category-4.jpg" alt="category 4" className="w-full h-full" />
                        <Link to={`/shop?category=tonicos`}
                            className="absolute inset-0 bg-black/30 hover:bg-black/60 flex items-center justify-center text-xl text-white font-surfer font-medium group-hover:bg-opacity-60 transition">
                            Tónicos
                        </Link>
                    </div>
                    <div className="relative rounded-sm overflow-hidden group">
                        <img src="/assets/images/category/category-5.jpg" alt="category 5" className="w-full h-full" />
                        <Link to={`/shop?category=capilar`}
                            className="absolute inset-0 bg-black/30 hover:bg-black/60 flex items-center justify-center text-xl text-white font-surfer font-medium group-hover:bg-opacity-60 transition">
                            Cuidado Capilar
                        </Link>
                    </div>
                    <div className="relative rounded-sm overflow-hidden group">
                        <img src="/assets/images/category/category-6.jpg" alt="category 6" className="w-full h-full" />
                        <Link to={`/shop?category=brochas`}
                            className="absolute inset-0 bg-black/30 hover:bg-black/60 flex items-center justify-center text-xl text-white font-surfer font-medium group-hover:bg-opacity-60 transition">
                            Brochas
                        </Link>
                    </div>
                </div>
            </div>
            {/* ./categories */}
        </div>
    );
};

export default Home;