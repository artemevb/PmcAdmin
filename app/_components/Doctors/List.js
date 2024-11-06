'use client'
// import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import NewCardMain from '../Main/NewCardMain'

import Image from "next/image";
import Doctor1 from "@/public/images/Main/slieder1.png";
import Doctor2 from "@/public/images/Main/slider2.png";
import plus from "@/public/svg/plus-white.svg";
import plus_green from "@/public/svg/plus-green.svg";

export default function List() {
    const params = useParams()
    const [news, setNews] = useState([]) // Состояние для новостей
    const [loading, setLoading] = useState(true) // Состояние загрузки
    const [error, setError] = useState(null) // Состояние ошибки

    const data = [
        {
            slug: 'news-1',
            title: 'Муминов Хусниёрбек Мухсинжон угли',
            date: '27.2.2024',
            imageSrc: Doctor1,
        },
        {
            slug: 'news-2',
            title: 'Кодирова Мухайе Лукмоновна',
            date: '28.2.2024',
            imageSrc: Doctor2,
        },
        {
            slug: 'news-3',
            title: 'Муминов Хусниёрбек Мухсинжон угли',
            date: '29.2.2024',
            imageSrc: Doctor1,
        },
        {
            slug: 'news-4',
            title: 'Кодирова Мухайе Лукмоновна',
            date: '1.3.2024',
            imageSrc: Doctor2,
        },
        {
            slug: 'news-5',
            title: 'Кодирова Мухайе Лукмоновна',
            date: '1.3.2024',
            imageSrc: Doctor2,
        },
    ];

    // if (loading) return <div>Загрузка...</div>
    // if (error) return <div>{error}</div> 

    return (
        <div className='w-full max-w-[1440px] 5xl:max-w-[2000px] mx-auto px-3 flex flex-col mb-[90px] mdx:mb-[120px] 2xl:mb-[150px]'>
            <div className='flex justify-between items-center'>
                <h2 className='text-[30px] mdx:text-[40px] mdl:text-[43px] xl:text-[50px] font-semibold'>
                    Врачи
                </h2>
                <button className='bg-[#00863E] text-[#ffff] h-[50px] w-[223px] text-[16px] font-extrabold flex items-center justify-center gap-[8px] hover:bg-[#27a361]'>
                    Добавить врача
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
            <div className='w-full grid gap-y-[30px] gap-x-[14px] grid-cols-1 mdl:grid-cols-2 xl:grid-cols-4 h-auto mt-[35px] xl:mt-[55px]'>
                {data.map((item, i) => (
                    <a key={i} href={`/doctors/Main`}>
                        <NewCardMain
                            title={item.title}
                            date={item.date}
                            imageSrc={item.imageSrc}
                        />
                    </a>
                ))}
                <button className='h-[524px] w-auto border-[2px] border-dashed border-[#00863E] hover:border-[#2dbd70] flex flex-col-reverse items-center justify-center text-[22px] font-semibold text-[#00863E] hover:text-[#27a361]'>
                    Добавить врача
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

