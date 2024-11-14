'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from "next/image";
import closeIcon from '@/public/svg/close-black-bold.svg';

export default function UpdateServiceModal({ isOpen, onClose, service, onUpdate, locale, t }) {
    const [formData, setFormData] = useState({
        name: { ru: '', uz: '' },
        price: { ru: '', uz: '' },
        active: true,
    });
    const [loading, setLoading] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;


    useEffect(() => {
        if (isOpen && service) {
            setFormData({
                name: {
                    ru: service.name.ru || '',
                    uz: service.name.uz || '',
                },
                price: {
                    ru: service.price.ru || '',
                    uz: service.price.uz || '',
                },
                active: service.active !== undefined ? service.active : true,
            });
            console.log('Service data loaded into UpdateServiceModal:', service);
        }
    }, [isOpen, service]);
    
    // Handle form input changes
    const handleChange = (e, field, lang) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
    };

    // Handle form submission for updating the service
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setUpdateError('Перезагрузите страницу, чтобы увидеть изменения');
        setSuccessMessage('Перезагрузите страницу, чтобы увидеть изменения');

        console.log('Submitting updated service with formData:', formData);

        try {
            const response = await axios.put('https://pmc.result-me.uz/v1/doctor/service/update', {
                id: service.id,
                name: formData.name,
                price: formData.price,
                active: formData.active,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                    'Accept-Language': locale,
                },
            });

            console.log('Update service response:', response.data);

            if (response.data && response.data.success) {
                setSuccessMessage(t.successUpdate);
                
                // **Invoke onUpdate to refresh services and doctor data**
                if (typeof onUpdate === 'function') {
                    await onUpdate();
                }

                // Close the modal
                onClose();

                // No need to reload the page; data should be updated via onUpdate

            } else {
                setUpdateError(response.data.message || t.errorUpdate);
                console.log('Update service error:', response.data.message || t.errorUpdate);
            }
        } catch (error) {
            setUpdateError(error.response?.data?.message ? `${t.specificError} ${error.response.data.message}` : t.errorUpdate);
            console.error('Error updating service:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        isOpen && service ? (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 w-full max-w-[1235px] relative">
                    <button onClick={() => {
                        console.log('Closing Update Service Modal');
                        onClose();
                    }} className="absolute top-7 right-6">
                        <Image src={closeIcon} width={40} height={40} alt={t.close} />
                    </button>
                    <h2 className="text-[30px] mb-[40px] font-bold border-b pb-[30px]">{t.updateService}</h2>
                    {/* {updateError && <p className="text-red-500 mb-4">{updateError}</p>} */}
                    {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="text-[#A6A6A6]">
                            {t.nameRu}
                            <input
                                type="text"
                                value={formData.name.ru}
                                onChange={(e) => handleChange(e, 'name', 'ru')}
                                required
                                className="w-full border p-3 rounded-[10px] text-black mt-1"
                            />
                        </label>
                        <label className="text-[#A6A6A6]">
                            {t.nameUz}
                            <input
                                type="text"
                                value={formData.name.uz}
                                onChange={(e) => handleChange(e, 'name', 'uz')}
                                required
                                className="w-full border p-3 rounded-[10px] text-black mt-1"
                            />
                        </label>
                        <label className="text-[#A6A6A6]">
                            {t.priceRu}
                            <input
                                type="text"
                                value={formData.price.ru}
                                onChange={(e) => handleChange(e, 'price', 'ru')}
                                required
                                className="w-full border p-3 rounded-[10px] text-black mt-1"
                            />
                        </label>
                        <label className="text-[#A6A6A6]">
                            {t.priceUz}
                            <input
                                type="text"
                                value={formData.price.uz}
                                onChange={(e) => handleChange(e, 'price', 'uz')}
                                required
                                className="w-full border p-3 rounded-[10px] text-black mt-1"
                            />
                        </label>
                        {/* <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.active}
                                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                className="mr-2"
                            />
                            {t.active}
                        </label> */}
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="bg-green-700 text-white py-4 px-[65px] hover:bg-green-800"
                                disabled={loading}
                            >
                                {loading ? t.updating : t.update}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        ) : null
    );
}
