// EditBlockModal.jsx
'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import close from "@/public/svg/close-black-bold.svg";

const EditBlockModal = ({ isOpen, onClose, blockData, onSave, locale, newsId, newsActive, isFirst }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(locale || 'ru'); // Текущий язык для редактирования
    const [formData, setFormData] = useState({
        title_ru: '',
        title_uz: '',
        body_ru: '',
        body_uz: '',
        photo: null,
        photoUrl: '',
        photoId: null, // Добавлено для хранения ID фотографии
    });
    const [isSaving, setIsSaving] = useState(false); // Состояние сохранения
    const [error, setError] = useState(null); // Ошибка сохранения
    const [isDeleting, setIsDeleting] = useState(false); // Состояние удаления

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
                photoId: blockData.photo?.id || null, // Установка ID фотографии
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
                photoId: null, // Сбросить photoId при выборе новой фотографии
            }));
        }
    };

    const handleLanguageSwitch = (lang) => {
        setSelectedLanguage(lang);
    };

    const handleDeletePhoto = async () => {
        if (!formData.photoId) return; // Если нет ID, ничего не делать

        setIsDeleting(true);
        setError(null);
        try {
            const deleteResponse = await axios.delete(`https://pmc.result-me.uz/v1/photo/delete/${formData.photoId}`);

            if (deleteResponse.status === 200) {
                // Удаление прошло успешно, обновляем состояние
                setFormData((prev) => ({
                    ...prev,
                    photoUrl: '',
                    photoId: null,
                }));
            } else {
                console.error('Error deleting photo:', deleteResponse);
                setError(locale === 'ru' ? 'Ошибка при удалении фото.' : 'Foto o\'chirishda xato yuz berdi.');
            }
        } catch (err) {
            console.error('Error deleting photo:', err);
            setError(locale === 'ru' ? 'Ошибка при удалении фото.' : 'Foto o\'chirishda xato yuz berdi.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSave = async () => {
        // Если это первый блок, проверяем обязательное поле изображения
        if (isFirst && !formData.photo && !formData.photoUrl) {
            setError(locale === 'ru' ? 'Изображение обязательно для первого блока.' : 'Birinchi blok uchun rasm majburiy.');
            return;
        }

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
                    // Также можно получить новый photoId, если сервер его возвращает
                    updatedBlock.photo = { url: photoUrl, id: uploadResponse.data.id };
                } else {
                    console.error('Error uploading photo:', uploadResponse);
                    setError(locale === 'ru' ? 'Ошибка при обновлении фото.' : 'Foto yangilashda xato yuz berdi.');
                    setIsSaving(false);
                    return;
                }
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

            // Если это первый блок, убедитесь, что title и body для обоих языков присутствуют
            if (isFirst) {
                updatedBlock.title = {
                    ru: formData.title_ru || blockData.title?.ru || '',
                    uz: formData.title_uz || blockData.title?.uz || '',
                };
                updatedBlock.body = {
                    ru: formData.body_ru || blockData.body?.ru || '',
                    uz: formData.body_uz || blockData.body?.uz || '',
                };
            }

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
            <div className="bg-white w-full max-w-[600px] sm:max-w-[800px] overflow-auto scrollbar-hide max-h-[90%]">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">
                        {isFirst
                            ? ('Редактировать вступление')
                            : ('Редактировать блок')}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <Image
                            src={close}
                            width={40}
                            height={40}
                            quality={100}
                            alt={'Закрыть блок'}
                            className="w-full h-auto object-cover max-w-[40px]"
                        />
                    </button>
                </div>

                {/* Переключатель языка */}
                {/* Если нужно, можно раскомментировать для возможности переключения языка внутри модала
                <div className="flex justify-center mt-4">
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
                </div>
                */}

                {/* Формы для редактирования */}
                <div className="mb-4 p-6">
                    {/* Заголовок */}
                    <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                        {selectedLanguage === 'ru' ? 'Заголовок (Русский)' : 'Заголовок (Uzbek)'}
                    </label>
                    <input
                        type="text"
                        name={selectedLanguage === 'ru' ? 'title_ru' : 'title_uz'}
                        value={selectedLanguage === 'ru' ? formData.title_ru : formData.title_uz}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 mb-4"
                        required={isFirst} // Добавляем обязательность для первого блока
                    />

                    {/* Текст */}
                    <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                        {selectedLanguage === 'ru' ? 'Текст (Русский)' : 'Текст (Uzbek)'}
                    </label>
                    <textarea
                        name={selectedLanguage === 'ru' ? 'body_ru' : 'body_uz'}
                        value={selectedLanguage === 'ru' ? formData.body_ru : formData.body_uz}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 mb-4"
                        rows={4}
                        required={isFirst} // Добавляем обязательность для первого блока
                    />

                    {/* Фото */}
                    <label className="block text-lg mb-1 text-[#010101] font-bold">
                        {isFirst
                            ? ('Изображение новости (обязательно)')
                            : ('Изображение (не обязательно)')}
                    </label>
                    {formData.photoUrl && (
                        <div className="relative mb-2">
                            <Image
                                src={formData.photoUrl}
                                alt={"Текущее фото"}
                                width={205}
                                height={120}
                                className="object-cover w-[205px] h-[120px]"
                            />
                            {/* Крестик для удаления фото */}
                            <button
                                onClick={handleDeletePhoto}
                                className="absolute top-2 left-[22%] bg-white rounded-full p-1 hover:bg-gray-200"
                                disabled={isDeleting}
                                title={'Удалить фото'}
                            >
                                <Image
                                    src={close}
                                    width={24}
                                    height={24}
                                    alt="Удалить фото"
                                />
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="w-full"
                        required={isFirst} // Сделать обязательным для первого блока
                    />
                </div>

                {/* Ошибка сохранения */}
                {error && (
                    <div className="mb-4 p-4 text-center rounded bg-red-100 text-red-700 mx-6">
                        {error}
                    </div>
                )}

                {/* Кнопки */}
                <div className="flex justify-end gap-2 bg-[#F9F9F9] h-[95px] items-center p-6 ">
                    <button
                        onClick={onClose}
                        className="px-4 py-3 bg-gray-300 w-[150px]"
                        disabled={isSaving || isDeleting}
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSave}
                        className={`py-3 bg-[#00863E] hover:bg-[#1e8f52] text-white w-[150px] ${isSaving || isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={isSaving || isDeleting}
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

