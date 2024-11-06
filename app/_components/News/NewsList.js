'use client'

import newsPhoto from '@/public/images/News/image.png'
import newsPhoto2 from '@/public/images/News/image2.png'
// import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import NewCardMain from '../News/NewCardMain'
import plus from "@/public/svg/plus-white.svg";
import plus_green from "@/public/svg/plus-green.svg";
import Image from "next/image";

export default function NewsComp() {
    const params = useParams()
    const [news, setNews] = useState([]) // State for news
    const [loading, setLoading] = useState(false) // Loading state
    const [error, setError] = useState(null) // Error state

    // Temporary data
    const temporaryNews = [
        {
            slug: 'news-1',
            head: {
                title: `Мужское здоровье`,
                heading: 'Заголовок новости 1',
                date: 'Дата новости 1',
                photo: { url: newsPhoto },
            },
        },
        {
            slug: 'news-2',
            head: {
                title: `Мужское здоровье`,
                heading: 'Заголовок новости 2',
                date: 'Дата новости 2',
                photo: { url: newsPhoto2 },
            },
        },
        {
            slug: 'news-3',
            head: {
                title: `Мужское здоровье`,
                heading: 'Заголовок новости 3',
                date: 'Дата новости 3',
                photo: { url: newsPhoto },
            },
        },
        {
            slug: 'news-4',
            head: {
                title: `Аллергия летом`,
                heading: 'Заголовок новости 4',
                date: 'Дата новости 4',
                photo: { url: newsPhoto2 },
            },
        },
        {
            slug: 'news-5',
            head: {
                title: `Здоровье осенью`,
                heading: 'Заголовок новости 5',
                date: 'Дата новости 5',
                photo: { url: newsPhoto },
            },
        },
        {
            slug: 'news-6',
            head: {
                title: `Продукты для иммунитета`,
                heading: 'Заголовок новости 6',
                date: 'Дата новости 6',
                photo: { url: newsPhoto2 },
            },
        },
        {
            slug: 'news-7',
            head: {
                title: `Как бороться с гриппом`,
                heading: 'Заголовок новости 7',
                date: 'Дата новости 7',
                photo: { url: newsPhoto },
            },
        },
        {
            slug: 'news-8',
            head: {
                title: `Мужское здоровье`,
                heading: 'Заголовок новости 8',
                date: 'Дата новости 8',
                photo: { url: newsPhoto2 },
            },
        },
        {
            slug: 'news-9',
            head: {
                title: `Профилактика инфекций`,
                heading: 'Заголовок новости 9',
                date: 'Дата новости 9',
                photo: { url: newsPhoto },
            },
        },
        {
            slug: 'news-10',
            head: {
                title: `Советы по здоровью`,
                heading: 'Заголовок новости 10',
                date: 'Дата новости 10',
                photo: { url: newsPhoto2 },
            },
        },
    ]

    // Using temporary data
    useEffect(() => {
        setNews(temporaryNews)
    }, [])

    const loadMoreNews = () => {
        setVisibleNewsCount(prevCount => prevCount + 8); // Show 8 more news items
    }

    if (loading) return <div>Загрузка...</div> // Loading indicator
    if (error) return <div>{error}</div> // Error message

    return (
        <div className='w-full max-w-[1440px] mx-auto px-2 flex flex-col gap-8 mb-[90px] mdx:mb-[150px] 2xl:mb-[190px]'>
            <div className='flex justify-between items-center'>
                <h2 className='text-[30px] mdx:text-[40px] mdl:text-[43px] xl:text-[50px] font-semibold'>
                    Новости
                </h2>
                <button className='bg-[#00863E] text-[#ffff] h-[50px] w-[223px] text-[16px] font-extrabold flex items-center justify-center gap-[8px] hover:bg-[#27a361]'>
                    Добавить новость
                    <Image
                        src={plus}
                        width={28}
                        height={28}
                        quality={100}
                        alt={`jam_medical Image `}
                        className="w-full h-auto object-cover max-w-[28px]"
                    />
                </button>
            </div>
            <div className='w-full grid gap-y-[35px] mdx:gap-y-[45px] xl:gap-y-[55px] gap-x-4 grid-cols-1 mdl:grid-cols-2 xl:grid-cols-4 h-auto'>
                {news.map((item, i) => (
                    <a key={i} href={`/news/Main`}>
                        <NewCardMain
                            title={item.head.title}
                            subtitle={item.head.heading}
                            date={item.head.date}
                            imageSrc={item.head.photo?.url || newsPhoto}
                        />
                    </a>
                    //     <a key={i} href={`/${locale}/news/${item.slug}`}>
                    //     <NewCardMain
                    //         title={item.head.title}
                    //         subtitle={item.head.heading}
                    //         date={item.head.date}
                    //         imageSrc={item.head.photo?.url || newsPhoto} 
                    //     />
                    // </a>
                ))}
                <button className='h-[344px] w-auto border-[2px] border-dashed border-[#00863E] hover:border-[#2dbd70] flex flex-col-reverse items-center justify-center text-[22px] font-semibold text-[#00863E] hover:text-[#27a361]'>
                    Добавить новость
                    <Image
                        src={plus_green}
                        width={28}
                        height={28}
                        quality={100}
                        alt={`jam_medical Image `}
                        className="w-full h-auto object-cover max-w-[28px]"
                    />
                </button>
            </div>
        </div>
    )
}
