'use client'

import { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import closeIcon from '@/public/svg/close.svg' // Убедитесь, что файл существует

export default function CreateDoctorModal({ isOpen, onClose, onSave, locale }) {
    const [formData, setFormData] = useState({
        slug: '',
        fullName: { ru: '', uz: '' },
        receptionTime: { ru: '', uz: '' },
        specializationList: [], // Возможно, требуется механизм добавления специализаций
        photo: '', // URL изображения
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('fullName.')) {
            const lang = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                fullName: { ...prev.fullName, [lang]: value }
            }))
        } else if (name.startsWith('receptionTime.')) {
            const lang = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                receptionTime: { ...prev.receptionTime, [lang]: value }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const response = await axios.post('https://pmc.result-me.uz/v1/doctor/create', formData, {
                headers: {
                    'Accept-Language': locale
                }
            })
            onSave(response.data.data) // Предполагается, что API возвращает созданного врача
        } catch (err) {
            setError(locale === 'ru' ? 'Ошибка при создании врача.' : 'Shifokor yaratishda xato yuz berdi.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4">
                    <Image src={closeIcon} width={20} height={20} alt="Закрыть" />
                </button>
                <h2 className="text-2xl mb-4">{locale === 'ru' ? 'Добавить врача' : 'Shifokor qo\'shish'}</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label>
                        {locale === 'ru' ? 'Slug' : 'Slug'}
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </label>
                    <label>
                        {locale === 'ru' ? 'Полное имя (RU)' : 'To\'liq ism (RU)'}
                        <input
                            type="text"
                            name="fullName.ru"
                            value={formData.fullName.ru}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </label>
                    <label>
                        {locale === 'ru' ? 'Полное имя (UZ)' : 'To\'liq ism (UZ)'}
                        <input
                            type="text"
                            name="fullName.uz"
                            value={formData.fullName.uz}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </label>
                    <label>
                        {locale === 'ru' ? 'Время приема (RU)' : 'Qabul vaqti (RU)'}
                        <input
                            type="text"
                            name="receptionTime.ru"
                            value={formData.receptionTime.ru}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </label>
                    <label>
                        {locale === 'ru' ? 'Время приема (UZ)' : 'Qabul vaqti (UZ)'}
                        <input
                            type="text"
                            name="receptionTime.uz"
                            value={formData.receptionTime.uz}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </label>
                    {/* Добавьте другие поля по необходимости */}
                    <label>
                        {locale === 'ru' ? 'URL изображения' : 'Rasm URL'}
                        <input
                            type="text"
                            name="photo"
                            value={formData.photo}
                            onChange={handleChange}
                            required
                            className="w-full border p-2 rounded"
                        />
                    </label>
                    <button
                        type="submit"
                        className='bg-[#00863E] text-white py-2 rounded hover:bg-[#27a361]'
                        disabled={loading}
                    >
                        {loading ? (locale === 'ru' ? 'Создание...' : 'Yaratilmoqda...') : (locale === 'ru' ? 'Создать' : 'Yaratish')}
                    </button>
                </form>
            </div>
        </div>
    )
}
