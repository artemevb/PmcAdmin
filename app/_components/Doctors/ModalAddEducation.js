// app/_components/Doctors/ModalAddEducation.jsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import close_icon from '@/public/svg/close.svg'; // Иконка закрытия модального окна

const translations = {
    ru: {
        addEducation: 'Добавить образование',
        save: 'Сохранить',
        cancel: 'Отмена',
        startYear: 'Год начала',
        finishYear: 'Год окончания',
        institutionUz: 'Название учреждения (UZ)',
        institutionRu: 'Название учреждения (RU)',
        qualificationUz: 'Квалификация (UZ)',
        qualificationRu: 'Квалификация (RU)',
        close: 'Закрыть',
        validationError: 'Пожалуйста, заполните все поля.',
    },
    ru: {
        addEducation: 'Добавить образование',
        save: 'Сохранить',
        cancel: 'Отмена',
        startYear: 'Год начала',
        finishYear: 'Год окончания',
        institutionUz: 'Название учреждения (UZ)',
        institutionRu: 'Название учреждения (RU)',
        qualificationUz: 'Квалификация (UZ)',
        qualificationRu: 'Квалификация (RU)',
        close: 'Закрыть',
        validationError: 'Пожалуйста, заполните все поля.',
    },
};

export default function ModalAddEducation({ isOpen, onClose, onSave, locale }) {
    const [educationData, setEducationData] = useState({
        startYear: '',
        finishYear: '',
        institution: { uz: '', ru: '' },
        qualification: { uz: '', ru: '' },
    });

    const [error, setError] = useState('');

    const t = translations[locale];

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Обработка вложенных полей
        if (name.startsWith('institution.')) {
            const lang = name.split('.')[1];
            setEducationData((prev) => ({
                ...prev,
                institution: { ...prev.institution, [lang]: value },
            }));
        } else if (name.startsWith('qualification.')) {
            const lang = name.split('.')[1];
            setEducationData((prev) => ({
                ...prev,
                qualification: { ...prev.qualification, [lang]: value },
            }));
        } else {
            setEducationData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        // Валидация данных
        const { startYear, finishYear, institution, qualification } = educationData;
        if (
            !startYear.trim() ||
            !finishYear.trim() ||
            !institution.uz.trim() ||
            !institution.ru.trim() ||
            !qualification.uz.trim() ||
            !qualification.ru.trim()
        ) {
            setError(t.validationError);
            return;
        }

        // Передача данных родительскому компоненту
        onSave(educationData);
        setEducationData({
            startYear: '',
            finishYear: '',
            institution: { uz: '', ru: '' },
            qualification: { uz: '', ru: '' },
        });
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-[600px] w-full relative">
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

                <h2 className="text-[30px] mb-4 font-bold">{t.addEducation}</h2>

                <div className="mb-4">
                    <label className="block mb-2">
                        {t.startYear}
                        <input
                            type="text"
                            name="startYear"
                            value={educationData.startYear}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded mt-1"
                            placeholder="2020"
                        />
                    </label>
                    <label className="block mb-2">
                        {t.finishYear}
                        <input
                            type="text"
                            name="finishYear"
                            value={educationData.finishYear}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded mt-1"
                            placeholder="2024"
                        />
                    </label>
                    <label className="block mb-2">
                        {t.institutionUz}
                        <input
                            type="text"
                            name="institution.uz"
                            value={educationData.institution.uz}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded mt-1"
                            placeholder="O'zbekiston Milliy Universiteti"
                        />
                    </label>
                    <label className="block mb-2">
                        {t.institutionRu}
                        <input
                            type="text"
                            name="institution.ru"
                            value={educationData.institution.ru}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded mt-1"
                            placeholder="Национальный университет Узбекистана"
                        />
                    </label>
                    <label className="block mb-2">
                        {t.qualificationUz}
                        <input
                            type="text"
                            name="qualification.uz"
                            value={educationData.qualification.uz}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded mt-1"
                            placeholder="Bakalavr"
                        />
                    </label>
                    <label className="block mb-2">
                        {t.qualificationRu}
                        <input
                            type="text"
                            name="qualification.ru"
                            value={educationData.qualification.ru}
                            onChange={handleChange}
                            className="border border-gray-300 p-2 w-full rounded mt-1"
                            placeholder="Бакалавр"
                        />
                    </label>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={onClose}
                    >
                        {t.cancel}
                    </button>
                    <button
                        className="bg-[#00863E] text-white px-4 py-2 rounded hover:bg-[#398f61]"
                        onClick={handleSave}
                    >
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
}
