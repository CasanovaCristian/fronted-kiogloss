import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useState } from "react";

// Ícono para el formulario
const RegisterIcon = () => (
    <svg
        className="w-12 h-12 mx-auto text-[#a84aa7]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
        />
    </svg>
);

const Register = () => {

    const navegar = useNavigate();

    // --- TU LÓGICA DE ESTADO (INTACTA) ---
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [street, setStreet] = useState("");
    const [streetNumber, setStreetNumber] = useState("");
    const [distric, setDistric] = useState("");

    // --- NUEVO ESTADO PARA EL TOGGLE (ojito) ---
    const [showPassword, setShowPassword] = useState(false);

    // --- TU LÓGICA DE SUBMIT (INTACTA) ---
    const handlerSignUp = async (e) => {
        e.preventDefault();
        console.log(email);
        console.log(name);
        console.log(password);
        console.log(phoneNumber);
        console.log(street);
        console.log(streetNumber);
        console.log(distric);
        const createUserPayload = {
            email,
            name,
            password,
            phoneNumber,
            address: {
                street,
                streetNumber,
                distric
            },
            account: {
                pointsPerPurchase: 0,
                isActive: true
            }
        }
        const { data } = await api.post("/user/", createUserPayload)
        console.log(data);
        localStorage.setItem("access", JSON.stringify(data.access))
        localStorage.setItem("refresh", JSON.stringify(data.refresh))
        navegar("/account")
    }
    // --- FIN DE TU LÓGICA ---

    return (
        <>
            {/* breadcrumb (Sin cambios) */}
            <div className="container py-4 flex items-center gap-3">
                <Link to="/" className="text-primary text-base">
                    <i className="fa-solid fa-house"></i>
                </Link>
                <span className="text-sm text-gray-400">
                    <i className="fa-solid fa-chevron-right"></i>
                </span>
                <p className="text-gray-600 font-medium">Register</p>
            </div>
            {/* ./breadcrumb */}

            {/* --- SECCIÓN DE REGISTRO REDISEÑADA --- */}
            <div className="bg-gray-50 py-16">
                <div className="container flex items-center justify-center">
                    {/* Tarjeta de registro (un poco más ancha para 7 campos) */}
                    <div className="max-w-lg w-full bg-white p-8 md:p-10 rounded-xl shadow-xl">

                        {/* Encabezado del formulario */}
                        <div className="text-center mb-8">
                            <RegisterIcon />
                            <h2 className="text-3xl font-extrabold text-gray-900 mt-4">
                                Crear una Cuenta
                            </h2>
                            <p className="text-gray-500 mt-2 text-sm">
                                Regístrate para comprar y ver tus pedidos.
                            </p>
                        </div>

                        <form action="#" method="post" autoComplete="off">
                            {/* Espaciado de 4, un poco menos que el login porque hay más campos */}
                            <div className="space-y-4">

                                {/* --- SECCIÓN DE DATOS PERSONALES --- */}
                                <div>
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
                                        Nombre Completo
                                    </label>
                                    <input type="text" name="name" id="name"
                                        value={name} // Lógica intacta
                                        onChange={(e) => setName(e.target.value)} // Lógica intacta
                                        className="block w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150 placeholder-gray-400"
                                        placeholder="Tu nombre completo" />
                                </div>

                                <div>
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                                        Email
                                    </label>
                                    <input type="email" name="email" id="email"
                                        value={email} // Lógica intacta
                                        onChange={(e) => setEmail(e.target.value)} // Lógica intacta
                                        className="block w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150 placeholder-gray-400"
                                        placeholder="tucorreo@dominio.com" />
                                </div>

                                <div>
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"} // <-- Lógica del ojito
                                            name="password" id="password"
                                            value={password} // Lógica intacta
                                            onChange={(e) => setPassword(e.target.value)} // Lógica intacta
                                            className="block w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150 pr-12 placeholder-gray-400"
                                            placeholder="*******" />

                                        {/* Botón del "ojito" */}
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-12 text-gray-500 hover:text-[#a84aa7] focus:outline-none"
                                        >
                                            <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-1 block">
                                        Número Telefónico
                                    </label>
                                    <input type="tel" name="phoneNumber" id="phoneNumber"
                                        value={phoneNumber} // Lógica intacta
                                        onChange={(e) => setPhoneNumber(e.target.value)} // Lógica intacta
                                        className="block w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150 placeholder-gray-400"
                                        placeholder="Ej: 3001234567" />
                                </div>

                                {/* --- SECCIÓN DE DIRECCIÓN (en cuadrícula) --- */}
                                <div className="pt-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        Dirección de Envío
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Campo Calle (ocupa 2 columnas en móvil, 1 en md) */}
                                        <div className="md:col-span-2">
                                            <label htmlFor="street" className="text-xs text-gray-500 mb-1 block">Calle</label>
                                            <input type="text" name="street" id="street"
                                                value={street} // Lógica intacta
                                                onChange={(e) => setStreet(e.target.value)} // Lógica intacta
                                                className="block w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150 placeholder-gray-400"
                                                placeholder="Ej: Calle 19a" />
                                        </div>

                                        {/* Campo Número */}
                                        <div>
                                            <label htmlFor="dirección" className="text-xs text-gray-500 mb-1 block">Número</label>
                                            <input type="text" name="dirección" id="dirección"
                                                value={streetNumber} // Lógica intacta
                                                onChange={(e) => setStreetNumber(e.target.value)} // Lógica intacta
                                                className="block w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150 placeholder-gray-400"
                                                placeholder="Ej: #39-17" />
                                        </div>

                                        {/* Campo Barrio */}
                                        <div>
                                            <label htmlFor="barrio" className="text-xs text-gray-500 mb-1 block">Barrio</label>
                                            <input type="text" name="barrio" id="barrio"
                                                value={distric} // Lógica intacta
                                                onChange={(e) => setDistric(e.target.value)} // Lógica intacta
                                                className="block w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150 placeholder-gray-400"
                                                placeholder="Ej: Oriente" />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Botón de Registro */}
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    onClick={(e) => handlerSignUp(e)} // Lógica intacta
                                    className="block w-full py-3 px-4 text-center text-white bg-[#a84aa7] rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition duration-300 ease-in-out uppercase font-semibold"
                                >
                                    Crear Cuenta
                                </button>
                            </div>
                        </form>

                        {/* Enlace a Login */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{" "}
                            <Link
                                to="/login"
                                className="text-[#a84aa7] font-bold hover:underline"
                            >
                                Inicia Sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* --- FIN DE SECCIÓN REDISEÑADA --- */}
        </>
    );
};

export default Register;