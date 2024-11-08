'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

const CreateNewsModal = ({ isOpen, onClose, onSave, locale }) => {
    const [blocks, setBlocks] = useState([
        { title_ru: '', title_uz: '', body_ru: '', body_uz: '', photo: null, photoPreview: null }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Function to add a new block
    const addBlock = () => {
        setBlocks([...blocks, { title_ru: '', title_uz: '', body_ru: '', body_uz: '', photo: null, photoPreview: null }]);
    };

    // Function to remove a block
    const removeBlock = (index) => {
        const updatedBlocks = blocks.filter((_, idx) => idx !== index);
        setBlocks(updatedBlocks);
    };

    // Handle input changes
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedBlocks = [...blocks];
        updatedBlocks[index][name] = value;
        setBlocks(updatedBlocks);
    };

    // Handle photo selection
    const handlePhotoChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedBlocks = [...blocks];
            updatedBlocks[index].photo = file;
            updatedBlocks[index].photoPreview = URL.createObjectURL(file);
            setBlocks(updatedBlocks);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        // Validate blocks
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            if (!block.title_ru && !block.title_uz) {
                setError(locale === 'ru' ? `Заголовок обязателен в блоке ${i + 1}` : `Sarlavha majburiy bo'lishi kerak blokda ${i + 1}`);
                setIsSubmitting(false);
                return;
            }
            if (!block.body_ru && !block.body_uz) {
                setError(locale === 'ru' ? `Текст обязателен в блоке ${i + 1}` : `Matn majburiy bo'lishi kerak blokda ${i + 1}`);
                setIsSubmitting(false);
                return;
            }
        }

        try {
            // Construct the JSON structure
            const optionList = blocks.map(block => {
                const title = {};
                const body = {};

                if (block.title_ru) title.ru = block.title_ru;
                if (block.title_uz) title.uz = block.title_uz;
                if (block.body_ru) body.ru = block.body_ru;
                if (block.body_uz) body.uz = block.body_uz;

                const blockData = { title, body };

                return blockData;
            });

            // Create FormData
            const formData = new FormData();
            formData.append('json', JSON.stringify({ optionList }));

            // Append photos with keys block-index-0, block-index-1, etc.
            blocks.forEach((block, index) => {
                if (block.photo) {
                    formData.append(`block-index-${index}`, block.photo);
                }
            });

            // Send POST request to create news
            const response = await axios.post('https://pmc.result-me.uz/v1/newness/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 201) { // 201 Created is also possible
                onSave(response.data.data); // Pass the new news data to the parent component
                onClose(); // Close the modal
            } else {
                setError(locale === 'ru' ? 'Ошибка при создании новости.' : 'Yangilikni yaratishda xato yuz berdi.');
            }
        } catch (err) {
            console.error(err);
            if (err.response) {
                // Server responded with a status other than 2xx
                setError(locale === 'ru' ? `Ошибка: ${err.response.statusText}` : `Xato: ${err.response.statusText}`);
            } else if (err.request) {
                // Request was made but no response received
                setError(locale === 'ru' ? 'Нет ответа от сервера.' : 'Serverdan javob yo\'q.');
            } else {
                // Something else happened
                setError(locale === 'ru' ? 'Ошибка при создании новости.' : 'Yangilikni yaratishda xato yuz berdi.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-[800px] overflow-auto scrollbar-hide max-h-[90%] rounded-lg">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">
                        {locale === 'ru' ? 'Создать новость' : 'Yangilik yaratish'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
                        &times;
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6">
                    {blocks.map((block, index) => (
                        <div key={index} className="mb-6 border p-4 rounded-lg relative">
                            <h3 className="text-lg font-semibold mb-4">
                                {locale === 'ru' ? `Блок ${index + 1}` : `Blok ${index + 1}`}
                            </h3>

                            {/* Remove Block Button */}
                            {blocks.length > 1 && (
                                <button
                                    onClick={() => removeBlock(index)}
                                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                                    title={locale === 'ru' ? 'Удалить блок' : 'Blokni o\'chirish'}
                                >
                                    &times;
                                </button>
                            )}

                            {/* Title Inputs */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                                    {locale === 'ru' ? 'Заголовок (Русский)' : 'Sarlavha (O\'zbekcha)'}
                                </label>
                                <input
                                    type="text"
                                    name={`title_ru`}
                                    value={block.title_ru}
                                    onChange={(e) => handleChange(index, e)}
                                    className="w-full border rounded px-3 py-2 mb-2"
                                />
                                <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                                    {locale === 'ru' ? 'Заголовок (Uzbek)' : 'Sarlavha (Русский)'}
                                </label>
                                <input
                                    type="text"
                                    name={`title_uz`}
                                    value={block.title_uz}
                                    onChange={(e) => handleChange(index, e)}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>

                            {/* Body Inputs */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                                    {locale === 'ru' ? 'Текст (Русский)' : 'Matn (O\'zbekcha)'}
                                </label>
                                <textarea
                                    name={`body_ru`}
                                    value={block.body_ru}
                                    onChange={(e) => handleChange(index, e)}
                                    className="w-full border rounded px-3 py-2 mb-2"
                                    rows={4}
                                />
                                <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                                    {locale === 'ru' ? 'Текст (Uzbek)' : 'Matn (Русский)'}
                                </label>
                                <textarea
                                    name={`body_uz`}
                                    value={block.body_uz}
                                    onChange={(e) => handleChange(index, e)}
                                    className="w-full border rounded px-3 py-2"
                                    rows={4}
                                />
                            </div>

                            {/* Photo Input */}
                            <div className="mb-4">
                                <label className="block text-lg mb-1 text-[#010101] font-bold">
                                    {locale === 'ru' ? 'Изображение (не обязательно)' : 'Rasm (majburiy emas)'}
                                </label>
                                {block.photoPreview && (
                                    <div className="mb-2">
                                        <Image
                                            src={block.photoPreview}
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
                                    onChange={(e) => handlePhotoChange(index, e)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    ))}

                    {/* Add Block Button */}
                    <button
                        onClick={addBlock}
                        className='px-4 py-2 bg-[#00863E] hover:bg-[#27a361] text-white rounded'
                    >
                        {locale === 'ru' ? 'Добавить блок' : 'Blok qo\'shish'}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 text-center rounded bg-red-100 text-red-700 mx-6">
                        {error}
                    </div>
                )}

                {/* Submit and Cancel Buttons */}
                <div className="flex justify-end gap-2 bg-[#F9F9F9] h-[95px] items-center p-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        {locale === 'ru' ? 'Отмена' : 'Bekor qilish'}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`py-3 bg-[#00863E] hover:bg-[#1e8f52] text-white w-[150px] rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? (locale === 'ru' ? 'Сохранение...' : 'Saqlanmoqda...')
                            : (locale === 'ru' ? 'Создать' : 'Yaratish')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateNewsModal;
