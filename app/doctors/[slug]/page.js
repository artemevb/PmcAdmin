// app/doctors/[slug]/page.jsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Main_info from "../../_components/Doctors/Main";
import SkillsMain from "../../_components/Doctors/SkillsMain";
import ServiceMain from "../../_components/Doctors/ServiceMain";

// Словари для локализации статических текстов
const translations = {
    ru: {
        switchToRu: 'Русский',
        switchToUz: "O'zbek",
        loading: 'Загрузка...',
        error: 'Ошибка при загрузке данных.',
    },
    uz: {
        switchToRu: 'Русский',
        switchToUz: "O'zbek",
        loading: 'Yuklanmoqda...',
        error: 'Ma\'lumotlarni yuklashda xato yuz berdi.',
    },
};

export default function DoctorPage() {
    const { slug } = useParams(); // Получение slug из URL
    const [locale, setLocale] = useState('ru');
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const t = translations[locale];

    // Функция для получения данных доктора
    const fetchDoctor = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://pmc.result-me.uz/v1/doctor/get/${slug}`, {
                headers: {
                    'Accept-Language': locale, // Установка локали
                },
            });

            if (response.data && response.data.data) {
                setDoctor(response.data.data);
            } else {
                setError(t.error);
            }
        } catch (err) {
            console.error(err);
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };

    // Инициализация локали из localStorage при монтировании
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLocale = localStorage.getItem('locale');
            if (storedLocale && (storedLocale === 'ru' || storedLocale === 'uz')) {
                setLocale(storedLocale);
            }
        }
    }, []);

    // Получение данных при изменении slug или locale
    useEffect(() => {
        if (slug) {
            fetchDoctor();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, locale]);

    // Функция для смены локали
    const switchLocale = (newLocale) => {
        if (newLocale === locale) return;
        setLocale(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale);
        }
    };

    // Функции для редактирования и удаления записей
    const handleEdit = (type, id) => {
        // type: 'education' или 'specialization' или 'service'
        // id: идентификатор записи (может быть undefined для добавления новой записи)
        // Реализуйте логику открытия модального окна редактирования
        alert(`Редактировать ${type} с id: ${id || 'новой записи'}`);
    };

    const handleDelete = (type, id) => {
        // type: 'education' или 'specialization' или 'service'
        // id: идентификатор записи
        // Реализуйте логику удаления записи
        if (confirm('Вы уверены, что хотите удалить эту запись?')) {
            // Здесь должна быть логика удаления через API
            alert(`Удалить ${type} с id: ${id}`);
        }
    };

    if (loading) return <div className='text-center'>{t.loading}</div>;
    if (error) return <div className='text-center text-red-500'>{t.error}</div>;
    if (!doctor) return <div className='text-center'>Доктор не найден.</div>;

    return (
        <div className="w-full bg-white flex flex-col mt-[30px]">
            {/* Кнопки Смены Языка */}
            <div className="flex justify-end gap-2 mb-4 px-4">
                <button
                    onClick={() => switchLocale('ru')}
                    className={`px-4 py-2 rounded ${locale === 'ru' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    {t.switchToRu}
                </button>
                <button
                    onClick={() => switchLocale('uz')}
                    className={`px-4 py-2 rounded ${locale === 'uz' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    {t.switchToUz}
                </button>
            </div>

            {/* Передача данных в дочерние компоненты */}
            <Main_info
                specializations={doctor.specializationList || []} // Устанавливаем пустой массив по умолчанию
                fullName={doctor.fullName}
                description={doctor.description}
                experience={doctor.experience}
                receptionTime={doctor.receptionTime}
                photo={doctor.photo?.url}
                locale={locale}
            />

            <SkillsMain
                doctorId={doctor.id} // Передача doctorId
                educationList={doctor.educationList}
                specializationList={doctor.specializationList}
                locale={locale}
                onEdit={handleEdit}
                onDelete={handleDelete}
                refreshDoctor={fetchDoctor} // Передача функции для обновления данных
            />
            <ServiceMain
                services={doctor.serviceOfDoctorList} // Передача serviceOfDoctorList как services
                locale={locale}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
