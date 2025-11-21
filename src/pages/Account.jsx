import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react"
import api from "../services/api"
import {jwtDecode} from "jwt-decode"
import productService from '../services/productService'

const Account = () => {

    const [user, setUser] = useState("") 
    const navigate = useNavigate()
    const [editMode, setEditMode] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', phone: '' })
    const [favorites, setFavorites] = useState([])
    const [favLoading, setFavLoading] = useState(false)

    const getInfoUser = async () => {
        try {
            const tokenAccess = localStorage.getItem("access") || localStorage.getItem('accessToken')
            if (!tokenAccess) return
            const { user_id } = jwtDecode(tokenAccess)
            if (!user_id) return
            const { data } = await api.get(`/user/${user_id}`)
            setUser(data)
            // initialize form values
            setForm({
                name: data?.name || '',
                email: data?.email || '',
                phone: data?.phone || data?.telephone || ''
            })
        } catch (e) {
            console.warn('Could not load account data', e)
        }
    }

    const loadFavorites = async () => {
        setFavLoading(true)
        try {
            const rawToken = localStorage.getItem('access') || localStorage.getItem('accessToken')
            if (rawToken) {
                let accountId = null
                try {
                    const dec = jwtDecode(rawToken)
                    accountId = dec?.user_id || dec?.userId || dec?.sub || dec?.id || null
                } catch (e) {
                    console.warn('Could not decode token', e)
                }

                if (accountId) {
                    try {
                        const resp = await productService.getFavoritesByAccount(accountId)
                        // Normalize to array of { product, favoriteId }
                        let list = []
                        if (resp && resp.account) {
                            const fav = resp.account.favorite
                            if (Array.isArray(fav)) {
                                list = fav.map(i => {
                                    if (i.product) {
                                        return { product: i.product, favoriteId: i.id || i.pk || null }
                                    }
                                    // fallback shapes
                                    return { product: { id: i.id, name: i.name, images: i.images ? i.images : undefined, price: i.price, slug: i.slug }, favoriteId: i.idFa || i.id }
                                })
                            }
                        }
                        // If list items are minimal, try fetching details
                        const detailed = await Promise.all(list.map(async it => {
                            if (!it.product?.name && it.product?.id) {
                                try {
                                    const p = await productService.getProductById(it.product.id)
                                    return { product: p, favoriteId: it.favoriteId }
                                } catch (e) {
                                    return it
                                }
                            }
                            return it
                        }))
                        setFavorites(detailed)
                        setFavLoading(false)
                        return
                    } catch (e) {
                        console.warn('Error fetching favorites from backend, falling back to localStorage', e)
                    }
                }
            }

            // fallback localStorage 'wishlist'
            const raw = localStorage.getItem('wishlist')
            const list = raw ? JSON.parse(raw) : []
            setFavorites(list.map(i => ({ product: { id: i.productId, name: i.title || i.name, images: i.image ? [i.image] : undefined, price: i.price, slug: i.slug }, favoriteId: null })))
        } catch (e) {
            console.error('Error loading favorites', e)
        } finally {
            setFavLoading(false)
        }
    }

    const removeFavorite = async (favoriteId, productId) => {
        try {
            if (favoriteId) {
                await productService.removeFavoriteByPk(favoriteId)
            }
            // update localStorage fallback
            try {
                const raw = localStorage.getItem('wishlist')
                const list = raw ? JSON.parse(raw) : []
                const filtered = list.filter(i => Number(i.productId) !== Number(productId))
                localStorage.setItem('wishlist', JSON.stringify(filtered))
            } catch (e) {
                console.warn('Could not update local wishlist', e)
            }
            setFavorites(prev => prev.filter(f => Number(f.product?.id) !== Number(productId)))
        } catch (e) {
            console.error('Error removing favorite', e)
        }
    }

    const handleEditToggle = () => setEditMode(v => !v)

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSave = async () => {
        try {
            const rawToken = localStorage.getItem('access') || localStorage.getItem('accessToken')
            if (!rawToken) return alert('No está autenticado')
            const { user_id } = jwtDecode(rawToken)
            if (!user_id) return alert('No se pudo identificar al usuario')

            const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone
            }

            // pass explicit header to handle both 'access' and 'accessToken' keys
            const token = rawToken
            const resp = await api.put(`/user/${user_id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
            // Update local state with returned data if present
            if (resp?.data) {
                setUser(resp.data)
                setForm({ name: resp.data.name || '', email: resp.data.email || '', phone: resp.data.phone || resp.data.telephone || '' })
            }
            setEditMode(false)
            alert('Información actualizada')
        } catch (e) {
            console.error('Error updating user', e)
            alert('No fue posible actualizar la información')
        }
    }

    useEffect( () => {

        getInfoUser()
        loadFavorites()

    }, [] )

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
                <p className="text-gray-600 font-medium">Account</p>
            </div>
            {/* ./breadcrumb */}

            {/* account wrapper */}
            <div className="container grid grid-cols-12 items-start gap-6 pt-4 pb-16">
                {/* sidebar (simplified) */}
                <div className="col-span-3">
                    <div className="px-4 py-3 shadow flex items-center gap-4">
                        <div className="shrink-0">
                            <img src={user?.profileImage !== null && user?.profileImage ? user.profileImage : "/assets/images/perfil.jpg"} alt="profile"
                                className="rounded-full w-14 h-14 border border-gray-200 p-1 object-cover" />
                        </div>
                        <div className="grow">
                            <p className="text-gray-600">Hola,</p>
                            <h4 className="text-gray-800 font-medium">{user?.name || 'Usuario'}</h4>
                        </div>
                    </div>

                    <div className="mt-6 bg-white shadow rounded p-4 divide-y divide-gray-200 space-y-4 text-gray-600">
                        <div className="space-y-1 pl-8">
                            <Link to="/account" className="relative text-primary block font-medium capitalize transition">
                                <span className="absolute -left-8 top-0 text-base">
                                    <i className="fa-regular fa-address-card"></i>
                                </span>
                                Perfil
                            </Link>
                            <Link to="/orders" className="relative hover:text-primary block capitalize transition">
                                Mis pedidos
                            </Link>
                            <Link to="/wishlist" className="relative hover:text-primary block capitalize transition">
                                Lista de deseados
                            </Link>
                        </div>

                        <div className="space-y-1 pl-8 pt-4">
                            <button onClick={() => {
                                // logout
                                localStorage.removeItem('access');
                                localStorage.removeItem('accessToken');
                                localStorage.removeItem('refreshToken');
                                navigate('/');
                            }} className="relative hover:text-primary block font-medium capitalize transition">
                                <span className="absolute -left-8 top-0 text-base">
                                    <i className="fa-solid fa-right-from-bracket"></i>
                                </span>
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
                {/* ./sidebar */}

                {/* info (summary) */}
                <div className="col-span-9 shadow rounded px-6 pt-5 pb-7">
                    <h4 className="text-lg font-medium capitalize mb-4">Información de perfil</h4>

                    <div className="grid grid-cols-2 gap-6">
                        {!editMode ? (
                            <>
                                <div>
                                    <p className="text-sm text-gray-500">Nombre</p>
                                    <p className="text-lg font-medium">{user?.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Correo electrónico</p>
                                    <p className="text-lg font-medium">{user?.email || '-'}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm text-gray-500">Nombre</label>
                                    <input name="name" value={form.name} onChange={handleChange} className="input-box" />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Correo electrónico</label>
                                    <input name="email" value={form.email} onChange={handleChange} className="input-box" />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-4">
                        {!editMode ? (
                            <div className="flex items-center gap-3">
                                <button onClick={handleEditToggle} className="py-2 px-4 bg-primary text-white rounded-md">Editar perfil</button>
                                <button onClick={() => { navigate('/wishlist') }} className="py-2 px-4 border rounded-md">Ver favoritos</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button onClick={handleSave} className="py-2 px-4 bg-primary text-white rounded-md">Guardar</button>
                                <button onClick={handleEditToggle} className="py-2 px-4 border rounded-md">Cancelar</button>
                            </div>
                        )}
                    </div>
                </div>
                {/* ./info */}

                {/* favorites 
                
                
                <div className="col-span-12 mt-8">
                    <h4 className="text-lg font-medium mb-4">Favoritos</h4>
                    {favLoading ? (
                        <div>Cargando favoritos...</div>
                    ) : favorites.length === 0 ? (
                        <div className="text-gray-500">No tienes favoritos todavía.</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {favorites.map((it, idx) => {
                                const p = it.product || {}
                                const img = (p.images && p.images[0]) || p.image || '/assets/images/products/product1.jpg'
                                return (
                                    <div key={p.id || idx} className="bg-white shadow rounded-xl overflow-hidden">
                                        <div className="relative">
                                            <img src={img} alt={p.name || p.title} className="w-full h-48 object-cover" />
                                        </div>
                                        <div className="pt-4 pb-3 px-4">
                                            <h4 className="uppercase font-medium text-lg mb-2">{p.name || p.title || 'Producto'}</h4>
                                            <p className="text-lg font-semibold">COP {p.price ?? p.displayPrice ?? ''}</p>
                                        </div>
                                        <div className="p-4">
                                            <button onClick={() => removeFavorite(it.favoriteId, p.id)} className="py-2 px-4 bg-red-500 text-white rounded-md">Eliminar</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>*/}
                
                {/*  */}
            </div>
            {/* ./account wrapper */}
        </>
    );
};

export default Account;
