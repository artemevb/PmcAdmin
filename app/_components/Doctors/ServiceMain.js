'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from "next/image";
import Modal from '../DoctorsModal/ServiceAddModal';
import UpdateModal from '../DoctorsModal/UpdateServiceModal';
import plus_green from "@/public/svg/plus-green.svg";
import pen from "@/public/svg/pen.svg";
import close from "@/public/svg/close-modal.svg";

// Translations for static texts
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
        errorDelete: 'Ошибка при удалении услуги.',
        successDelete: 'Услуга успешно удалена.',
        specificError: 'Ошибка: ',
        updateService: 'Обновить услугу',
        successUpdate: 'Услуга успешно обновлена.',
        errorUpdate: 'Ошибка при обновлении услуги.',
        updating: 'Обновление...',
        update: 'Обновить',
        close: 'Закрыть',
    },
    uz: {
        addService: 'Xizmat qo\'shish',
        edit: 'Tahrirlash',
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
        errorDelete: 'Xizmatni o\'chirishda xato yuz berdi.',
        successDelete: 'Xizmat muvaffaqiyatli o\'chirildi.',
        specificError: 'Xato: ',
        updateService: 'Xizmatni yangilash',
        successUpdate: 'Xizmat muvaffaqiyatli yangilandi.',
        errorUpdate: 'Xizmatni yangilashda xato yuz berdi.',
        updating: 'Yangilanmoqda...',
        update: 'Yangilash',
        close: 'Yopish',
    },
};

// Helper function to get localized field
const getLocalizedField = (field, locale) => {
    if (typeof field === 'object' && field !== null) {
        return field[locale] || field['ru'] || '';
    }
    return field;
};

