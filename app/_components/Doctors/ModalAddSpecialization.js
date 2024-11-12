// app/_components/Doctors/ModalAddSpecialization.jsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import close_icon from '@/public/svg/close.svg'; // Иконка закрытия модального окна

const translations = {
    ru: {
        addSpecialization: 'Добавить специализацию',
        save: 'Сохранить',
        cancel: 'Отмена',
        specializationNameUz: 'Название специализации (UZ)',
        specializationNameRu: 'Название специализации (RU)',
        close: 'Закрыть',
    },
    ru: {
        addSpecialization: 'Добавить специализацию',
        save: 'Сохранить',
        cancel: 'Отмена',
        specializationNameUz: 'Название специализации (UZ)',
        specializationNameRu: 'Название специализации (RU)',
        close: 'Закрыть',
    },
};

export default function ModalAddSpecialization({ isOpen, onClose, onSave, locale }) {
    const [specializationName, setSpecializationName] = useState({ uz: '', ru: '' });

    const t = translations[locale];

    const handleSave = () => {
        // Валидация данных
        if (!specializationName.uz.trim() || !specializationName.ru.trim()) {
            alert('Пожалуйста, заполните оба поля названия специализации.');
            return;
        }
        onSave(specializationName);
        setSpecializationName({ uz: '', ru: '' }); // Очистка формы после сохранения
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white pt-6 max-w-[1000px] w-full relative">
                {/* Кнопка закрытия */}
                <button
                    className="absolute top-4 right-4"
                    onClick={onClose}
                    aria-label={t.close}
                >
                    <Image
                        src={close_icon}
                        width={24}
                        height={24}
                        alt={t.close}
                        className="w-full h-auto object-cover"
                    />
                </button>

                <h2 className="text-[30px] font-bold mb-4 border-b pb-[30px] px-6">{t.addSpecialization}</h2>
                <label className="block mb-2 text-[#A6A6A6] px-6">
                    {t.specializationNameUz}
                    <input
                        type="text"
                        value={specializationName.uz}
                        onChange={(e) => setSpecializationName({ ...specializationName, uz: e.target.value })}
                        className="border border-gray-300 p-2 w-full rounded mt-1 text-black"
                        placeholder={t.specializationNameUz}
                    />
                </label>
                <label className="block mb-4 text-[#A6A6A6] mt-[30px] px-6">
                    {t.specializationNameRu}
                    <input
                        type="text"
                        value={specializationName.ru}
                        onChange={(e) => setSpecializationName({ ...specializationName, ru: e.target.value })}
                        className="border border-gray-300 p-2 w-full rounded mt-1 text-black"
                        placeholder={t.specializationNameRu}
                    />
                </label>
                <div className="flex justify-end gap-4 bg-[#F9F9F9] p-[23px] mt-[40px]">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 hover:bg-gray-600 text-[16px] h-[50px]"
                        onClick={onClose}
                    >
                        {t.cancel}
                    </button>
                    <button
                        className="bg-[#00863E] text-white px-4 py-2 hover:bg-[#398f61] font-extrabold w-[223px] text-[16px] h-[50px]"
                        onClick={handleSave}
                    >
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
}
