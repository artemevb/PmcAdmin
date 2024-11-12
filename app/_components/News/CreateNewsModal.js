'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import close from "@/public/svg/close-black-bold.svg";

const CreateNewsModal = ({ isOpen, onClose, onSave, locale }) => {
    const [blocks, setBlocks] = useState([
        { title_ru: '', title_uz: '', body_ru: '', body_uz: '', photo: null, photoPreview: null }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Функция для добавления нового блока
    const addBlock = () => {
        setBlocks([...blocks, { title_ru: '', title_uz: '', body_ru: '', body_uz: '', photo: null, photoPreview: null }]);
    };

    // Функция для удаления блока
    const removeBlock = (index) => {
        const updatedBlocks = blocks.filter((_, idx) => idx !== index);
        setBlocks(updatedBlocks);
    };

    // Обработка изменений в полях ввода
    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedBlocks = [...blocks];
        updatedBlocks[index][name] = value;
        setBlocks(updatedBlocks);
    };

    // Обработка выбора фото
    const handlePhotoChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedBlocks = [...blocks];
            updatedBlocks[index].photo = file;
            updatedBlocks[index].photoPreview = URL.createObjectURL(file);
            setBlocks(updatedBlocks);
        }
    };

    // Обработка отправки формы
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        // Валидация блоков
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];
            const isFirst = i === 0;

            // Проверка заголовков
            if (isFirst) {
                if (!block.title_ru.trim() || !block.title_uz.trim()) {
                    setError(locale === 'ru'
                        ? `Заголовок обязателен в блоке "${i + 1 === 0 ? 'Вступление' : `Блок ${i + 1}`}".`
                        : `Sarlavha majburiy bo'lishi kerak blokda "${i + 1 === 0 ? 'Tanishuv' : `Blok ${i + 1}`}".`);
                    setIsSubmitting(false);
                    return;
                }
            } else {
                if (!block.title_ru.trim() && !block.title_uz.trim()) {
                    setError(locale === 'ru'
                        ? `Заголовок обязателен в блоке ${i + 1}.`
                        : `Sarlavha majburiy bo'lishi kerak blokda ${i + 1}.`);
                    setIsSubmitting(false);
                    return;
                }
            }

            // Проверка текста
            if (isFirst) {
                if (!block.body_ru.trim() || !block.body_uz.trim()) {
                    setError(locale === 'ru'
                        ? `Текст обязателен в блоке "${i + 1 === 0 ? 'Вступление' : `Блок ${i + 1}`}".`
                        : `Matn majburiy bo'lishi kerak blokda "${i + 1 === 0 ? 'Tanishuv' : `Blok ${i + 1}`}".`);
                    setIsSubmitting(false);
                    return;
                }
            } else {
                if (!block.body_ru.trim() && !block.body_uz.trim()) {
                    setError(locale === 'ru'
                        ? `Текст обязателен в блоке ${i + 1}.`
                        : `Matn majburiy bo'lishi kerak blokda ${i + 1}.`);
                    setIsSubmitting(false);
                    return;
                }
            }

            // Проверка фото для первого блока
            if (isFirst && !block.photo && !block.photoPreview) {
                setError(locale === 'ru'
                    ? `Изображение обязательно для первого блока "${i + 1 === 0 ? 'Вступление' : `Блок ${i + 1}`}".`
                    : `Rasm majburiy bo'lishi kerak blokda "${i + 1 === 0 ? 'Tanishuv' : `Blok ${i + 1}`}".`);
                setIsSubmitting(false);
                return;
            }
        }

        try {
            // Конструирование JSON структуры
            const optionList = blocks.map(block => {
                const title = {};
                const body = {};

                if (block.title_ru.trim()) title.ru = block.title_ru.trim();
                if (block.title_uz.trim()) title.uz = block.title_uz.trim();
                if (block.body_ru.trim()) body.ru = block.body_ru.trim();
                if (block.body_uz.trim()) body.uz = block.body_uz.trim();

                const blockData = { title, body };

                return blockData;
            });

            // Создание FormData
            const formData = new FormData();
            formData.append('json', JSON.stringify({ optionList }));

            // Добавление фотографий с ключами block-index-0, block-index-1 и т.д.
            blocks.forEach((block, index) => {
                if (block.photo) {
                    formData.append(`block-index-${index}`, block.photo);
                }
            });

            // Отправка POST-запроса для создания новости
            const response = await axios.post('https://pmc.result-me.uz/v1/newness/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 201) { // 201 Created также возможно
                onSave(response.data.data); // Передача новых данных новости в родительский компонент
                onClose(); // Закрытие модального окна
            } else {
                setError('Ошибка при создании новости.');
            }
        } catch (err) {
            console.error(err);
            if (err.response) {
                // Сервер ответил с ошибкой
                setError(locale === 'ru'
                    ? `Ошибка: ${err.response.statusText}`
                    : `Xato: ${err.response.statusText}`);
            } else if (err.request) {
                // Запрос был отправлен, но ответа не было
                setError('Нет ответа от сервера.');
            } else {
                // Произошла другая ошибка
                setError('Ошибка при создании новости.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-[1236px] overflow-auto scrollbar-hide max-h-[90%]">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">
                        {'Создать новость'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="">
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

                {/* Содержимое формы */}
                <div className="p-6">
                    {blocks.map((block, index) => {
                        const isFirst = index === 0;
                        return (
                            <div key={index} className="mb-6 border p-4 rounded-lg relative">
                                <h3 className="text-lg font-semibold mb-4">
                                    {isFirst ? ('Вступление') : `${'Блок'} ${index + 1}`}
                                </h3>

                                {/* Кнопка удаления блока */}
                                {blocks.length > 1 && (
                                    <button
                                        onClick={() => removeBlock(index)}
                                        className="absolute top-1 right-4 text-red-500 hover:text-red-700 text-[30px]"
                                        title={'Удалить блок'}
                                    >
                                        &times;
                                    </button>
                                )}

                                {/* Поля заголовка */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                                        {'Заголовок (Русский)'}
                                        {isFirst && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        name={`title_ru`}
                                        value={block.title_ru}
                                        onChange={(e) => handleChange(index, e)}
                                        className="w-full border rounded px-3 py-2 mb-2"
                                        required={isFirst} // Обязательное поле для первого блока
                                    />
                                    <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                                        {'Заголовок (Uzbek)'}
                                        {isFirst && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="text"
                                        name={`title_uz`}
                                        value={block.title_uz}
                                        onChange={(e) => handleChange(index, e)}
                                        className="w-full border rounded px-3 py-2"
                                        required={isFirst} // Обязательное поле для первого блока
                                    />
                                </div>

                                {/* Поля текста */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                                        {'Текст (Русский)'}
                                        {isFirst && <span className="text-red-500">*</span>}
                                    </label>
                                    <textarea
                                        name={`body_ru`}
                                        value={block.body_ru}
                                        onChange={(e) => handleChange(index, e)}
                                        className="w-full border rounded px-3 py-2 mb-2"
                                        rows={4}
                                        required={isFirst} // Обязательное поле для первого блока
                                    />
                                    <label className="block text-sm font-medium mb-1 text-[#A6A6A6]">
                                        {'Текст (Uzbek)'}
                                        {isFirst && <span className="text-red-500">*</span>}
                                    </label>
                                    <textarea
                                        name={`body_uz`}
                                        value={block.body_uz}
                                        onChange={(e) => handleChange(index, e)}
                                        className="w-full border rounded px-3 py-2"
                                        rows={4}
                                        required={isFirst} // Обязательное поле для первого блока
                                    />
                                </div>

                                {/* Поле для фото */}
                                <div className="mb-4">
                                    <label className="block text-lg mb-1 text-[#010101] font-bold">
                                        {isFirst
                                            ? ('Изображение (обязательно)')
                                            : ('Изображение (не обязательно)')}
                                    </label>
                                    {block.photoPreview && (
                                        <div className="mb-2">
                                            <Image
                                                src={block.photoPreview}
                                                alt={"Текущее фото"}
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
                                        required={isFirst} // Обязательное поле для первого блока
                                    />
                                </div>
                            </div>
                        )
                    })}

                    {/* Кнопка добавления нового блока */}
                    <button
                        onClick={addBlock}
                        className='px-4 py-2 bg-[#00863E] hover:bg-[#27a361] text-white '
                    >
                        {'Добавить блок'}
                    </button>
                </div>

                {/* Сообщение об ошибке */}
                {error && (
                    <div className="mb-4 p-4 text-center rounded bg-red-100 text-red-700 mx-6">
                        {error}
                    </div>
                )}

                {/* Кнопки подтверждения и отмены */}
                <div className="flex justify-end gap-2 bg-[#F9F9F9] h-[95px] items-center p-6 ">
                    <button
                        onClick={onClose}
                        className="w-[150px] bg-gray-300 hover:bg-gray-400 py-3"
                        disabled={isSubmitting}
                    >
                        {'Отмена'}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`py-3 bg-[#00863E] hover:bg-[#1e8f52] text-white w-[150px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? ('Сохранение...')
                            : ('Создать')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateNewsModal;
