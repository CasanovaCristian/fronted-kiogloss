import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api';

// Ícono para el formulario (¡un toque visual!)
const LockIcon = () => (
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
    </svg>
);

const Login = () => {
    const navigate = useNavigate();

    // --- LÓGICA DE LOGIN ---
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // <-- 1. Nuevo estado

    const handlerLogIn = async (e) => {
        e.preventDefault();
        console.log(email);
        console.log(password);
        const userPayload = {
            password,
            email,
        };
        const { data } = await api.post("/login", userPayload);
        console.log(data);
        localStorage.setItem("access", JSON.stringify(data.access));
        localStorage.setItem("refresh", JSON.stringify(data.refresh));
        navigate("/account");
    };
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
                <p className="text-gray-600 font-medium">Login</p>
            </div>
            {/* ./breadcrumb */}

            {/* --- SECCIÓN DE LOGIN REDISEÑADA --- */}
            <div className="bg-gray-50 py-16">
                <div className="container flex items-center justify-center">
                    <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-xl shadow-xl">
                        {/* Encabezado del formulario */}
                        <div className="text-center mb-8">
                            <LockIcon />
                            <h2 className="text-3xl font-extrabold text-gray-900 mt-4">
                                Inicia Sesión
                            </h2>
                            <p className="text-gray-500 mt-2 text-sm">
                                ¡Bienvenido de nuevo!
                            </p>
                        </div>

                        <form action="#" method="post" autoComplete="off">
                            <div className="space-y-6">
                                {/* Campo de Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700 mb-1 block"
                                    >
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150 placeholder-gray-400 pr-12"
                                        placeholder="tucorreo@dominio.com"
                                    />
                                </div>

                                {/* Campo de Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700 mb-1 block"
                                    >
                                        Password
                                    </label>
                                    {/* 2. Contenedor relativo para el ícono */}
                                    <div className="relative">
                                        <input
                                            // 3. Tipo de input dinámico
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            // 4. Padding a la derecha para que el texto no se ponga debajo del ícono
                                            className="block w-full px-4 py-3 text-gray-700 bg-gray-50 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150 pr-12" // <-- Modificado
                                            placeholder="*****"
                                        />
                                        {/* 5. Botón del "ojito" */}
                                        <button
                                            type="button" // <-- Importante: 'type="button"' para que no envíe el formulario
                                            onClick={() => setShowPassword(!showPassword)} // <-- Cambia el estado
                                            className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-12 text-gray-500 hover:text-[#a84aa7] focus:outline-none"
                                        >
                                            <i
                                                // 6. Ícono dinámico
                                                className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                            ></i>
                                        </button>
                                    </div> {/* <-- Fin del div relative */}
                                </div>
                            </div>

                            {/* Botón de Login */}
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    onClick={(e) => handlerLogIn(e)}
                                    className="block w-full py-3 px-4 text-center text-white bg-[#a84aa7] rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition duration-300 ease-in-out uppercase font-semibold"
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                        {/* Enlace a Registro */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            ¿No tienes una cuenta?{" "}
                            <Link
                                to="/register"
                                className="text-[#a84aa7] font-bold hover:underline"
                            >
                                Regístrate ahora
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            {/* --- FIN DE SECCIÓN REDISEÑADA --- */}
        </>
    );
};

export default Login;