'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import Image from "next/image"
import NewCardMain from '../Main/NewCardMain'
import plus from "@/public/svg/plus-white.svg"
import plus_green from "@/public/svg/plus-green.svg"
import CreateDoctorModal from '../DoctorsModal/CreateDoctorModal' // Убедитесь, что путь верный

// Словари для локализации статических текстов
const translations = {
    ru: {
        addDoctor: 'Добавить врача',
        delete: 'Удалить',
        noName: 'Без имени',
        noSpecializations: 'Нет специализаций',
        loading: 'Загрузка...',
        receptionTime: 'Нет времени приема',
    },
    uz: {
        addDoctor: 'Добавить врача',
        delete: 'Удалить',
        noName: 'Без имени',
        noSpecializations: 'Нет специализаций',
        loading: 'Загрузка...',
        receptionTime: 'Нет времени приема',
    },
}

export default function DoctorsComp() {
    const [locale, setLocale] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('locale') || 'ru'
        }
        return 'ru'
    })

    const t = translations[locale]

    const [doctors, setDoctors] = useState([]) // Состояние для врачей
    const [loading, setLoading] = useState(true) // Состояние загрузки
    const [error, setError] = useState(null) // Состояние ошибки
    const [isModalOpen, setIsModalOpen] = useState(false) // Состояние модального окна

    // Функция для получения врачей на основе локали
    const fetchDoctors = async (currentLocale) => {
        try {
            const response = await axios.get('https://pmc.result-me.uz/v1/doctor/get-all', {
                headers: {
                    'Accept-Language': currentLocale // Установка языка запроса
                }
            })
            console.log('Полученные данные:', response.data.data) // Логирование полученных данных
            if (response.data && Array.isArray(response.data.data)) {
                setDoctors(response.data.data)
            } else {
                setError(t.noSpecializations)
            }
            setLoading(false)
        } catch (err) {
            setError("Ошибка при загрузке врачей.")
            setLoading(false)
        }
    }

    // Функция для удаления врача
    const deleteDoctor = async (id) => {
        try {
            await axios.delete(`https://pmc.result-me.uz/v1/doctor/delete/${id}`)
            setDoctors(doctors.filter(item => item.id !== id)) // Удаление удаленного врача из состояния
            alert('Врач успешно удален')
        } catch (err) {
            alert('Ошибка при удалении врача')
        }
    }

    // Получение врачей при монтировании компонента и при изменении локали
    useEffect(() => {
        console.log('Текущая локаль:', locale) // Логирование локали
        setLoading(true)
        setError(null)
        fetchDoctors(locale)
    }, [locale])

    // Логирование состояния doctors
    useEffect(() => {
        console.log('Состояние doctors:', doctors)
    }, [doctors])

    // Функция для смены локали
    const switchLocale = (newLocale) => {
        if (newLocale === locale) return
        setLocale(newLocale)
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale.trim().toLowerCase()) // Удаление пробелов и приведение к нижнему регистру
        }
    }

    if (loading) return <div className='text-center'>{t.loading}</div>
    if (error) return <div className='text-center text-red-500'>{error}</div>

    return (
        <div className='w-full max-w-[1440px] mx-auto flex flex-col gap-8 mb-[90px] mdx:mb-[150px] 2xl:mb-[190px] px-3'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                <h2 className='text-[30px] mdx:text-[40px] mdl:text-[43px] xl:text-[50px] font-bold'>
                    {'Врачи'}
                </h2>
                <div className='flex gap-2'>
                    <button
                        onClick={() => switchLocale('ru')}
                        className={`px-4 py-2 ${locale === 'ru' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Русский
                    </button>
                    <button
                        onClick={() => switchLocale('uz')}
                        className={`px-4 py-2 ${locale === 'uz' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        O'zbek
                    </button>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='bg-[#00863E] text-[#ffff] h-[50px] w-[223px] text-[16px] font-extrabold flex items-center justify-center gap-[8px] hover:bg-[#27a361]'
                >
                    {t.addDoctor}
                    <Image
                        src={plus}
                        width={28}
                        height={28}
                        quality={100}
                        alt={t.addDoctor}
                        className="w-full h-auto object-cover max-w-[28px]"
                    />
                </button>
            </div>

            <div className='w-full grid gap-y-[30px] gap-x-[14px] grid-cols-1 mdl:grid-cols-2 xl:grid-cols-4 h-auto '>
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="relative">
                        <a href={`/doctors/${doctor.slug}`}>
                            <NewCardMain
                                title={doctor.fullName || t.noName}
                                imageSrc={doctor.photo?.url || '/images/default-image.png'}
                                specializationList={
                                    doctor.specializationList?.length > 0
                                        ? doctor.specializationList.map(spec => {
                                            if (typeof spec.name === 'object') {
                                                // Если name - объект, выбираем значение по текущей локали
                                                return spec.name[locale] || t.noSpecializations
                                            }
                                            // Если name - строка, используем её напрямую
                                            return spec.name
                                        })
                                        : []
                                }
                            />
                        </a>
                        <button
                            onClick={() => deleteDoctor(doctor.id)}
                            className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 hover:bg-red-700'
                        >
                            {t.delete}
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => setIsModalOpen(true)}
                    className='h-full min-h-[508px] w-auto border-[2px] border-dashed border-[#00863E] hover:border-[#2dbd70] flex flex-col-reverse items-center justify-center text-[22px] font-semibold text-[#00863E] hover:text-[#27a361]'
                >
                    {t.addDoctor}
                    <Image
                        src={plus_green}
                        width={28}
                        height={28}
                        quality={100}
                        alt={t.addDoctor}
                        className="w-full h-auto object-cover max-w-[28px]"
                    />
                </button>
            </div>

            {isModalOpen && (
                <CreateDoctorModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(newDoctor) => {
                        setDoctors([newDoctor, ...doctors])
                        setIsModalOpen(false)
                    }}
                    locale={locale}
                />
            )}
        </div>
    )
}
