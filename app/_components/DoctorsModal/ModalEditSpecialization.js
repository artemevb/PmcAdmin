'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import close_icon from '@/public/svg/close-black-bold.svg'; // Replace with your close icon

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
            <div className="bg-white w-full max-w-[1235px] p-[31px] relative">
                <button
                    className="absolute top-7 right-6"
                    onClick={onClose}
                >
                    <Image src={close_icon} alt="Close" width={40} height={40} />
                </button>
                <h2 className="text-[30px] font-bold mb-4 border-b pb-[32px]">Редактировать Специализации</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-1 text-[#A6A6A6]">Название (RU)</label>
                        <input
                            type="text"
                            value={nameUz}
                            onChange={(e) => setNameUz(e.target.value)}
                            required
                            className="w-full border px-3 py-4 rounded-[10px] text-[#010101]"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-[#A6A6A6]">Название (RU)</label>
                        <input
                            type="text"
                            value={nameRu}
                            onChange={(e) => setNameRu(e.target.value)}
                            required
                            className="w-full border px-3 py-4 rounded-[10px] text-[#010101]"
                        />
                    </div>
                    <div className="flex justify-end gap-4 mt-[40px]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-[65px] py-3 bg-gray-300 hover:bg-gray-400"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-[65px] py-3 bg-[#00863E] text-white hover:bg-green-700"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
