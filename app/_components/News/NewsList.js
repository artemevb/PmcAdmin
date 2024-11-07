'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NewCardMain from '../News/NewCardMain'
import plus from "@/public/svg/plus-white.svg";
import plus_green from "@/public/svg/plus-green.svg";
import Image from "next/image";

export default function NewsComp() {
    const router = useRouter()
    // Инициализируем локаль из состояния или локального хранилища
    const [locale, setLocale] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('locale') || 'ru'
        }
        return 'ru'
    })

    const [news, setNews] = useState([]) // Состояние для новостей
    const [loading, setLoading] = useState(true) // Состояние загрузки
    const [error, setError] = useState(null) // Состояние ошибки

    // Функция для загрузки данных с учетом локали
    const fetchNews = async (currentLocale) => {
        try {
            const response = await axios.get(`https://pmc.result-me.uz/v1/newness/get-all`, {
                headers: {
                    'Accept-Language': currentLocale // Устанавливаем язык запроса
                }
            })
            setNews(response.data.data) // Обновляем состояние news с полученными данными
            setLoading(false) // Сбрасываем состояние загрузки
            console.log('Accept-Language:', currentLocale) // Выводим текущий язык в консоль
        } catch (err) {
            setError(currentLocale === 'ru' ? "Ошибка при загрузке новостей." : "Yangiliklarni yuklashda xato yuz berdi.") // Обработка ошибки на основе локали
            setLoading(false)
        }
    }

    // Запуск fetchNews при монтировании компонента и смене локали
    useEffect(() => {
        setLoading(true)
        setError(null)
        fetchNews(locale)
    }, [locale])

    // Функция для переключения локали
    const switchLocale = (newLocale) => {
        if (newLocale === locale) return // Не делаем ничего, если выбранная локаль уже активна
        setLocale(newLocale) // Обновляем локаль в состоянии
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale) // Сохраняем выбранную локаль в локальное хранилище
        }
    }

    if (loading) return <div className='text-center'>{locale === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...'}</div> // Индикатор загрузки на основе локали
    if (error) return <div className='text-center text-red-500'>{error}</div> // Сообщение об ошибке

    return (
        <div className='w-full max-w-[1440px] mx-auto px-2 flex flex-col gap-8 mb-[90px] mdx:mb-[150px] 2xl:mb-[190px]'>
            {/* Header Section with Title and Locale Switcher */}
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                <h2 className='text-[30px] mdx:text-[40px] mdl:text-[43px] xl:text-[50px] font-semibold'>
                    {locale === 'ru' ? 'Новости' : 'Yangiliklar'}
                </h2>
                
                {/* Locale Switcher Buttons */}
                <div className='flex gap-2'>
                    <button
                        onClick={() => switchLocale('ru')}
                        className={`px-4 py-2 rounded ${
                            locale === 'ru' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Русский
                    </button>
                    <button
                        onClick={() => switchLocale('uz')}
                        className={`px-4 py-2 rounded ${
                            locale === 'uz' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        O'zbek
                    </button>
                </div>

                {/* Add News Button */}
                <button className='bg-[#00863E] text-[#ffff] h-[50px] w-[223px] text-[16px] font-extrabold flex items-center justify-center gap-[8px] hover:bg-[#27a361]'>
                    {locale === 'ru' ? 'Добавить новость' : 'Yangilik qo\'shish'}
                    <Image
                        src={plus}
                        width={28}
                        height={28}
                        quality={100}
                        alt={locale === 'ru' ? 'Добавить новость' : 'Yangilik qo\'shish'}
                        className="w-full h-auto object-cover max-w-[28px]"
                    />
                </button>
            </div>

            {/* News Grid */}
            <div className='w-full grid gap-y-[35px] mdx:gap-y-[45px] xl:gap-y-[55px] gap-x-4 grid-cols-1 mdl:grid-cols-2 xl:grid-cols-4 h-auto'>
                {news.map((item) => (
                    <a key={item.id} href={`/news/${item.slug}`}>
                        <NewCardMain
                            title={item.optionList[0]?.title || (locale === 'ru' ? 'Заголовок отсутствует' : 'Sarlavha mavjud emas')}
                            subtitle={item.optionList[0]?.body || (locale === 'ru' ? 'Описание отсутствует' : 'Tavsif mavjud emas')}
                            date={new Date(item.createdDate).toLocaleDateString(locale === 'ru' ? "ru-RU" : "uz-UZ")}
                            imageSrc={item.optionList[0]?.photo?.url || "/default-image.png"}
                        />
                    </a>
                ))}

                {/* Add News Placeholder */}
                <button className='h-[344px] w-auto border-[2px] border-dashed border-[#00863E] hover:border-[#2dbd70] flex flex-col-reverse items-center justify-center text-[22px] font-semibold text-[#00863E] hover:text-[#27a361]'>
                    {locale === 'ru' ? 'Добавить новость' : 'Yangilik qo\'shish'}
                    <Image
                        src={plus_green}
                        width={28}
                        height={28}
                        quality={100}
                        alt={locale === 'ru' ? 'Добавить новость' : 'Yangilik qo\'shish'}
                        className="w-full h-auto object-cover max-w-[28px]"
                    />
                </button>
            </div>
        </div>
    )
}
