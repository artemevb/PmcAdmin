'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import closeIcon from '@/public/svg/close.svg'; // Icon for closing the modal
import close from '@/public/svg/close-black-bold.svg'; // Icon for deleting the photo
import close_green from '@/public/svg/close_green.svg'; // Icon for removing a specialization
import plus_white from '@/public/svg/plus-white.svg'; // Icon for adding a specialization

export default function EditDoctorModal({ isOpen, onClose, onSave, locale, doctorId }) {
    const [formData, setFormData] = useState({
        id: '',
        active: true,
        fullName: { ru: '', uz: '' },
        description: { ru: '', uz: '' },
        experience: { ru: '', uz: '' },
        receptionTime: { ru: '', uz: '' },
        specializationList: [],
        photo: null,
        photoId: null,
    });
    const [photoPreview, setPhotoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (doctorId) {
            fetchDoctorData();
        }
    }, [doctorId]);

    const fetchDoctorData = async () => {
        try {
            const response = await axios.get(
                `https://api.pmc.dr-psixoterapevt.uz/v1/doctor/get-by-id/${doctorId}`,
                {
                    headers: {
                        'Accept-Language': '-',
                    },
                }
            );
            const doctorData = response.data.data;
            setFormData({
                id: doctorData.id || '',
                active: doctorData.active || true,
                fullName: doctorData.fullName || { ru: '', uz: '' },
                description: doctorData.description || { ru: '', uz: '' },
                experience: doctorData.experience || { ru: '', uz: '' },
                receptionTime: doctorData.receptionTime || { ru: '', uz: '' },
                specializationList:
                    doctorData.specializationList.map((spec) => ({
                        id: spec.id || '',
                        name: spec.name || { ru: '', uz: '' },
                    })) || [],
                photo: doctorData.photo || null,
                photoId: doctorData.photo?.id || null,
            });
            setPhotoPreview(doctorData.photo?.url || null);
        } catch (error) {
            console.error('Ошибка при получении данных врача:', error.response?.data || error.message);
            setError('Ошибка при получении данных врача.');
        }
    };

    if (!isOpen) return null;

    const handleChange = (e, index = null, field = null) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setFormData((prev) => ({
                ...prev,
                photo: file,
            }));
            setPhotoPreview(URL.createObjectURL(file));
        } else if (index !== null && field) {
            const updatedSpecializations = [...formData.specializationList];
            updatedSpecializations[index].name[field] = value;
            setFormData((prev) => ({
                ...prev,
                specializationList: updatedSpecializations,
            }));
        } else if (name.includes('.')) {
            const [key, subKey] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    [subKey]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const addSpecialization = () => {
        setFormData((prev) => ({
            ...prev,
            specializationList: [
                ...prev.specializationList,
                { id: '', name: { ru: '', uz: '' } },
            ],
        }));
    };

    const removeSpecialization = async (index) => {
        const specializationId = formData.specializationList[index].id;

        if (specializationId) {
            try {
                await axios.delete(`https://api.pmc.dr-psixoterapevt.uz/v1/doctor/specialization/delete/${specializationId}`);
                setFormData((prev) => ({
                    ...prev,
                    specializationList: prev.specializationList.filter((_, i) => i !== index),
                }));
            } catch (error) {
                console.error('Ошибка при удалении специализации:', error.response?.data || error.message);
                setError('Ошибка при удалении специализации.');
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                specializationList: prev.specializationList.filter((_, i) => i !== index),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const existingPhotoId = formData.photoId;

            if (formData.photo instanceof File) {
                if (existingPhotoId) {
                    const updatePhotoFormData = new FormData();
                    updatePhotoFormData.append('photo', formData.photo);

                    const photoResponse = await axios.put(
                        `https://api.pmc.dr-psixoterapevt.uz/v1/photo/update/${existingPhotoId}`,
                        updatePhotoFormData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    const updatedPhotoData = photoResponse.data.data;
                } else {
                    const photoFormData = new FormData();
                    photoFormData.append('photo', formData.photo);

                    const photoResponse = await axios.post(
                        'https://api.pmc.dr-psixoterapevt.uz/v1/photo/update',
                        photoFormData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    const newPhotoData = photoResponse.data.data;
                    setFormData((prev) => ({
                        ...prev,
                        photoId: newPhotoData.id,
                    }));
                }
            } else if (formData.photo === null && existingPhotoId) {
                const removePhotoData = { url: null };

                await axios.put(
                    `https://api.pmc.dr-psixoterapevt.uz/v1/photo/update/${existingPhotoId}`,
                    removePhotoData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
            }

            const jsonData = {
                id: formData.id,
                fullName: formData.fullName,
                description: formData.description,
                experience: formData.experience,
                receptionTime: formData.receptionTime,
                active: formData.active,
                specializationList: formData.specializationList.map((spec) => ({
                    id: spec.id || undefined,
                    name: spec.name,
                })),
            };

            const response = await axios.put(
                'https://api.pmc.dr-psixoterapevt.uz/v1/doctor/update',
                jsonData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            onSave(response.data.data);
            onClose();
        } catch (err) {
            setError('Ошибка при обновлении врача.');
            console.error('Ошибка при запросе:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 w-full max-w-6xl relative overflow-y-auto h-5/6 scrollbar-hide">
                <button onClick={onClose} className="absolute top-4 right-4">
                    <Image src={closeIcon} width={40} height={40} alt="Закрыть" />
                </button>
                <h2 className="text-2xl mb-4 border-b pb-8 font-bold">Редактировать О враче</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-lg mb-2 text-gray-500">Специализации</h3>
                        <div className="flex flex-wrap gap-2 border rounded-lg p-4 text-green-700 text-base">
                            {formData.specializationList.map((specialization, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div className="relative flex items-center bg-green-100 focus-within:border focus-within:border-green-700 p-2 rounded-md w-full">
                                        <input
                                            type="text"
                                            placeholder="Специализация (RU)"
                                            value={specialization.name.ru}
                                            onChange={(e) => handleChange(e, index, 'ru')}
                                            className="bg-transparent border-none outline-none w-full pr-8"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSpecialization(index)}
                                            className="absolute right-0 mr-2 text-green-700"
                                        >
                                            <Image src={close_green} width={20} height={20} alt="Удалить" />
                                        </button>
                                    </div>
                                    <div className="relative flex items-center bg-green-100 focus-within:border focus-within:border-green-700 p-2 rounded-md w-full">
                                        <input
                                            type="text"
                                            placeholder="Специализация (UZ)"
                                            value={specialization.name.uz}
                                            onChange={(e) => handleChange(e, index, 'uz')}
                                            className="bg-transparent border-none outline-none w-full pr-8"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSpecialization(index)}
                                            className="absolute right-0 mr-2 text-green-700"
                                        >
                                            <Image src={close_green} width={20} height={20} alt="Удалить" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addSpecialization}
                                className="bg-green-700 text-white px-2 py-1 rounded hover:bg-green-800 w-9"
                            >
                                <Image src={plus_white} width={20} height={20} alt="Плюс" />
                            </button>
                        </div>
                    </div>
                    <label className="text-gray-500">
                        {'ФИО врача (RU)'}
                        <input
                            type="text"
                            name="fullName.ru"
                            value={formData.fullName.ru}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-lg text-black"
                        />
                    </label>
                    <label className="text-gray-500">
                        {'ФИО врача (UZ)'}
                        <input
                            type="text"
                            name="fullName.uz"
                            value={formData.fullName.uz}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-lg text-black"
                        />
                    </label>
                    <label className="text-gray-500">
                        {'Краткая информация о враче (RU)'}
                        <textarea
                            name="description.ru"
                            value={formData.description.ru}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-lg text-black"
                        />
                    </label>
                    <label className="text-gray-500">
                        {'Краткая информация о враче (UZ)'}
                        <textarea
                            name="description.uz"
                            value={formData.description.uz}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-lg text-black"
                        />
                    </label>
                    <label className="text-gray-500">
                        {'Опыт работы (RU)'}
                        <input
                            type="text"
                            name="experience.ru"
                            value={formData.experience.ru}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-lg text-black"
                        />
                    </label>
                    <label className="text-gray-500">
                        {'Опыт работы (UZ)'}
                        <input
                            type="text"
                            name="experience.uz"
                            value={formData.experience.uz}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-lg text-black"
                        />
                    </label>
                    <label className="text-gray-500">
                        {'Время приёма (RU)'}
                        <input
                            type="text"
                            name="receptionTime.ru"
                            value={formData.receptionTime.ru}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-lg text-black"
                        />
                    </label>
                    <label className="text-gray-500">
                        {'Время приёма (UZ)'}
                        <input
                            type="text"
                            name="receptionTime.uz"
                            value={formData.receptionTime.uz}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-lg text-black"
                        />
                    </label>
                    <label className="border flex flex-col gap-5 w-full max-w-2xl p-5 text-lg font-bold rounded-xl">
                        Фото врача
                        {photoPreview ? (
                            <div className="relative w-40 h-40 mb-2">
                                <img
                                    src={photoPreview}
                                    alt="Превью фото"
                                    className="w-full h-full object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData((prev) => ({ ...prev, photo: null }));
                                        setPhotoPreview(null);
                                    }}
                                    className="absolute top-0 right-0 p-1 bg-white rounded-full"
                                >
                                    <Image src={close} width={20} height={20} alt="Удалить фото" />
                                </button>
                            </div>
                        ) : (
                            <input type="file" name="photo" onChange={handleChange} className="w-full" />
                        )}
                    </label>
                    <div className="w-full flex justify-end mt-14">
                        <button
                            type="submit"
                            className="bg-green-700 w-auto text-white py-2 hover:bg-green-800 h-12 px-16"
                            disabled={loading}
                        >
                            {loading ? 'Обновление...' : 'Обновить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
