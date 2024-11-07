// EditBlockModal.jsx
'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

const EditBlockModal = ({ isOpen, onClose, blockData, onSave, locale, newsId, newsActive }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(locale || 'ru'); // Текущий язык для редактирования
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
                title_ru: isTitleObject
                    ? (blockData.title.ru || '')
                    : (locale === 'ru' ? blockData.title : ''),
                title_uz: isTitleObject
                    ? (blockData.title.uz || '')
                    : (locale === 'uz' ? blockData.title : ''),
                body_ru: isBodyObject
                    ? (blockData.body.ru || '')
                    : (locale === 'ru' ? blockData.body : ''),
                body_uz: isBodyObject
                    ? (blockData.body.uz || '')
                    : (locale === 'uz' ? blockData.body : ''),
                photo: null,
                photoUrl: blockData.photo?.url || '',
            });
            setSelectedLanguage(locale || 'ru'); // Установить текущий язык при открытии модала
        }
    }, [blockData, locale]);

    console.log("Modal Locale:", locale); // Отладка
    console.log("Form Data:", formData); // Отладка

    if (!isOpen || !blockData) return null;

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

    const handleLanguageSwitch = (lang) => {
        setSelectedLanguage(lang);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            let photoUrl = formData.photoUrl;
            let updatedBlock = { id: blockData.id };

            // Если выбрано новое изображение, обновите его через отдельный запрос
            if (formData.photo) {
                const blockId = blockData.id; // Используем id блока

                const uploadData = new FormData();
                uploadData.append('photo', formData.photo); // 'photo' — ключ для файла

                const uploadResponse = await axios.put(
                    `https://pmc.result-me.uz/v1/newness/block/update/photo/${blockId}`,
                    uploadData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                if (uploadResponse.status === 200) {
                    photoUrl = uploadResponse.data.url; // Предполагается, что сервер возвращает URL обновленного фото
                } else {
                    console.error('Error uploading photo:', uploadResponse);
                    setError(locale === 'ru' ? 'Ошибка при обновлении фото.' : 'Foto yangilashda xato yuz berdi.');
                    setIsSaving(false);
                    return;
                }

                updatedBlock.photo = { url: photoUrl };
            }

            // В зависимости от выбранного языка, добавьте соответствующие поля
            if (selectedLanguage === 'ru') {
                updatedBlock.title = { ru: formData.title_ru };
                updatedBlock.body = { ru: formData.body_ru };
            } else if (selectedLanguage === 'uz') {
                updatedBlock.title = { uz: formData.title_uz };
                updatedBlock.body = { uz: formData.body_uz };
            }

            console.log("Updated Block to Save:", updatedBlock); // Отладка

            // Подготовьте полный JSON для обновления
            const payload = {
                id: newsId, // ID новости
                active: newsActive, // Используем из пропса
                optionList: [updatedBlock],
            };

            console.log("Payload for Update:", JSON.stringify(payload, null, 2)); // Добавлено логирование

            // Отправьте PUT-запрос для обновления блока
            const response = await axios.put('https://pmc.result-me.uz/v1/newness/update', payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 200) {
                // Вызовите функцию onSave, переданную из MainPages.jsx
                onSave(response.data.data); // Предполагается, что сервер возвращает обновленные данные новости
                setIsSaving(false);
                onClose(); // Закройте модальное окно
            } else {
                console.error('Error updating block:', response);
                setError(locale === 'ru' ? 'Ошибка при обновлении блока.' : 'Blokni yangilashda xato yuz berdi.');
                setIsSaving(false);
            }
        } catch (err) {
            console.error('Error saving block:', err);
            setError(locale === 'ru' ? 'Ошибка при сохранении блока.' : 'Blokni saqlashda xato yuz berdi.');
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-[600px] sm:max-w-[800px] overflow-auto scrollbar-hide max-h-[90%] ">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">
                        {locale === 'ru' ? 'Редактировать блок' : 'Blokni tahrirlash'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>

                {/* Переключатель языка */}
                {/* <div className="flex justify-center mt-4">
                    <button
                        onClick={() => handleLanguageSwitch('ru')}
                        className={`px-4 py-2 rounded-l ${selectedLanguage === 'ru' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        Русский
                    </button>
                    <button
                        onClick={() => handleLanguageSwitch('uz')}
                        className={`px-4 py-2 rounded-r ${selectedLanguage === 'uz' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        O'zbek
                    </button>
                </div> */}

                {/* Формы для редактирования */}
                <div className="mb-4 p-6">
                    {/* Заголовок */}
                    <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                        {selectedLanguage === 'ru' ? 'Заголовок (Русский)' : 'Sarlavha (Uzbek)'}
                    </label>
                    <input
                        type="text"
                        name={selectedLanguage === 'ru' ? 'title_ru' : 'title_uz'}
                        value={selectedLanguage === 'ru' ? formData.title_ru : formData.title_uz}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 mb-4"
                    />

                    {/* Текст */}
                    <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                        {selectedLanguage === 'ru' ? 'Текст (Русский)' : 'Matn (Uzbek)'}
                    </label>
                    <textarea
                        name={selectedLanguage === 'ru' ? 'body_ru' : 'body_uz'}
                        value={selectedLanguage === 'ru' ? formData.body_ru : formData.body_uz}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 mb-4"
                        rows={4}
                    />

                    {/* Фото */}
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
                    <div className="mb-4 p-4 text-center rounded bg-red-100 text-red-700 mx-6">
                        {error}
                    </div>
                )}

                {/* Кнопки */}
                <div className="flex justify-end gap-2 bg-[#F9F9F9] h-[95px] items-center p-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        {locale === 'ru' ? 'Отмена' : 'Bekor qilish'}
                    </button>
                    <button
                        onClick={handleSave}
                        className={`py-3 bg-[#00863E] hover:bg-[#1e8f52] text-white w-[150px] rounded ${isSaving ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={isSaving}
                    >
                        {isSaving
                            ? (locale === 'ru' ? 'Сохранение...' : 'Saqlanmoqda...')
                            : (locale === 'ru' ? 'Сохранить' : 'Saqlash')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditBlockModal;
