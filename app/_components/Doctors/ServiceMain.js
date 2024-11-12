'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from "next/image";
import Modal from '../DoctorsModal/ServiceAddModal'; // Импорт компонента Modal
import plus_green from "@/public/svg/plus-green.svg";
import pen from "@/public/svg/pen.svg";
import close from "@/public/svg/close-modal.svg";

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
        nameRu: 'Название услуги (RU)',
        nameUz: 'Название услуги (UZ)',
        priceRu: 'Цена (RU)',
        priceUz: 'Цена (UZ)',
        submit: 'Отправить',
        cancel: 'Отмена',
        loading: 'Загрузка...',
        errorCreate: 'Ошибка при создании услуги.',
        successCreate: 'Услуга успешно создана.',
        specificError: 'Ошибка: ',
    },
    uz: {
        addService: 'Добавить услугу',
        edit: 'Редakt qilish',
        delete: 'O\'chirish',
        noServices: 'Hech qanday xizmat mavjud emas',
        active: 'Faol',
        inactive: 'Faol emas',
        servicesTitle: 'Doktor xizmatlari',
        addServiceAlt: 'Xizmat qo\'shish',
        editAlt: 'Tahrirlash',
        deleteAlt: 'O\'chirish',
        nameRu: 'Xizmat nomi (RU)',
        nameUz: 'Xizmat nomi (UZ)',
        priceRu: 'Narxi (RU)',
        priceUz: 'Narxi (UZ)',
        submit: 'Jo\'natish',
        cancel: 'Bekor qilish',
        loading: 'Yuklanmoqda...',
        errorCreate: 'Xizmatni yaratishda xato yuz berdi.',
        successCreate: 'Xizmat muvaffaqiyatli yaratildi.',
        specificError: 'Xato: ',
    },
};

export default function ServiceMain({ services, locale, onEdit, onDelete, doctorId, refreshDoctor }) {
    const t = translations[locale];
    const [itemsLimit, setItemsLimit] = useState(12);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: { ru: '', uz: '' },
        price: { ru: '', uz: '' },
    });
    const [loading, setLoading] = useState(false);
    const [createError, setCreateError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const handleResize = () => {
            setItemsLimit(window.innerWidth >= 460 ? 12 : 4);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleChange = (e, field, lang) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setCreateError('');
        setSuccessMessage('');

        try {
            const response = await axios.post(`https://pmc.result-me.uz/v1/doctor/service/create/${doctorId}`, {
                name: formData.name,
                price: formData.price,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': locale,
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
            });

            if (response.data && response.data.success) {
                setSuccessMessage(t.successCreate);
                setFormData({ name: { ru: '', uz: '' }, price: { ru: '', uz: '' } });
                refreshDoctor(); // Обновляем данные доктора после успешного создания услуги
                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuccessMessage('');
                }, 2000);
            } else {
                setCreateError(response.data.message || t.errorCreate);
            }
        } catch (error) {
            setCreateError(error.response?.data?.message ? `${t.specificError} ${error.response.data.message}` : t.errorCreate);
        } finally {
            setLoading(false);
            refreshDoctor(); // Делаем рефреш даже при ошибке для обновления данных
        }
    };

    return (
        <div className="w-full bg-white h-full flex flex-col justify-between px-[16px] max-w-[1440px] mx-auto my-[90px] mdx:my-[120px] xl:my-[140px]">
            <h2 className="font-semibold text-[30px] mdx:text-[35px] mdl:text-[40px] xl:text-[45px]">
                {t.servicesTitle}
            </h2>
            <div className="grid mdx:gap-x-[16px] gap-y-[12px] mdx:gap-y-[20px] mdx:grid-cols-2 mt-[25px] mdx:mt-[30px] 2xl:grid-cols-4">
                {services && services.length > 0 ? (
                    services.slice(0, itemsLimit).map((service) => (
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

                            <p className="text-[#00863E] text-[18px] mdx:text-[18px] xl:text-[22px] font-bold mt-auto">{service.price}</p>

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
                    ))
                ) : (
                    <p>{t.noServices}</p>
                )}

                <button
                    className='h-[200px] w-auto border-[2px] border-dashed border-[#00863E] hover:border-[#2dbd70] flex flex-col-reverse items-center justify-center text-[22px] font-semibold text-[#00863E] hover:text-[#27a361]'
                    onClick={() => setIsModalOpen(true)}
                >
                    {t.addService}
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t.addService}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                createError={createError}
                successMessage={successMessage}
                loading={loading}
                t={t}
            />
        </div>
    );
}