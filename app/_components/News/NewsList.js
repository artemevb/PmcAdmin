'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NewCardMain from '../News/NewCardMain'
import plus from "@/public/svg/plus-white.svg";
import plus_green from "@/public/svg/plus-green.svg";
import Image from "next/image";
import CreateNewsModal from './CreateNewsModal' // Импорт обновленного модального окна

export default function NewsComp() {
    const router = useRouter()
    const [locale, setLocale] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('locale') || 'ru'
        }
        return 'ru'
    })

    const [news, setNews] = useState([]) // State для новостей
    const [loading, setLoading] = useState(true) // Состояние загрузки
    const [error, setError] = useState(null) // Состояние ошибки
    const [isModalOpen, setIsModalOpen] = useState(false) // Состояние модального окна

    // Функция для получения новостей на основе локали
    const fetchNews = async (currentLocale) => {
        try {
            const response = await axios.get('https://pmc.result-me.uz/v1/newness/get-all', {
                headers: {
                    'Accept-Language': currentLocale // Установка языка запроса
                }
            })
            setNews(response.data.data) // Обновление состояния новостей с полученными данными
            setLoading(false) // Сброс состояния загрузки
        } catch (err) {
            setError(currentLocale === 'ru' ? "Ошибка при загрузке новостей." : "Yangiliklarni yuklashda xato yuz berdi.")
            setLoading(false)
        }
    }

    // Функция для удаления новости
    const deleteNews = async (id) => {
        try {
            await axios.delete(`https://pmc.result-me.uz/v1/newness/delete/${id}`)
            setNews(news.filter(item => item.id !== id)) // Удаление удаленной новости из состояния
            alert(locale === 'ru' ? 'Новость удалена успешно' : 'Yangilik muvaffaqiyatli o\'chirildi')
        } catch (err) {
            alert(locale === 'ru' ? 'Ошибка при удалении новости' : 'Yangilikni o\'chirishda xato yuz berdi')
        }
    }

    // Получение новостей при монтировании компонента и при изменении локали
    useEffect(() => {
        setLoading(true)
        setError(null)
        fetchNews(locale)
    }, [locale])

    // Функция для смены локали
    const switchLocale = (newLocale) => {
        if (newLocale === locale) return
        setLocale(newLocale)
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale)
        }
    }

    if (loading) return <div className='text-center'>{'Загрузка...'}</div>
    if (error) return <div className='text-center text-red-500'>{error}</div>

    return (
        <div className='w-full max-w-[1440px] mx-auto flex flex-col gap-8 mb-[90px] mdx:mb-[150px] 2xl:mb-[190px]'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                <h2 className='text-[30px] mdx:text-[40px] mdl:text-[43px] xl:text-[50px] font-semibold'>
                    {locale === 'ru' ? 'Новости' : 'Yangiliklar'}
                </h2>
                <div className='flex gap-2'>
                    <button
                        onClick={() => switchLocale('ru')}
                        className={`px-4 py-2 rounded ${locale === 'ru' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        Русский
                    </button>
                    <button
                        onClick={() => switchLocale('uz')}
                        className={`px-4 py-2 rounded ${locale === 'uz' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        O'zbek
                    </button>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='bg-[#00863E] text-[#ffff] h-[50px] w-[223px] text-[16px] font-extrabold flex items-center justify-center gap-[8px] hover:bg-[#27a361]'
                >
                    {locale === 'ru' ? 'Добавить новость' : 'Yangilik qo\'shish'}
                    <Image
                        src={plus}
                        width={28}
                        height={28}
                        quality={100}
                        alt={'Добавить новость'}
                        className="w-full h-auto object-cover max-w-[28px]"
                    />
                </button>
            </div>

            <div className='w-full grid gap-y-[35px] mdx:gap-y-[45px] xl:gap-y-[55px] gap-x-4 grid-cols-1 mdl:grid-cols-2 xl:grid-cols-4 h-auto'>
                {news.map((item) => (
                    <div key={item.id} className="relative">
                        <a href={`/news/${item.slug}`}>
                            <NewCardMain
                                title={
                                    typeof item.optionList[0]?.title === 'string' 
                                        ? item.optionList[0]?.title 
                                        : (locale === 'ru' ? 'Заголовок отсутствует' : 'Sarlavha mavjud emas')
                                }
                                subtitle={
                                    typeof item.optionList[0]?.body === 'string' 
                                        ? item.optionList[0]?.body 
                                        : (locale === 'ru' ? 'Описание отсутствует' : 'Tavsif mavjud emas')
                                }
                                date={new Date(item.createdDate).toLocaleDateString(locale === 'ru' ? "ru-RU" : "uz-UZ")}
                                imageSrc={item.optionList[0]?.photo?.url || "/default-image.png"}
                            />
                        </a>
                        <button
                            onClick={() => deleteNews(item.id)}
                            className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 hover:bg-red-700'
                        >
                            {locale === 'ru' ? 'Удалить новость' : 'Yangilikni o\'chirish'}
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => setIsModalOpen(true)}
                    className='h-[344px] w-auto border-[2px] border-dashed border-[#00863E] hover:border-[#2dbd70] flex flex-col-reverse items-center justify-center text-[22px] font-semibold text-[#00863E] hover:text-[#27a361]'
                >
                    {locale === 'ru' ? 'Добавить новость' : 'Yangilik qo\'shish'}
                    <Image
                        src={plus_green}
                        width={28}
                        height={28}
                        quality={100}
                        alt={'Добавить новость'}
                        className="w-full h-auto object-cover max-w-[28px]"
                    />
                </button>
            </div>

            {isModalOpen && (
                <CreateNewsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(newNews) => {
                        setNews([newNews, ...news])
                        setIsModalOpen(false)
                    }}
                    locale={locale}
                />
            )}
        </div>
    )
}
