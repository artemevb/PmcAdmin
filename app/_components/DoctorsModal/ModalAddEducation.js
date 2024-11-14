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
        institutionUz: 'Наименование образовательного учреждения (UZ)',
        institutionRu: 'Наименование образовательного учреждения (RU)',
        qualificationUz: 'Направление (UZ)',
        qualificationRu: 'Направление (RU)',
        close: 'Закрыть',
        validationError: 'Пожалуйста, заполните все поля.',
    },
    uz: {
        addEducation: 'Добавить образование',
        save: 'Сохранить',
        cancel: 'Отмена',
        startYear: 'Год начала',
        finishYear: 'Год окончания',
        institutionUz: 'Наименование образовательного учреждения (UZ)',
        institutionRu: 'Наименование образовательного учреждения (RU)',
        qualificationUz: 'Направление (UZ)',
        qualificationRu: 'Направление (RU)',
        close: 'Закрыть',
        validationError: 'Пожалуйста, заполните все поля.',
    },
};

export default function ModalAddEducation({ isOpen, onClose, onSave, locale }) {
    const [educationData, setEducationData] = useState({
        startYear: '',
        finishYear: '',
        institutionUz: '',
        institutionRu: '',
        qualificationUz: '',
        qualificationRu: '',
    });

    const [error, setError] = useState('');

    const t = translations[locale];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEducationData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const {
            startYear,
            finishYear,
            institutionUz,
            institutionRu,
            qualificationUz,
            qualificationRu,
        } = educationData;

        if (
            !startYear.trim() ||
            !finishYear.trim() ||
            !institutionUz.trim() ||
            !institutionRu.trim() ||
            !qualificationUz.trim() ||
            !qualificationRu.trim()
        ) {
            setError(t.validationError);
            return;
        }

        // Формируем данные в соответствии с ожидаемой структурой
        const formattedData = {
            startYear,
            finishYear,
            institution: {
                uz: institutionUz,
                ru: institutionRu,
            },
            qualification: {
                uz: qualificationUz,
                ru: qualificationRu,
            },
        };

        onSave(formattedData);
        console.log('Образование успешно сохранено:', formattedData);
        setEducationData({
            startYear: '',
            finishYear: '',
            institutionUz: '',
            institutionRu: '',
            qualificationUz: '',
            qualificationRu: '',
        });
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 max-w-[1253px] w-full relative overflow-y-auto scrollbar-hide max-h-[90vh]">
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

                <h2 className="text-[30px] mb-[40px] font-bold border-b pb-[30px]">{t.addEducation}</h2>

                <div className="mb-[60px]">
                    <div className="flex gap-[12px] w-full">
                        <label className="block mb-[30px] text-[#A6A6A6] w-full">
                            {t.startYear}
                            <input
                                type="text"
                                name="startYear"
                                value={educationData.startYear}
                                onChange={handleChange}
                                className="border border-gray-300 p-[15px] w-full rounded-[10px] mt-1 text-black"
                                placeholder="2020"
                            />
                        </label>
                        <label className="block mb-[30px] text-[#A6A6A6] w-full">
                            {t.finishYear}
                            <input
                                type="text"
                                name="finishYear"
                                value={educationData.finishYear}
                                onChange={handleChange}
                                className="border border-gray-300 p-[15px] w-full rounded-[10px] mt-1 text-black"
                                placeholder="2024"
                            />
                        </label>
                    </div>
                    <label className="block mb-[30px] text-[#A6A6A6]">
                        {t.institutionUz}
                        <input
                            type="text"
                            name="institutionUz"
                            value={educationData.institutionUz}
                            onChange={handleChange}
                            className="border border-gray-300 p-[15px] w-full rounded-[10px] mt-1 text-black"
                            placeholder="O'zbekiston Milliy Universiteti"
                        />
                    </label>
                    <label className="block mb-[30px] text-[#A6A6A6]">
                        {t.institutionRu}
                        <input
                            type="text"
                            name="institutionRu"
                            value={educationData.institutionRu}
                            onChange={handleChange}
                            className="border border-gray-300 p-[15px] w-full rounded-[10px] mt-1 text-black"
                            placeholder="Национальный университет Узбекистана"
                        />
                    </label>
                    <label className="block mb-[30px] text-[#A6A6A6]">
                        {t.qualificationUz}
                        <input
                            type="text"
                            name="qualificationUz"
                            value={educationData.qualificationUz}
                            onChange={handleChange}
                            className="border border-gray-300 p-[15px] w-full rounded-[10px] mt-1 text-black"
                            placeholder="Bakalavr"
                        />
                    </label>
                    <label className="block mb-[30px] text-[#A6A6A6]">
                        {t.qualificationRu}
                        <input
                            type="text"
                            name="qualificationRu"
                            value={educationData.qualificationRu}
                            onChange={handleChange}
                            className="border border-gray-300 p-[15px] w-full rounded-[10px] mt-1 text-black"
                            placeholder="Бакалавр"
                        />
                    </label>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-500 text-white px-[67.5px] py-2 hover:bg-gray-600 w-auto h-[50px]"
                        onClick={onClose}
                    >
                        {t.cancel}
                    </button>
                    <button
                        className="bg-[#00863E] text-white px-[67.5px] py-2 hover:bg-[#398f61] w-auto h-[50px]"
                        onClick={handleSave}
                    >
                        {t.save}
                    </button>
                </div>
            </div>
        </div>
    );
}