export default function ServiceMain({ locale, doctorId, refreshDoctor }) {
    const t = translations[locale];
    const [itemsLimit, setItemsLimit] = useState(12);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState({
        name: { ru: '', uz: '' },
        price: { ru: '', uz: '' },
    });
    const [loading, setLoading] = useState(false);
    const [createError, setCreateError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const [servicesData, setServicesData] = useState([]);

    // Fetch services data from API
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`https://pmc.result-me.uz/v1/doctor/service/get-all/${doctorId}`, {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Accept-Language': locale,
                    }
                });

                console.log('Fetched services data:', response.data);
                if (response.data && response.data.data) {
                    setServicesData(response.data.data);
                } else {
                    console.error('Invalid response data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, [doctorId, token, locale]);

    // Log the received services data
    useEffect(() => {
        console.log('ServiceMain fetched servicesData:', servicesData);
    }, [servicesData]);

    // Adjust itemsLimit based on window size
    useEffect(() => {
        const handleResize = () => {
            const newLimit = window.innerWidth >= 460 ? 12 : 4;
            setItemsLimit(newLimit);
            console.log('Items limit set to:', newLimit);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle form input changes for adding services
    const handleChange = (e, field, lang) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
    };

    // Handle submission for adding a new service
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setCreateError('');
        setSuccessMessage('');

        console.log('Submitting new service with formData:', formData);

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

            console.log('Add service response:', response.data);

            if (response.data && response.data.success) {
                setSuccessMessage(t.successCreate);
                setFormData({ name: { ru: '', uz: '' }, price: { ru: '', uz: '' } });
                // Fetch services data again
                const updatedServices = await axios.get(`https://pmc.result-me.uz/v1/doctor/service/get-all/${doctorId}`, {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Accept-Language': locale,
                    }
                });
                setServicesData(updatedServices.data.data);

                setTimeout(() => {
                    setIsModalOpen(false);
                    setSuccessMessage('');
                }, 2000);
            } else {
                setCreateError(response.data.message || t.errorCreate);
                console.log('Create service error:', response.data.message || t.errorCreate);
            }
        } catch (error) {
            setCreateError(error.response?.data?.message ? `${t.specificError} ${error.response.data.message}` : t.errorCreate);
            console.error('Error creating service:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle deletion of a service
    const handleDelete = async (serviceId) => {
        setDeleteError('');
        console.log('Attempting to delete service with ID:', serviceId);
        try {
            const response = await axios.delete(`https://pmc.result-me.uz/v1/doctor/service/delete/${serviceId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Delete service response:', response);

            if (response.status === 200) {
                alert(t.successDelete);
                // Fetch services data again
                const updatedServices = await axios.get(`https://pmc.result-me.uz/v1/doctor/service/get-all/${doctorId}`, {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'Accept-Language': locale,
                    }
                });
                setServicesData(updatedServices.data.data);
            } else {
                setDeleteError(t.errorDelete);
                console.log('Delete service failed with status:', response.status);
            }
        } catch (error) {
            setDeleteError(error.response?.data?.message ? `${t.specificError} ${error.response.data.message}` : t.errorDelete);
            console.error('Error deleting service:', error);
        }
    };

    // Handle editing of a service
    const handleEdit = (type, service) => {
        if (type === 'service') {
            console.log('Editing service:', service);
            setSelectedService(service);
            setIsUpdateModalOpen(true);
        }
    };

    // Log when selectedService changes
    useEffect(() => {
        if (selectedService) {
            console.log('Selected service for update:', selectedService);
        }
    }, [selectedService]);

    // Function to refresh services data after update
    const refreshServicesData = async () => {
        try {
            const updatedServices = await axios.get(`https://pmc.result-me.uz/v1/doctor/service/get-all/${doctorId}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Accept-Language': locale,
                }
            });
            setServicesData(updatedServices.data.data);
        } catch (error) {
            console.error('Error refreshing services data:', error);
        }
    };

    return (
        <div className="w-full bg-white h-full flex flex-col justify-between px-[16px] max-w-[1440px] mx-auto my-[90px] mdx:my-[120px] xl:my-[140px]">
            <h2 className="font-semibold text-[30px] mdx:text-[35px] mdl:text-[40px] xl:text-[45px]">
                {t.servicesTitle}
            </h2>
            <div className="grid mdx:gap-x-[16px] gap-y-[12px] mdx:gap-y-[20px] mdx:grid-cols-2 mt-[25px] mdx:mt-[30px] 2xl:grid-cols-4">
                {servicesData && servicesData.length > 0 ? (
                    servicesData.slice(0, itemsLimit).map((service) => (
                        <div key={service.id} className="relative border border-[#EEE] p-[20px] flex flex-col justify-between min-h-[150px] mdx:min-h-[180px] 2xl:min-h-[200px]">
                            <button
                                className="absolute top-[10px] right-[10px]"
                                onClick={() => handleDelete(service.id)}
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

                            {/* Use helper to get localized name and price */}
                            <h5 className="text-[18px] mdx:text-[18px] xl:text-[22px] font-semibold mb-auto">
                                {getLocalizedField(service.name, locale)}
                            </h5>

                            <p className="text-[#00863E] text-[18px] mdx:text-[18px] xl:text-[22px] font-bold mt-auto">
                                {getLocalizedField(service.price, locale)}
                            </p>

                            <button
                                className="absolute bottom-[10px] right-[10px]"
                                onClick={() => handleEdit('service', service)}
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
                    onClick={() => {
                        console.log('Opening Add Service Modal');
                        setIsModalOpen(true);
                    }}
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

            {deleteError && <p className="text-red-500 text-sm mt-4">{deleteError}</p>}

            {/* Add Service Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    console.log('Closing Add Service Modal');
                    setIsModalOpen(false);
                }}
                title={t.addService}
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                createError={createError}
                successMessage={successMessage}
                loading={loading}
                t={t}
            />

            {/* Update Service Modal */}
            <UpdateModal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    console.log('Closing Update Service Modal');
                    setIsUpdateModalOpen(false);
                    setSelectedService(null);
                }}
                service={selectedService}
                onUpdate={() => {
                    console.log('Updating services data after service update');
                    refreshServicesData();
                }}
                locale={locale}
                t={t}
            />
        </div>
    )
}
