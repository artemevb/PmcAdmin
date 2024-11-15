// app_components/Doctors/AddBlockModal.js

'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import close from "@/public/svg/close-black-bold.svg";
import translations from './translations'; // Импортируем объект переводов

const AddBlockModal = ({ isOpen, onClose, onSave, locale, newsId, existingBlocks, fetchNews }) => {
    const [selectedLanguage, setSelectedLanguage] = useState('ru'); // Default language
    const [formData, setFormData] = useState({
        title_ru: '',
        title_uz: '',
        body_ru: '',
        body_uz: '',
        photo: null,
    });
    const [preview, setPreview] = useState(null); // Для предварительного просмотра
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal is closed
            setFormData({
                title_ru: '',
                title_uz: '',
                body_ru: '',
                body_uz: '',
                photo: null,
            });
            setPreview(null);
            setSelectedLanguage('ru');
            setError(null);
        }
    }, [isOpen]);

    useEffect(() => {
        // Очистка предварительного просмотра при размонтировании компонента или изменении preview
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

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
            setFormData((prev) => ({
                ...prev,
                photo: file,
            }));
            setPreview(URL.createObjectURL(file)); // Установка URL для предварительного просмотра
            setError(null); // Очистка предыдущих ошибок
        }
    };

    const handleLanguageSwitch = (lang) => {
        setSelectedLanguage(lang);
    };

    const handleRemovePhoto = () => {
        setFormData((prev) => ({
            ...prev,
            photo: null,
        }));
        setPreview(null);
    };

    const handleSave = async () => {
        // Изменённая валидация: блок можно создать, если заполнено хотя бы одно текстовое поле или загружено фото
        const isAtLeastOneTextFilled = 
            formData.title_ru.trim() || 
            formData.title_uz.trim() || 
            formData.body_ru.trim() || 
            formData.body_uz.trim();

        if (!isAtLeastOneTextFilled && !formData.photo) {
            setError(locale === 'ru' 
                ? translations[locale].pleaseFillAtLeastOneField // 'Пожалуйста, заполните хотя бы одно текстовое поле или загрузите фото.'
                : translations[locale].pleaseFillAtLeastOneFieldUz); // 'Iltimos, kamida bitta matn maydonini to\'ldiring yoki foto yuklang.'
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            // Определение следующего orderNum
            const lastBlock = existingBlocks[existingBlocks.length - 1];
            const nextOrderNum = lastBlock ? lastBlock.orderNum + 1 : 1;

            // Подготовка JSON данных, включая только заполненные поля
            const jsonData = {
                title: {},
                body: {},
                orderNum: nextOrderNum,
            };

            if (formData.title_ru.trim()) jsonData.title.ru = formData.title_ru.trim();
            if (formData.title_uz.trim()) jsonData.title.uz = formData.title_uz.trim();
            if (formData.body_ru.trim()) jsonData.body.ru = formData.body_ru.trim();
            if (formData.body_uz.trim()) jsonData.body.uz = formData.body_uz.trim();

            // Удаление пустых объектов title или body, если соответствующие поля не заполнены
            if (Object.keys(jsonData.title).length === 0) delete jsonData.title;
            if (Object.keys(jsonData.body).length === 0) delete jsonData.body;

            // Подготовка FormData для отправки
            const formDataToSend = new FormData();
            formDataToSend.append('json', JSON.stringify(jsonData));

            if (formData.photo) {
                formDataToSend.append('photo', formData.photo);
            }

            // Отправка POST-запроса
            const response = await axios.post(`https://pmc.result-me.uz/v1/newness/block/add/${newsId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept-Language': locale,
                },
            });

            if (response.status === 200) {
                // Предполагается, что API возвращает только созданный блок
                const newBlock = response.data.data;
                onSave(newBlock); // Обновление состояния в родительском компоненте

                // Вызовите fetchNews для обновления данных
                fetchNews();

                setIsSaving(false);
                onClose();
            } else {
                console.error('Error adding block:', response);
                setError(locale === 'ru' 
                    ? translations[locale].errorAddingBlock // 'Ошибка при добавлении блока.'
                    : translations[locale].errorAddingBlockUz); // 'Blok qo\'shishda xato yuz berdi.'
            }
        } catch (err) {
            console.error('Error adding block:', err);
            setError(locale === 'ru' 
                ? translations[locale].errorAddingBlock // 'Ошибка при добавлении блока.'
                : translations[locale].errorAddingBlockUz); // 'Blok qo\'shishda xato yuz berdi.'
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-[600px] sm:max-w-[800px] overflow-auto scrollbar-hide max-h-[90%]">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">
                        {locale === 'ru' ? 'Добавить новый блок' : 'Yangi blok qo\'shish'}
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
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => handleLanguageSwitch('ru')}
                        className={`px-4 py-2 rounded-l ${selectedLanguage === 'ru' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Русский
                    </button>
                    <button
                        onClick={() => handleLanguageSwitch('uz')}
                        className={`px-4 py-2 rounded-r ${selectedLanguage === 'uz' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Ozbek
                    </button>
                </div>

                {/* Формы для добавления */}
                <div className="mb-4 p-6">
                    {/* Заголовок */}
                    <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                        {selectedLanguage === 'ru' ? 'Заголовок (Русский)' : 'Sarlavha (O\'zbek)'}
                    </label>
                    <input
                        type="text"
                        name={selectedLanguage === 'ru' ? 'title_ru' : 'title_uz'}
                        value={selectedLanguage === 'ru' ? formData.title_ru : formData.title_uz}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 mb-4"
                        // Убираем атрибут required
                    />

                    {/* Текст */}
                    <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                        {selectedLanguage === 'ru' ? 'Текст (Русский)' : 'Matn (O\'zbek)'}
                    </label>
                    <textarea
                        name={selectedLanguage === 'ru' ? 'body_ru' : 'body_uz'}
                        value={selectedLanguage === 'ru' ? formData.body_ru : formData.body_uz}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2 mb-4"
                        rows={4}
                        // Убираем атрибут required
                    />

                    {/* Фото */}
                    <label className="block text-lg mb-1 text-[#010101] font-bold">
                        {locale === 'ru' ? 'Фото (не обязательно)' : 'Foto (majburiy emas)'}
                    </label>
                    {preview && (
                        <div className="relative mb-4">
                            <Image
                                src={preview}
                                alt="Предварительный просмотр"
                                width={300}
                                height={200}
                                className="object-cover w-full h-auto rounded"
                            />
                            <button
                                onClick={handleRemovePhoto}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-200"
                                title={locale === 'ru' ? 'Удалить фото' : 'Fotoni o\'chirish'}
                            >
                                <Image
                                    src={close}
                                    width={20}
                                    height={20}
                                    alt={locale === 'ru' ? 'Удалить фото' : 'Fotoni o\'chirish'}
                                />
                            </button>
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="w-full mb-4"
                        // Убедитесь, что атрибут multiple не установлен
                        multiple={false}
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
                        disabled={isSaving}
                    >
                        {locale === 'ru' ? 'Отмена' : 'Bekor qilish'}
                    </button>
                    <button
                        onClick={handleSave}
                        className={`py-3 bg-[#00863E] hover:bg-[#1e8f52] text-white w-[150px] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default AddBlockModal;
