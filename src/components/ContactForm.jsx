import React, { useState } from 'react'

// Icono SVG de corazón/maquillaje para el título.
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 inline-block mr-2 align-text-bottom text-pink-100">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.933 0-3.593 1.134-4.388 2.378-2.612-3.132-7.005-2.14-8.895 2.14-1.282 3.013.791 6.02 4.388 6.02h.67l-.67 6.75h4.5v-6.75h2.25v6.75h4.5V11.25h.67c3.597 0 5.67-3.007 4.388-6.02 1.282-3.013.791-6.02-2.14-8.895z" />
    </svg>
);


export default function ContactForm() {
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [asunto, setAsunto] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [loading, setLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    // 🎯 Reemplaza este correo con el destinatario real.
    const DESTINATION_EMAIL = 'casanovacristian40@gmail.com';

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSuccessMsg('')
        setErrorMsg('')

        // Validación de campos vacíos
        if (!nombre.trim() || !email.trim() || !asunto.trim() || !mensaje.trim()) {
            setErrorMsg('Por favor completa todos los campos.');
            return;
        }

        setLoading(true);

        try {
            // 1. Codificar los valores para URL
            const body = encodeURIComponent(`Hola, mi nombre es ${nombre}. \n\n${mensaje}\n\nMi correo es: ${email}`);
            const subject = encodeURIComponent(asunto);

            // 2. Construir la URL mailto:
            // Usamos un salto de línea (%0D%0A) para estructurar el mensaje en el cuerpo del correo.
            const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${subject}&body=${body}`;

            // 3. Abrir el cliente de correo en una nueva pestaña
            window.open(mailtoUrl, '_blank');

            setSuccessMsg('¡Mensaje listo! Se abrió tu cliente de correo para que puedas enviarlo. Y pronto recibirá una respuesta.');

            // Limpiar campos tras el éxito
            setNombre('');
            setEmail('');
            setAsunto('');
            setMensaje('');

        } catch (err) {
            // Este catch es más bien para errores de JS si los hubiese, no de red.
            setErrorMsg('Ocurrió un error al preparar el correo.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg">
                <div className="bg-white rounded-xl shadow-2xl border-2 border-[#a84aa7] overflow-hidden transform transition duration-500 hover:shadow-1xl">
                    <div className="bg-[#a84aa7] px-6 py-6 sm:px-8">
                        <h2 className="text-3xl font-extrabold text-white text-center tracking-tight">
                            <HeartIcon />
                            Contáctanos
                        </h2>
                        <p className="text-md text-pink-100 mt-2 text-center">¡Estamos aquí para ayudarte! Escríbenos y te responderemos tan pronto como sea posible.</p>
                    </div>

                    <div className="p-6 sm:p-8">
                        {successMsg && (
                            // La clase 'animate-pulse-once' se mantuvo, pero la animación es solo visual.
                            <div className="mb-6 p-4 rounded-lg text-green-800 bg-green-100 border border-green-300 font-medium">{successMsg}</div>
                        )}

                        {errorMsg && (
                            <div className="mb-6 p-4 rounded-lg text-red-800 bg-red-100 border border-red-300 font-medium">{errorMsg}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Campo Nombre */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="nombre">Nombre Completo *</label>
                                <input
                                    id="nombre"
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150"
                                    placeholder="Tu nombre o el de tu negocio"
                                    required
                                />
                            </div>

                            {/* Campo Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="email">Correo Electrónico *</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150"
                                    placeholder="ejemplo@dominio.com"
                                    required
                                />
                            </div>

                            {/* Campo Asunto */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="asunto">Asunto o Tema *</label>
                                <input
                                    id="asunto"
                                    type="text"
                                    value={asunto}
                                    onChange={(e) => setAsunto(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150"
                                    placeholder="Consulta de pedido, colaboración, etc."
                                    required
                                />
                            </div>

                            {/* Campo Mensaje */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1" htmlFor="mensaje">Tu Mensaje *</label>
                                <textarea
                                    id="mensaje"
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-2 rounded-lg border border-[#e6c0e6] focus:outline-none focus:ring-2 focus:ring-[#d78ac7] focus:border-[#d78ac7] transition duration-150"
                                    placeholder="Describe tu consulta en detalle aquí..."
                                    required
                                />
                            </div>

                            {/* Botón de Envío */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-lg bg-[#a84aa7] hover:bg-[#8e398d] text-white text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition duration-200"
                                    disabled={loading}
                                >
                                    {loading ? 'Preparando Correo...' : 'ENVIAR MENSAJE VÍA EMAIL'}
                                </button>
                            </div>

                            <p className="text-xs text-center text-gray-500 mt-4">* Todos los campos son obligatorios. </p>
                            <p className="text-xs text-center text-gray-400 mt-1">** Se abrirá tu aplicación de correo predeterminada para el envío final.</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}