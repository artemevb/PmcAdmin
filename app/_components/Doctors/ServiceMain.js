// app/_components/Doctors/ServiceMain.jsx

'use client';

import Image from "next/image";
import plus_green from "@/public/svg/plus-green.svg";
import pen from "@/public/svg/pen.svg";
import close from "@/public/svg/close-modal.svg";
import { useEffect, useState } from 'react';

const translations = {
    ru: {
        addService: 'Добавить услугу',
        edit: 'Редактировать',
        delete: 'Удалить',
        noServices: 'Нет услуг',
        active: 'Активна',
        inactive: 'Неактивна',
        servicesTitle: 'Услуги доктора',
        addServiceAlt: 'Добавить услугу',
        editAlt: 'Редактировать',
        deleteAlt: 'Удалить',
    },
    uz: {
        addService: 'Добавить услугу',
        edit: 'Редактировать',
        delete: 'Удалить',
        noServices: 'Нет услуг',
        active: 'Активна',
        inactive: 'Неактивна',
        servicesTitle: 'Услуги доктора',
        addServiceAlt: 'Добавить услугу',
        editAlt: 'Редактировать',
        deleteAlt: 'Удалить',
    },
};

export default function ServiceMain({ services, locale, onEdit, onDelete }) {
    const t = translations[locale];
    const [itemsLimit, setItemsLimit] = useState(12); // Default limit is 12

    // Effect to handle screen size changes
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 460) { // xl screen
                setItemsLimit(12);
            } else { // mobile and smaller screens
                setItemsLimit(4);
            }
        };

        // Set the initial limit based on screen size
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="w-full bg-white h-full flex flex-col justify-between px-[16px] max-w-[1440px] mx-auto my-[90px] mdx:my-[120px] xl:my-[140px]">
            <h2 className="font-semibold text-[30px] mdx:text-[35px] mdl:text-[40px] xl:text-[45px]">
                {t.servicesTitle}
            </h2>
            <div className="grid mdx:gap-x-[16px] gap-y-[12px] mdx:gap-y-[20px] mdx:grid-cols-2 mt-[25px] mdx:mt-[30px] 2xl:grid-cols-4">
                {services && services.slice(0, itemsLimit).map((service) => (
                    <div key={service.id} className="relative border border-[#EEE] p-[20px] flex flex-col justify-between min-h-[150px] mdx:min-h-[180px] 2xl:min-h-[200px]">
                        <button
                            className="absolute top-[10px] right-[10px]"
                            onClick={() => onDelete('service', service.id)}
                        >
                            <Image
                                src={close}
                                width={24}
                                height={24}
                                quality={100}
                                alt={t.deleteAlt}
                                className="w-full h-auto object-cover max-w-[24px]"
                            />
                        </button>

                        <h5 className="text-[18px] mdx:text-[18px] xl:text-[22px] font-semibold mb-auto">{service.name}</h5>

                        <p className="text-[#00863E] text-[18px] mdx:text-[18px] xl:text-[22px] font-bold mt-auto">{service.price} сум</p>

                        <button
                            className="absolute bottom-[10px] right-[10px]"
                            onClick={() => onEdit('service', service.id)}
                        >
                            <Image
                                src={pen}
                                width={24}
                                height={24}
                                quality={100}
                                alt={t.editAlt}
                                className="w-full h-auto object-cover max-w-[24px]"
                            />
                        </button>
                    </div>
                ))}

                {/* Кнопка Добавления Услуги */}
                <button
                    className='h-[200px] w-auto border-[2px] border-dashed border-[#00863E] hover:border-[#2dbd70] flex flex-col-reverse items-center justify-center text-[22px] font-semibold text-[#00863E] hover:text-[#27a361]'
                    onClick={() => {
                        // Логика добавления новой услуги
                        onEdit('service');
                    }}
                >
                    Добавить услугу
                    <Image
                        src={plus_green}
                        width={28}
                        height={28}
                        quality={100}
                        alt={t.addServiceAlt}
                        className="w-full h-auto object-cover max-w-[28px]"
                    />
                </button>
            </div>

        </div>
    );
}
