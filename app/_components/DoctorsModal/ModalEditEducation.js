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
            institution: 'Учебное заведение',
            qualification: 'Квалификация',
            save: 'Сохранить',
            cancel: 'Отмена',
        },
        uz: {
            title: 'Ta\'limni tahrirlash',
            startYear: 'Boshlanish yili',
            finishYear: 'Tugash yili',
            institution: 'Ta\'lim muassasasi',
            qualification: 'Malaka',
            save: 'Saqlash',
            cancel: 'Bekor qilish',
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
            <div className="bg-white rounded-lg w-full max-w-[1235px] p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4">
                    <Image src={closeIcon} alt="Закрыть" width={24} height={24} />
                </button>
                <h2 className="text-2xl font-semibold mb-4">{t.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label>{t.startYear}</label>
                        <input
                            type="text"
                            name="startYear"
                            value={formData.startYear}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>{t.finishYear}</label>
                        <input
                            type="text"
                            name="finishYear"
                            value={formData.finishYear}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>{t.institution} (UZ)</label>
                        <input
                            type="text"
                            name="institution.uz"
                            value={formData.institution.uz}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>{t.institution} (RU)</label>
                        <input
                            type="text"
                            name="institution.ru"
                            value={formData.institution.ru}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>{t.qualification} (UZ)</label>
                        <input
                            type="text"
                            name="qualification.uz"
                            value={formData.qualification.uz}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label>{t.qualification} (RU)</label>
                        <input
                            type="text"
                            name="qualification.ru"
                            value={formData.qualification.ru}
                            onChange={handleChange}
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
