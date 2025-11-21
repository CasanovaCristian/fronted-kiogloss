import React from 'react';

// URL de imagen de fondo simulada con placeholder. 
// Reemplázala con la URL de una foto tuya de alta calidad, de un producto estrella o de la fundadora.
const BRAND_IMAGE_URL = "assets/images/banner-bg.jpeg";

// Datos de los valores para iterar
const brandValues = [
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#d78ac7] transition duration-300 group-hover:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.542a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557L3.998 9.988c-.38-.325-.178-.948.321-.988l5.518-.442a.563.563 0 0 0 .475-.345l2.125-5.112Z" />
            </svg>
        ),
        title: "Calidad Premium",
        description: "Solo utilizamos ingredientes de la más alta calidad, 100% libres de crueldad y veganos. Tu piel merece lo mejor."
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#d78ac7] transition duration-300 group-hover:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.316-2.316L15 6.375l1.035-.259a3.375 3.375 0 0 0 2.316-2.316L18.75 3l.259 1.035a3.375 3.375 0 0 0 2.316 2.316L22.5 7.5l-1.035.259a3.375 3.375 0 0 0-2.316 2.316Z" />
            </svg>
        ),
        title: "Innovación y Tendencias",
        description: "Siempre estamos buscando los pigmentos y fórmulas más recientes para traerte lo último en belleza global."
    },
    {
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#d78ac7] transition duration-300 group-hover:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.933 0-3.593 1.134-4.388 2.378-2.612-3.132-7.005-2.14-8.895 2.14-1.282 3.013.791 6.02 4.388 6.02h.67l-.67 6.75h4.5v-6.75h2.25v6.75h4.5V11.25h.67c3.597 0 5.67-3.007 4.388-6.02 1.282-3.013.791-6.02-2.14-8.895z" />
            </svg>
        ),
        title: "Comunidad y Belleza",
        description: "Creemos que la belleza es para todos. Inspiramos la autoexpresión a través del maquillaje sin límites."
    }
];

export default function AboutUsSection() {
    return (
        <div className="min-h-screen bg-white">
            {/* Sección Principal con la imagen y el eslogan */}
            <header className="relative overflow-hidden pt-16 pb-16 lg:pt-24 lg:pb-32">
                <div className="absolute inset-0">
                    {/* Contenedor de la imagen con efecto de superposición */}
                    <img
                        src={BRAND_IMAGE_URL}
                        alt="Productos de maquillaje de alta calidad de Kio Gloss"
                        className="w-full h-full object-cover object-center"
                        // Fallback por si la imagen no carga
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600/a84aa7/ffffff?text=Kio+Gloss" }}
                    />
                    {/* Superposición (Overlay) que usa el color lila principal */}
                    <div className="absolute inset-0 bg-[#a84aa7] opacity-60 mix-blend-multiply"></div>
                </div>

                {/* Contenido centrado sobre la imagen */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">
                        Kio Gloss: Tu Belleza, Amplificada.
                    </h1>
                    <p className="mt-4 max-w-xl mx-auto text-xl text-pink-100 sm:mt-5 drop-shadow-md">
                        Desde 2020, somos tu distribuidor de confianza en productos de belleza.
                        Ofrecemos una selección exclusiva de cosméticos que inspiran seguridad y estilo.
                        Porque cada rostro merece brillar con su propio arte.
                    </p>
                    <div className="mt-8">
                        <a
                            href="#nuestros-valores"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-[#a84aa7] bg-white hover:bg-gray-100 transition duration-300 transform hover:scale-105"
                        >
                            Conoce Nuestra Misión
                        </a>
                    </div>
                </div>
            </header>

            {/* Sección de Historia y Origen (Usando el rosa suave de la marca) */}
            <div className="py-16 sm:py-24 bg-[#fcf5fb]"> {/* Rosa muy suave como fondo */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-[#a84aa7] font-semibold tracking-wide uppercase">Nuestra Historia</h2>
                        <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Todo comenzó con una pasión por el color
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Fundada por nuestra CEO, [Mamá de Carlos], Kio Gloss nació del deseo de ofrecer acceso a productos de belleza de alta calidad.
                            Nos especializamos en la distribución de marcas reconocidas que celebran la diversidad, los tonos de piel y las texturas.
                            Nuestro compromiso es acercarte lo mejor del maquillaje para que cada persona pueda expresar su estilo único.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sección de Valores (Grid de 3 columnas) */}
            <div id="nuestros-valores" className="bg-white pt-16 pb-20 sm:pt-24 sm:pb-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-[#a84aa7] font-semibold tracking-wide uppercase">Principios de Kio Gloss</h2>
                        <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Lo que nos Mueve
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Nuestros valores fundamentales guían cada decisión, desde la formulación de un nuevo labial hasta el empaque que llega a tu puerta.
                        </p>
                    </div>

                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {brandValues.map((item) => (
                                <div key={item.title} className="group flex flex-col p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-[#e6c0e6] hover:bg-[#a84aa7]">
                                    <div className="flex-shrink-0 mb-4">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xl font-bold text-gray-900 group-hover:text-white transition duration-300">
                                            {item.title}
                                        </p>
                                        <p className="mt-2 text-base text-gray-500 group-hover:text-pink-100 transition duration-300">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Final */}
            <div className="bg-[#a84aa7] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
                        ¿Lista para tu próxima colección?
                    </h3>
                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex rounded-full shadow">
                            <a
                                href="/shop"
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-[#a84aa7] bg-white hover:bg-pink-50 transition duration-300"
                            >
                                Explora nuestros Productos
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}