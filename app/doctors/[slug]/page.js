'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; 
import axios from 'axios';
import Main_info from "../../_components/Doctors/Main";
import SkillsMain from "../../_components/Doctors/SkillsMain";
import ServiceMain from "../../_components/Doctors/ServiceMain";

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
        doctorNotFound: 'Доктор не найден.',
    },
};

export default function DoctorPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [locale, setLocale] = useState('ru');
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const t = translations[locale];

    const fetchDoctor = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://api.pmc.dr-psixoterapevt.uz/v1/doctor/get/${slug}`, {
                headers: {
                    'Accept-Language': locale,
                },
            });

            console.log('Fetched doctor data:', response.data);

            if (response.data && response.data.data) {
                setDoctor(response.data.data);
                console.log('Doctor data set:', response.data.data);
            } else {
                setError(t.error);
                console.log('Error: ', t.error);
            }
        } catch (err) {
            console.error('Error fetching doctor data:', err);
            setError(t.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedLocale = localStorage.getItem('locale');
            if (storedLocale && (storedLocale === 'ru' || storedLocale === 'uz')) {
                setLocale(storedLocale);
                console.log('Locale set from localStorage:', storedLocale); 
            }
        }
    }, []);

    useEffect(() => {
        if (slug) {
            fetchDoctor();
        }
    }, [slug, locale]);

    const switchLocale = (newLocale) => {
        if (newLocale === locale) return;
        setLocale(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale);
            console.log('Locale switched to:', newLocale);
        }
    };

    const handleEdit = (type, id) => {

    };

    const handleDelete = (type, id) => {

    };

    if (loading) return <div className='text-center'>{t.loading}</div>;
    if (error) return <div className='text-center text-red-500'>{t.error}</div>;
    if (!doctor) return <div className='text-center'>{t.doctorNotFound}</div>;

    console.log('Rendering DoctorPage with doctor data:', doctor);

    return (
        <div className="w-full bg-white flex flex-col mt-[30px]">
            <div className="flex justify-between gap-2 mb-4 px-4">
                <div>
                    <button
                        onClick={() => router.back()}
                        className='text-[20px] text-[#00863E] font-bold hover:text-[#2c8d59]'
                    >
                        Назад
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => switchLocale('ru')}
                        className={`px-4 py-2 ${locale === 'ru' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {t.switchToRu}
                    </button>
                    <button
                        onClick={() => switchLocale('uz')}
                        className={`px-4 py-2 ${locale === 'uz' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {t.switchToUz}
                    </button>
                </div>
            </div>
            <Main_info
                doctor={doctor}
                locale={locale}
                fetchDoctor={fetchDoctor} 
            />

            <SkillsMain
                doctorId={doctor.id}
                educationList={doctor.educationList}
                specializationList={doctor.specializationList}
                locale={locale}
                onEdit={handleEdit}
                onDelete={handleDelete}
                refreshDoctor={fetchDoctor}
            />

            <ServiceMain
                services={doctor.serviceOfDoctorList || []}
                locale={locale}
                onEdit={handleEdit}
                onDelete={handleDelete}
                doctorId={doctor.id}
                refreshDoctor={fetchDoctor} 
            />
        </div>
    );
}

