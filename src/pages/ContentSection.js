import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ContentSection = () => {
    const [ref1, inView1] = useInView({
        triggerOnce: true,
        threshold: 0.2
    });

    const [ref2, inView2] = useInView({
        triggerOnce: true,
        threshold: 0.2
    });

    const [ref3, inView3] = useInView({
        triggerOnce: true,
        threshold: 0.2
    });

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0 }
    };

    const fadeInLeft = {
        hidden: { opacity: 0, x: -60 },
        visible: { opacity: 1, x: 0 }
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div id="content" className="container mx-auto mt-10 space-y-20 px-6 text-white rounded-lg py-8">
            {/* Bloque 1 */}
            <motion.div 
                ref={ref1}
                className="flex flex-col md:flex-row items-start md:space-x-8"
                initial="hidden"
                animate={inView1 ? "visible" : "hidden"}
                variants={{
                    visible: { transition: { staggerChildren: 0.3 } }
                }}
            >
                <motion.div 
                    className="md:w-1/2 p-4"
                    variants={fadeInLeft}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold mb-4 title-gradient">
                        Transforma tus Negocios con Ferias Comerciales Virtuales
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                        Navi Fairs revoluciona la forma de hacer negocios globalmente a través de ferias comerciales virtuales personalizadas. Nuestra plataforma conecta empresas de cualquier sector con clientes y socios estratégicos en un entorno interactivo e inmersivo. Gracias a herramientas de traducción en tiempo real y algoritmos de calificación de leads impulsados por inteligencia artificial, ayudamos a las empresas a maximizar sus oportunidades de negocio. Si buscas aumentar tu alcance global y reducir costos logísticos, Navi Fairs es la solución ideal para conectar mercados sin fronteras.
                    </p>
                </motion.div>
                <motion.div 
                    className="md:w-1/2 perspective-container"
                    variants={fadeInRight}
                    transition={{ duration: 0.6 }}
                >
                    <img
                        src="/multimedia/images/foto2.png"
                        alt="Conexiones comerciales"
                        className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video image-hover"
                    />
                </motion.div>
            </motion.div>

            {/* Bloque 2 */}
            <motion.div 
                ref={ref2}
                className="flex flex-col md:flex-row items-start md:flex-row-reverse md:space-x-reverse md:space-x-8"
                initial="hidden"
                animate={inView2 ? "visible" : "hidden"}
                variants={{
                    visible: { transition: { staggerChildren: 0.3 } }
                }}
            >
                <motion.div 
                    className="md:w-1/2 p-4"
                    variants={fadeInRight}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold mb-4 title-gradient">
                        Conecta con el Mundo: Ferias Virtuales 24/7
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                        En Navi Fairs creamos ferias comerciales virtuales accesibles desde cualquier parte del mundo, diseñadas para potenciar conexiones globales y generar leads cualificados. Nuestra tecnología avanzada permite a las empresas montar stands virtuales personalizados, interactuar con visitantes mediante avatares y recopilar datos en tiempo real. Con un entorno disponible los 365 días del año, ofrecemos una experiencia innovadora que combina sostenibilidad, accesibilidad y efectividad para empresas que buscan expandir su mercado internacionalmente.
                    </p>
                </motion.div>
                <motion.div 
                    className="md:w-1/2 perspective-container"
                    variants={fadeInLeft}
                    transition={{ duration: 0.6 }}
                >
                    <img
                        src="/multimedia/images/foto1.png"
                        alt="Expansión comercial"
                        className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video image-hover middle"
                    />
                </motion.div>
            </motion.div>

            {/* Bloque 3 */}
            <motion.div 
                ref={ref3}
                className="flex flex-col md:flex-row items-start md:space-x-8"
                initial="hidden"
                animate={inView3 ? "visible" : "hidden"}
                variants={{
                    visible: { transition: { staggerChildren: 0.3 } }
                }}
            >
                <motion.div 
                    className="md:w-1/2 p-4"
                    variants={fadeInUp}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold mb-4 title-gradient">
                        Ferias Virtuales Inteligentes para Impulsar tu Empresa
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                        Navi Fairs es tu socio estratégico en el mundo de las ferias virtuales, ayudando a las empresas a crecer y conectar sin límites geográficos ni de idioma. Nuestro algoritmo de matching inteligente asegura conexiones relevantes con clientes y socios comerciales, mientras nuestros entornos 3D replican la experiencia de una feria física con zonas de networking, auditorios y stands interactivos. Con costos reducidos y mayor alcance, Navi Fairs es la herramienta perfecta para llevar tu negocio al siguiente nivel.
                    </p>
                </motion.div>
                <motion.div 
                    className="md:w-1/2 perspective-container"
                    variants={fadeInUp}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <img
                        src="/multimedia/images/foto3.png"
                        alt="Por qué elegir"
                        className="rounded-lg shadow-xl w-full h-auto object-cover aspect-video image-hover"
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}

export default ContentSection;