const Footer = () => {
    return (
        <>
            {/* footer */}
            <footer className="bg-linear-to-b from-[#ebbaff] to-[#f3d5ff] pt-16 pb-12 border-t border-gray-100">
    <div className="container">
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12 pb-10">
            
            <div className="col-span-1 space-y-4">
                <img src="/assets/images/logo.png" alt="logo" className="w-48" />
                <div className="mr-2">
                    <p className="text-[#7C86FF] font-swash text-lg">
                        Tu belleza, amplificada.
                    </p>
                </div>
                <div className="flex space-x-5 font">
                    <a href="https://www.tiktok.com/@kiogloss" className="text-[#610361] hover:-translate-y-1 transition-transform duration-300" target="_blank" rel="noopener noreferrer"><i
                        className="fa-brands fa-tiktok text-3xl"></i></a>
                    <a href="https://www.instagram.com/kio_gloss/?hl=es" className="text-[#610361] hover:-translate-y-1 transition-transform duration-300" target="_blank" rel="noopener noreferrer"><i
                        className="fa-brands fa-instagram text-3xl"></i></a>
                    <a href="https://api.whatsapp.com/message/X7QVYQOJXRFUA1?autoload=1&app_absent=0" className="text-[#610361] hover:-translate-y-1 transition-transform duration-300" target="_blank" rel="noopener noreferrer"><i
                        className="fa-brands fa-whatsapp text-3xl"></i></a>
                </div>
            </div>

            <div className="col-span-1">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider font-surfer">Redirecciones</h3>
                <div className="mt-4 space-y-3">
                    <a href="/" className="text-2xl text-[#7C86FF] hover:text-[#615FFF] hover:-translate-y-1 transition-transform duration-300 block font-winkySans">Incio</a>
                    <a href="/shop" className="text-2xl text-[#7C86FF] hover:text-[#615FFF] hover:-translate-y-1 transition-transform duration-300 block font-winkySans">Productos</a>
                    <a href="/wishlist" className="text-2xl text-[#7C86FF] hover:text-[#615FFF] hover:-translate-y-1 transition-transform duration-300 block font-winkySans">Lista de deseos</a>
                    <a href="/cart" className="text-2xl text-[#7C86FF] hover:text-[#615FFF] hover:-translate-y-1 transition-transform duration-300 block font-winkySans">Carrito</a>
                    <a href="/about" className="text-2xl text-[#7C86FF] hover:text-[#615FFF] hover:-translate-y-1 transition-transform duration-300 block font-winkySans">Sobre Nosotros</a>
                    <a href="/contact" className="text-2xl text-[#7C86FF] hover:text-[#615FFF] hover:-translate-y-1 transition-transform duration-300 block font-winkySans">Contáctanos</a>
                </div>
            </div>

            <div className="col-span-1">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider font-surfer">Tu cuenta</h3>
                <div className="mt-4 space-y-3">
                    <a href="product" className="text-2xl text-[#7C86FF] hover:text-[#615FFF] hover:-translate-y-1 transition-transform duration-300 block font-winkySans">Inicia Sesión</a>
                    <a href="register" className="text-2xl text-[#7C86FF] hover:text-[#615FFF] hover:-translate-y-1 transition-transform duration-300 block font-winkySans">Registrate</a>
                    <a href="account" className="text-2xl text-[#7C86FF] hover:text-[#615FFF] hover:-translate-y-1 transition-transform duration-300 block font-winkySans">Cuenta</a>
                </div>
            </div>

            <div className="col-span-1">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider font-surfer">Información</h3>
                <div className="mt-4 space-y-3">
                    <a className="text-2xl text-[#615FFF] block font-winkySans">Dirección: Campestre D mz 12 Casa 24</a>
                    <a className="text-2xl text-[#615FFF] block font-winkySans">Horarios: Lunes a Domingo de 9 am a 7 pm</a>
                </div>
            </div>

        </div>
        
        <div className="w-full pt-4 border-t border-gray-200">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d295.49213626279305!2d-75.68478017567728!3d4.829601343349051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1ses-419!2sco!4v1762900268126!5m2!1ses-419!2sco"
                width="100%"
                height="200" 
                style={{ border: 0, borderRadius: '6px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
            </iframe>
        </div>

    </div>
</footer>
            {/* ./footer */}

            {/* copyright */}
            <div className="bg-gray-800 py-4">
                <div className="container flex items-center justify-between">
                    <p className="text-white">&copy; TailCommerce - All Right Reserved</p>
                    <div>
                        <img src="/assets/images/methods.png" alt="methods" className="h-5" />
                    </div>
                </div>
            </div>
            {/* ./copyright */}
        </>
    );
};

export default Footer;
