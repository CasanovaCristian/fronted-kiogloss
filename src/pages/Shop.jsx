import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortBy, setSortBy] = useState('published,desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        tags: [],
        minPrice: '',
        maxPrice: ''
    });
    const [tags, setTags] = useState([]);

    // Cargar tags disponibles
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

    // Leer parámetros de URL al montar y cuando cambien
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');

        // Actualizar búsqueda desde URL
        if (searchParam) {
            setSearchQuery(searchParam);
        } else {
            setSearchQuery('');
        }

        // Aplicar filtro de categoría desde URL
        if (categoryParam && tags.length > 0) {
            const matchingTag = tags.find(tag =>
                tag.name.toLowerCase().includes(categoryParam.toLowerCase()) ||
                categoryParam.toLowerCase().includes(tag.name.toLowerCase())
            );

            if (matchingTag) {
                setFilters(prev => ({
                    ...prev,
                    tags: [matchingTag.id]
                }));
            }
        }
    }, [searchParams, tags]);

    // Cargar productos cuando cambien filtros, página, ordenamiento o búsqueda
    useEffect(() => {
        loadProducts();
    }, [currentPage, sortBy, filters, searchQuery]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const requestPayload = {
                page: currentPage,
                page_size: 12,
                sort: sortBy,
                tags: filters.tags.length > 0 ? filters.tags : undefined,
                search: searchQuery || undefined
            };

            console.debug('Shop loading products with params:', requestPayload);

            const data = await productService.getAllProducts(requestPayload);
            const productList = data.content || data;

            console.log('Productos cargados:', productList.length);
            setProducts(productList);
        } catch (err) {
            setError('Error al cargar los productos. Por favor, intenta de nuevo.');
            console.error('Error loading products:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Manejar cambios en los filtros desde el Sidebar
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setCurrentPage(0);

        // Limpiar parámetros de URL cuando se cambian filtros manualmente
        const newParams = {};
        if (searchQuery) {
            newParams.search = searchQuery;
        }
        setSearchParams(newParams);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        let newSort = 'published,desc';

        switch (value) {
            case 'price-low-to-high':
                newSort = 'price,asc';
                break;
            case 'price-high-to-low':
                newSort = 'price,desc';
                break;
            case 'latest':
                newSort = 'published,desc';
                break;
            default:
                newSort = 'published,desc';
        }

        setSortBy(newSort);
    };

    // Limpiar búsqueda
    const clearSearch = () => {
        setSearchQuery('');
        const newParams = {};
        if (filters.tags.length > 0) {
            // Mantener otros filtros si existen
        }
        setSearchParams(newParams);
    };

    // Limpiar todos los filtros
    const clearAllFilters = () => {
        setSearchQuery('');
        setFilters({ tags: [], minPrice: '', maxPrice: '' });
        setSearchParams({});
    };

    return (
        <div className="bg-[#F7E6FE]">
            <Breadcrumb items={[
                { label: 'Inicio', path: '/', icon: 'fa-solid fa-house text-[#610361]' },
                { label: 'Productos' }
            ]} />

            {/* shop wrapper */}
            <div className="container grid md:grid-cols-4 grid-cols-2 gap-6 pt-4 pb-16 items-start">
                {/* sidebar */}
                <Sidebar
                    onFilterChange={handleFilterChange}
                    selectedTags={filters.tags}
                />
                {/* ./sidebar */}

                {/* products */}
                <div className="col-span-3">
                    <div className="flex items-center mb-4 flex-wrap gap-2">
                        <select
                            name="sort"
                            id="sort"
                            onChange={handleSortChange}
                            className="w-60 text-sm text-[#610361] py-3 px-4 border-[#e6affc] bg-[#f3d5ff] shadow-sm rounded-lg focus:ring-[#f3d5ff] focus:border-[#f3d5ff] font-winkySans">
                            <option value="">Configuración predeterminada</option>
                            <option value="price-low-to-high">Precio: de menor a mayor</option>
                            <option value="price-high-to-low">Precio: de mayor a menor</option>
                            <option value="latest">Últimos productos</option>
                        </select>

                        {/* Mostrar búsqueda activa */}
                        {searchQuery && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[#610361] font-winkySans">
                                    Buscando:
                                </span>
                                <span className="inline-flex items-center px-3 py-1 bg-[#ebbaff] text-[#610361] text-sm rounded-full font-winkySans">
                                    "{searchQuery}"
                                    <button
                                        onClick={clearSearch}
                                        className="ml-2 hover:text-red-600 font-bold">
                                        ×
                                    </button>
                                </span>
                            </div>
                        )}

                        {/* Mostrar filtro por tags activo */}
                        {filters.tags.length > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[#610361] font-winkySans">
                                    Filtrando por:
                                </span>
                                {filters.tags.map(tagId => {
                                    const tag = tags.find(t => t.id === tagId);
                                    return tag ? (
                                        <span
                                            key={tagId}
                                            className="inline-flex items-center px-3 py-1 bg-[#ebbaff] text-[#610361] text-sm rounded-full font-winkySans">
                                            {tag.name}
                                            <button
                                                onClick={() => handleFilterChange({ ...filters, tags: [] })}
                                                className="ml-2 hover:text-red-600 font-bold">
                                                ×
                                            </button>
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {/* Botón limpiar todo */}
                        {(searchQuery || filters.tags.length > 0) && (
                            <button
                                onClick={clearAllFilters}
                                className="ml-auto px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition font-winkySans">
                                Limpiar todo
                            </button>
                        )}
                    </div>

                    {/* Loading state */}
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#610361] mx-auto"></div>
                                <p className="mt-4 text-[#610361]">Cargando productos...</p>
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {error && !loading && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}

                    {/* Products grid */}
                    {!loading && !error && (
                        <div className="grid md:grid-cols-3 grid-cols-2 gap-6">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-20">
                                    <p className="text-gray-600 text-lg font-winkySans">
                                        {searchQuery
                                            ? `No se encontraron productos para "${searchQuery}"`
                                            : 'No se encontraron productos'
                                        }
                                    </p>
                                    {(searchQuery || filters.tags.length > 0) && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="mt-4 px-6 py-2 bg-[#610361] text-white rounded-lg hover:bg-[#7d0a7d] transition font-winkySans">
                                            Limpiar filtros
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* ./products */}
            </div>
            {/* ./shop wrapper */}
        </div>
    );
};

export default Shop;