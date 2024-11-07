// EditBlockModal.jsx
'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const EditBlockModal = ({ isOpen, onClose, blockData, onSave, locale }) => {
    const [formData, setFormData] = useState({
        title_ru: '',
        title_uz: '',
        body_ru: '',
        body_uz: '',
        photo: null,
        photoUrl: '',
    });
    const [isSaving, setIsSaving] = useState(false); // Состояние сохранения
    const [error, setError] = useState(null); // Ошибка сохранения

    useEffect(() => {
        if (blockData) {
            console.log("Received blockData in Modal:", blockData); // Отладка

            const isTitleObject = typeof blockData.title === 'object';
            const isBodyObject = typeof blockData.body === 'object';

            setFormData({
                title_ru: isTitleObject ? (blockData.title.ru || '') : (locale === 'ru' ? blockData.title : ''),
                title_uz: isTitleObject ? (blockData.title.uz || '') : (locale === 'uz' ? blockData.title : ''),
                body_ru: isBodyObject ? (blockData.body.ru || '') : (locale === 'ru' ? blockData.body : ''),
                body_uz: isBodyObject ? (blockData.body.uz || '') : (locale === 'uz' ? blockData.body : ''),
                photo: null,
                photoUrl: blockData.photo?.url || '',
            });
        }
    }, [blockData, locale]);

    console.log("Modal Locale:", locale); // Отладка
    console.log("Form Data:", formData); // Отладка

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Валидация файла (размер, тип) при необходимости
            setFormData((prev) => ({
                ...prev,
                photo: file,
                photoUrl: URL.createObjectURL(file), // Для предварительного просмотра
            }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        // Валидация данных
        if (!formData.title_ru.trim() || !formData.title_uz.trim() || !formData.body_ru.trim() || !formData.body_uz.trim()) {
            setError(locale === 'ru' ? 'Все поля должны быть заполнены.' : 'Barcha maydonlar to\'ldirilishi kerak.');
            setIsSaving(false);
            return;
        }

        // Создаем объект обновленного блока
        const updatedBlock = {
            ...(blockData.id ? { id: blockData.id } : {}), // Добавляем id только для существующих блоков
            title: {
                ru: formData.title_ru,
                uz: formData.title_uz,
            },
            body: {
                ru: formData.body_ru,
                uz: formData.body_uz,
            },
            // Если фото выбрано, передаём файл, иначе сохраняем существующий URL
            photo: formData.photo ? formData.photo : blockData.photo || null,
            // orderNum будет определён в родительском компоненте
        };

        console.log("Updated Block to Save:", updatedBlock); // Отладка

        try {
            // Вызов функции onSave, переданной из MainPages.jsx
            await onSave(updatedBlock);
            setIsSaving(false);
            onClose(); // Закрыть модальное окно после успешного сохранения
        } catch (saveError) {
            console.error('Error saving block:', saveError);
            setError(locale === 'ru' ? 'Ошибка при сохранении блока.' : 'Blokni saqlashda xato yuz berdi.');
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-[600px] sm:max-w-[800px] overflow-auto scrollbar-hide max-h-[90%] rounded-lg shadow-lg">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">
                        {blockData.id
                            ? (locale === 'ru' ? 'Редактировать блок' : 'Blokni tahrirlash')
                            : (locale === 'ru' ? 'Добавить блок' : 'Blok qo\'shish')}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSave} className="mb-4 p-6">
                    {/* Заголовок (RU) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                            {locale === 'ru' ? 'Заголовок (Русский)' : 'Sarlavha (Ruscha)'}
                        </label>
                        <input
                            type="text"
                            name="title_ru"
                            value={formData.title_ru}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    {/* Заголовок (UZ) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                            {locale === 'ru' ? 'Заголовок (Узбекский)' : 'Sarlavha (O\'zbekcha)'}
                        </label>
                        <input
                            type="text"
                            name="title_uz"
                            value={formData.title_uz}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    {/* Текст (RU) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                            {locale === 'ru' ? 'Текст (Русский)' : 'Matn (Ruscha)'}
                        </label>
                        <textarea
                            name="body_ru"
                            value={formData.body_ru}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            rows={4}
                            required
                        ></textarea>
                    </div>

                    {/* Текст (UZ) */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                            {locale === 'ru' ? 'Текст (Узбекский)' : 'Matn (O\'zbekcha)'}
                        </label>
                        <textarea
                            name="body_uz"
                            value={formData.body_uz}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                            rows={4}
                            required
                        ></textarea>
                    </div>

                    {/* Фото */}
                    <div className="mb-4">
                        <label className="block text-lg mb-1 text-[#010101] font-bold">
                            {locale === 'ru' ? 'Изображение (не обязательно)' : 'Rasm (majburiy emas)'}
                        </label>
                        {formData.photoUrl && (
                            <div className="mb-2">
                                <Image
                                    src={formData.photoUrl}
                                    alt={locale === 'ru' ? "Текущее фото" : "Joriy Rasm"}
                                    width={205}
                                    height={120}
                                    className="object-cover rounded"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="w-full"
                        />
                    </div>

                    {/* Ошибка сохранения */}
                    {error && (
                        <div className="mb-4 p-4 text-center rounded bg-red-100 text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Кнопки */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            {locale === 'ru' ? 'Отмена' : 'Bekor qilish'}
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-[#00863E] hover:bg-[#006b2b] text-white rounded ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSaving}
                        >
                            {isSaving
                                ? (locale === 'ru' ? 'Сохранение...' : 'Saqlanmoqda...')
                                : (locale === 'ru' ? 'Сохранить' : 'Saqlash')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBlockModal;
