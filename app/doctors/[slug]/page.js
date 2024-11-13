// app/doctors/[slug]/page.jsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Main_info from "../../_components/Doctors/Main";
import SkillsMain from "../../_components/Doctors/SkillsMain";
import ServiceMain from "../../_components/Doctors/ServiceMain";

// Translations for static texts
const translations = {
    ru: {
        switchToRu: 'Русский',
        switchToUz: "O'zbek",
        loading: 'Загрузка...',
        error: 'Вернитесь в главное меню и снова перейдите на эту страницу',
        doctorNotFound: 'Доктор не найден.',
    },
    uz: {
        switchToRu: 'Русский',
        switchToUz: "O'zbek",
        loading: 'Загрузка...',
        error: 'Вернитесь в главное меню и снова перейдите на эту страницу',
        doctorNotFound: 'Doktor topilmadi.',
    },
};

export default function DoctorPage() {
    const { slug } = useParams(); // Get slug from URL
    const [locale, setLocale] = useState('ru');
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const t = translations[locale];

    // Function to fetch doctor data
    const fetchDoctor = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://pmc.result-me.uz/v1/doctor/get/${slug}`, {
                headers: {
                    'Accept-Language': locale, // Set locale
                },
            });

            console.log('Fetched doctor data:', response.data); // Log the entire response

            if (response.data && response.data.data) {
                setDoctor(response.data.data);
                console.log('Doctor data set:', response.data.data); // Log the doctor data being set
            } else {
                setError(t.error);
                console.log('Error: ', t.error); // Log the error message
            }
        } catch (err) {
            console.error('Error fetching doctor data:', err);
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };

    // Initialize locale from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLocale = localStorage.getItem('locale');
            if (storedLocale && (storedLocale === 'ru' || storedLocale === 'uz')) {
                setLocale(storedLocale);
                console.log('Locale set from localStorage:', storedLocale); // Log the locale set
            }
        }
    }, []);

    // Fetch doctor data when slug or locale changes
    useEffect(() => {
        if (slug) {
            fetchDoctor();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, locale]);

    // Function to switch locale
    const switchLocale = (newLocale) => {
        if (newLocale === locale) return;
        setLocale(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale);
            console.log('Locale switched to:', newLocale); // Log locale switch
        }
    };

    // Functions for editing and deleting entries
    const handleEdit = (type, id) => {
        // Implemented in ServiceMain
    };

    const handleDelete = (type, id) => {
        // Implemented in ServiceMain
    };

    if (loading) return <div className='text-center'>{t.loading}</div>;
    if (error) return <div className='text-center text-red-500'>{t.error}</div>;
    if (!doctor) return <div className='text-center'>{t.doctorNotFound}</div>;

    console.log('Rendering DoctorPage with doctor data:', doctor); // Log before rendering

    return (
        <div className="w-full bg-white flex flex-col mt-[30px]">
            {/* Language Switch Buttons */}
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

            {/* Pass data to child components */}
            <Main_info
                doctor={doctor}
                locale={locale}
                fetchDoctor={fetchDoctor} // To refresh data after update
            />

            <SkillsMain
                doctorId={doctor.id}
                educationList={doctor.educationList}
                specializationList={doctor.specializationList}
                locale={locale}
                onEdit={handleEdit}
                onDelete={handleDelete}
                refreshDoctor={fetchDoctor} // Function to refresh data
            />

            <ServiceMain
                services={doctor.serviceOfDoctorList || []} // Ensure it's an array
                locale={locale}
                onEdit={handleEdit}
                onDelete={handleDelete}
                doctorId={doctor.id}
                refreshDoctor={fetchDoctor} // Function to refresh data
            />
        </div>
    );
}
