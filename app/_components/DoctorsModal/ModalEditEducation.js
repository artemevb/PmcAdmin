'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import closeIcon from '@/public/svg/close.svg'; // Убедитесь, что у вас есть иконка закрытия

const ModalEditEducation = ({ isOpen, onClose, onSave, education, locale }) => {
    const translations = {
        ru: {
            title: 'Редактировать образование',
            startYear: 'Год начала',
            finishYear: 'Год окончания',
            institution: 'Наименование образовательного учреждения',
            qualification: 'Направление',
            save: 'Сохранить',
            cancel: 'Отмена',
        },
        uz: {
            title: 'Редактировать образование',
            startYear: 'Год начала',
            finishYear: 'Год окончания',
            institution: 'Наименование образовательного учреждения',
            qualification: 'Направление',
            save: 'Сохранить',
            cancel: 'Отмена',
        },
    };

    const t = translations[locale];

    const [formData, setFormData] = useState({
        id: null,
        startYear: '',
        finishYear: '',
        institution: {
            uz: '',
            ru: '',
        },
        qualification: {
            uz: '',
            ru: '',
        },
    });

    useEffect(() => {
        if (isOpen && education) {
            console.log('Текущие данные образования:', education);

            // Проверка структуры данных
            const institutionIsObject = typeof education.institution === 'object';
            const qualificationIsObject = typeof education.qualification === 'object';

            setFormData({
                id: education.id,
                startYear: education.startYear,
                finishYear: education.finishYear,
                institution: institutionIsObject
                    ? {
                        uz: education.institution.uz || '',
                        ru: education.institution.ru || '',
                    }
                    : {
                        uz: '',
                        ru: '',
                    },
                qualification: qualificationIsObject
                    ? {
                        uz: education.qualification.uz || '',
                        ru: education.qualification.ru || '',
                    }
                    : {
                        uz: '',
                        ru: '',
                    },
            });
        }
    }, [isOpen, education]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [field, lang] = name.split('.'); // Например, institution.uz

        if (lang) {
            setFormData((prev) => ({
                ...prev,
                [field]: {
                    ...prev[field],
                    [lang]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-[1235px] p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4">
                    <Image src={closeIcon} alt="Закрыть" width={24} height={24} />
                </button>
                <h2 className="text-[30px] font-bold mb-[40px] border-b pb-[32px]">{t.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='flex gap-[12px] w-full'>
                        <div className="flex flex-col w-full">
                            <label className='text-[#A6A6A6]'>{t.startYear}</label>
                            <input
                                type="text"
                                name="startYear"
                                value={formData.startYear}
                                onChange={handleChange}
                                required
                                className="border p-4 rounded-[10px] text-[#010101]"
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className='text-[#A6A6A6]'>{t.finishYear}</label>
                            <input
                                type="text"
                                name="finishYear"
                                value={formData.finishYear}
                                onChange={handleChange}
                                required
                                className="border p-4 rounded-[10px] text-[#010101]"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className='text-[#A6A6A6]'>{t.institution} (UZ)</label>
                        <input
                            type="text"
                            name="institution.uz"
                            value={formData.institution.uz}
                            onChange={handleChange}
                            required
                            className="border p-4 rounded-[10px] text-[#010101]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className='text-[#A6A6A6]'>{t.institution} (RU)</label>
                        <input
                            type="text"
                            name="institution.ru"
                            value={formData.institution.ru}
                            onChange={handleChange}
                            required
                            className="border p-4 rounded-[10px] text-[#010101]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className='text-[#A6A6A6]'>{t.qualification} (UZ)</label>
                        <input
                            type="text"
                            name="qualification.uz"
                            value={formData.qualification.uz}
                            onChange={handleChange}
                            required
                            className="border p-4 rounded-[10px] text-[#010101]"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className='text-[#A6A6A6]'>{t.qualification} (RU)</label>
                        <input
                            type="text"
                            name="qualification.ru"
                            value={formData.qualification.ru}
                            onChange={handleChange}
                            required
                            className="border p-4 rounded-[10px] text-[#010101]"
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-[65px] py-3 bg-gray-300 hover:bg-gray-400"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="px-[65px] py-3 bg-[#00863E] text-white hover:bg-green-700"
                        >
                            {t.save}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEditEducation;
