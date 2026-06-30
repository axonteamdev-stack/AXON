import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stethoscope, ClipboardList, Home, TestTube, Calendar, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';

const Services = () => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';

    const services = [
        {
            id: 1,
            title: t('services.clinic'),
            image: '/assets/service-clinic.jpg',
            icon: <Calendar size={20} className="text-primary" />
        },
        {
            id: 2,
            title: t('services.medical'),
            image: '/assets/service-medical.jpg',
            icon: <Stethoscope size={20} className="text-primary" />
        },
        {
            id: 3,
            title: t('services.home'),
            image: '/assets/service-home.jpg',
            icon: <Home size={20} className="text-primary" />
        },
        {
            id: 4,
            title: t('services.lab'),
            image: '/assets/service-lab.jpg',
            icon: <FlaskConical size={20} className="text-primary" />
        }
    ];

    return (
        <section id="services" className="py-20 transition-colors duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-lg md:text-xl font-medium text-slate-600"
                    >
                        {t('services.subtitle')}
                    </motion.h2>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative aspect-3/2 rounded-[2.5rem] overflow-hidden bg-white border border-black/5 shadow-xl cursor-pointer"
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Bottom Label Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-white via-white/80 to-transparent flex items-end p-6">
                                <div className="flex items-center gap-3">
                                    <div className="text-primary shrink-0 transition-transform duration-300 group-hover:scale-110">
                                        {React.cloneElement(service.icon, { size: 24 })}
                                    </div>
                                    <h3 className="font-bold text-secondary text-base lg:text-lg whitespace-nowrap">
                                        {service.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
