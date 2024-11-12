'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import close_icon from '@/public/svg/close_green.svg'; // Replace with your close icon

const translations = {
    ru: {
        editSpecialization: 'Редактировать специализацию',
        nameUz: 'Название (UZ)',
        nameRu: 'Название (RU)',
        save: 'Сохранить',
        cancel: 'Отмена',
        errorSaving: 'Ошибка при сохранении специализации',
    },
    ru: {
        editSpecialization: 'Редактировать специализацию',
        nameUz: 'Название (UZ)',
        nameRu: 'Название (RU)',
        save: 'Сохранить',
        cancel: 'Отмена',
        errorSaving: 'Ошибка при сохранении специализации',
    },
};

export default function ModalEditSpecialization({ isOpen, onClose, onSave, specialization, locale }) {
    const [nameUz, setNameUz] = useState('');
    const [nameRu, setNameRu] = useState('');
    const t = translations[locale];

    useEffect(() => {
        if (specialization) {
            setNameUz(specialization.name.uz);
            setNameRu(specialization.name.ru);
        }
    }, [specialization]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: specialization.id,
            name: {
                uz: nameUz,
                ru: nameRu,
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button
                    className="absolute top-4 right-4"
                    onClick={onClose}
                >
                    <Image src={close_icon} alt="Close" width={20} height={20} />
                </button>
                <h2 className="text-xl font-semibold mb-4">{t.editSpecialization}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1">{t.nameUz}</label>
                        <input
                            type="text"
                            value={nameUz}
                            onChange={(e) => setNameUz(e.target.value)}
                            required
                            className="w-full border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">{t.nameRu}</label>
                        <input
                            type="text"
                            value={nameRu}
                            onChange={(e) => setNameRu(e.target.value)}
                            required
                            className="w-full border px-3 py-2 rounded"
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
}
