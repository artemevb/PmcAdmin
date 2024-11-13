'use client'

import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import closeIcon from '@/public/svg/close.svg' // Основная кнопка закрытия модалки
import close from "@/public/svg/close-black-bold.svg"; // Иконка закрытия на фото
import close_green from "@/public/svg/close_green.svg";
import plus_white from "@/public/svg/plus-white.svg";

export default function CreateDoctorModal({ isOpen, onClose, onSave, locale }) {
    const [formData, setFormData] = useState({
        slug: '',
        fullName: { ru: '', uz: '' },
        description: { ru: '', uz: '' },
        experience: { ru: '', uz: '' },
        receptionTime: { ru: '', uz: '' },
        specializationList: [{ name: { ru: '', uz: '' } }],
        photo: null, // Файл изображения
    })
    const [photoPreview, setPhotoPreview] = useState(null) // Превью фото
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    if (!isOpen) return null

    const handleChange = (e, index = null, field = null) => {
        const { name, value, files } = e.target
        if (files) {
            const file = files[0]
            setFormData(prev => ({
                ...prev,
                photo: file // Обработка файла
            }))
            setPhotoPreview(URL.createObjectURL(file)) // Создание превью
        } else if (index !== null && field) {
            // Обновление специализаций
            const updatedSpecializations = [...formData.specializationList]
            updatedSpecializations[index].name[field] = value
            setFormData(prev => ({
                ...prev,
                specializationList: updatedSpecializations
            }))
        } else if (name.includes('.')) {
            const [key, lang] = name.split('.')
            setFormData(prev => ({
                ...prev,
                [key]: { ...prev[key], [lang]: value }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const addSpecialization = () => {
        setFormData(prev => ({
            ...prev,
            specializationList: [...prev.specializationList, { name: { ru: '', uz: '' } }]
        }))
    }

    const removeSpecialization = (index) => {
        setFormData(prev => ({
            ...prev,
            specializationList: prev.specializationList.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const jsonData = {
                fullName: {
                    uz: formData.fullName.uz,
                    ru: formData.fullName.ru
                },
                description: {
                    uz: formData.description.uz,
                    ru: formData.description.ru
                },
                experience: {
                    uz: formData.experience.uz,
                    ru: formData.experience.ru
                },
                receptionTime: {
                    uz: formData.receptionTime.uz,
                    ru: formData.receptionTime.ru
                },
                specializationList: formData.specializationList
            }

            const data = new FormData()
            data.append('json', JSON.stringify(jsonData)) // Добавляем JSON как строку
            if (formData.photo) {
                data.append('photo', formData.photo)
            }

            // Логируем содержимое FormData
            for (const [key, value] of data.entries()) {
                console.log(`${key}:`, value)
            }

            const response = await axios.post('https://pmc.result-me.uz/v1/doctor/create', data, {
                headers: {
                    'Accept-Language': locale,
                    'Content-Type': 'multipart/form-data'
                }
            })
            onSave(response.data.data)
        } catch (err) {
            setError('Ошибка при создании врача.')
            console.error('Ошибка при запросе:', err.response?.data || err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 w-full max-w-[1236px] relative overflow-y-auto h-[90%] scrollbar-hide">
                <button onClick={onClose} className="absolute top-4 right-4">
                    <Image src={closeIcon} width={40} height={40} alt="Закрыть" />
                </button>
                <h2 className="text-[30px] mb-4 border-b pb-[30px] font-bold">{'Добавить врача'}</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <h3 className="text-lg mb-2 text-[#A6A6A6]">{'Специализации'}</h3>
                        <div className="flex flex-wrap gap-2 border rounded-[10px] p-[15px] text-[#00863E] text-[16px]">
                            {formData.specializationList.map((specialization, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div className="flex items-center bg-green-100 focus-within:border focus-within:border-[#00863E] p-2 rounded-[5px]">
                                        <input
                                            type="text"
                                            placeholder={'Специализация (RU)'}
                                            value={specialization.name.ru}
                                            onChange={(e) => handleChange(e, index, 'ru')}
                                            className="bg-transparent border-none outline-none w-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSpecialization(index)}
                                            className="ml-2 text-[#00863E]"
                                        >
                                            <Image src={close_green} width={20} height={20} alt="Удалить фото" />
                                        </button>
                                    </div>
                                    <div className="flex items-center bg-green-100 focus-within:border focus-within:border-[#00863E] p-2 rounded">
                                        <input
                                            type="text"
                                            placeholder={'Специализация (UZ)'}
                                            value={specialization.name.uz}
                                            onChange={(e) => handleChange(e, index, 'uz')}
                                            className="bg-transparent border-none outline-none w-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSpecialization(index)}
                                            className="ml-2 text-[#00863E]"
                                        >
                                            <Image src={close_green} width={20} height={20} alt="Удалить фото" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addSpecialization}
                                className="bg-[#00863E] text-white px-2 py-1 rounded hover:bg-green-600 w-[36px]"
                            >
                                <Image src={plus_white} width={20} height={20} alt="Плюс" />
                            </button>
                        </div>
                    </div>
                    <label className='text-[#A6A6A6] '>
                        {'ФИО врача (RU)'}
                        <input
                            type="text"
                            name="fullName.ru"
                            value={formData.fullName.ru}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-[10px] text-[#010101]"
                        />
                    </label>
                    <label className='text-[#A6A6A6]'>
                        {'ФИО врача (UZ)'}
                        <input
                            type="text"
                            name="fullName.uz"
                            value={formData.fullName.uz}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-[10px] text-[#010101]"
                        />
                    </label>
                    <label className='text-[#A6A6A6]'>
                        {'Краткая информация о враче (RU)'}
                        <textarea
                            name="description.ru"
                            value={formData.description.ru}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-[10px] text-[#010101]"
                        />
                    </label>
                    <label className='text-[#A6A6A6]'>
                        {'Краткая информация о враче (UZ)'}
                        <textarea
                            name="description.uz"
                            value={formData.description.uz}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-[10px] text-[#010101]"
                        />
                    </label>
                    <label className='text-[#A6A6A6]'>
                        {'Опыт работы (RU)'}
                        <textarea
                            name="experience.ru"
                            value={formData.experience.ru}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-[10px] text-[#010101]"
                        />
                    </label>
                    <label className='text-[#A6A6A6]'>
                        {'Опыт работы (UZ)'}
                        <textarea
                            name="experience.uz"
                            value={formData.experience.uz}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-[10px] text-[#010101]"
                        />
                    </label>
                    <label className='text-[#A6A6A6]'>
                        {'График приема (RU)'}
                        <input
                            type="text"
                            name="receptionTime.ru"
                            value={formData.receptionTime.ru}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-[10px] text-[#010101]"
                        />
                    </label>
                    <label className='text-[#A6A6A6]'>
                        {'График приема (UZ)'}
                        <input
                            type="text"
                            name="receptionTime.uz"
                            value={formData.receptionTime.uz}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded-[10px] text-[#010101]"
                        />
                    </label>

                    <label className='border flex flex-col gap-[20px] w-full max-w-[578px] p-[20px] text-[18px] font-bold rounded-[20px]'>
                        Фото врача
                        {photoPreview ? (
                            <div className="relative w-40 h-40 mb-2 ">
                                <img
                                    src={photoPreview}
                                    alt="Превью фото"
                                    className="w-full h-full object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, photo: null }))
                                        setPhotoPreview(null)
                                    }}
                                    className="absolute top-0 right-0 p-1 bg-white rounded-full"
                                >
                                    <Image src={close} width={20} height={20} alt="Удалить поле" />
                                </button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                name="photo"
                                onChange={handleChange}
                                required
                                className="w-full"
                            />
                        )}
                    </label>
                    <div className='w-full flex justify-end mt-[60px]'>
                        <button
                            type="submit"
                            className='bg-[#00863E] w-auto text-white py-2 hover:bg-[#27a361] h-[50px] px-[67.5px] '
                            disabled={loading}
                        >
                            {loading ? ('Создание...') : ('Создать')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
