'use client'

import newsPhoto from '@/public/images/News/image-full.png'
import Image from 'next/image'
// import axios from 'axios'
// import { useParams } from 'next/navigation'
// import { useEffect, useState } from 'react'
import NewCardNavoptions from '../NewsMain/NewCardNavoptions'


const mockNews = {
    createdDate: '2024-04-25',
    head: {
        heading: 'Лето и аллергия',
        photo: {
            url: '/images/News/image-full.png', // Ensure this path is correct or use `newsPhoto` as a fallback
        },
    },
    newOptions: [
        {
            heading: '',
            text: '🌾 Пыльцевая аллергия, или поллиноз - широко распространенное заболевание, связанное с реакцией иммунной системой человека на пыльцу некоторых видов растений, и проявляющаяся обычно в форме аллергического ринита и конъюнктивита, аллергического кашля или даже астмы \n\nВысокий уровень аллергических реакций в летние месяцы вызван повышенным содержанием пыльцы в воздухе, особенно от цветущих растений.',

        },
        {
            heading: '🐝 Пчелиные укусы',
            text: 'Валлергические реакции, включая анафилаксию. Избегайте мест, где вас могут укусить осы, пчелы, шершни – за городом их намного больше, чем в городе. Помните, что насекомых привлекают цветущие растения с сильным запахом, а также – некоторые парфюмерные ароматы',

        },
        {
            heading: '🪰 Укусы комаров',
            text: 'Комары являются распространенными насекомыми, вызывающими аллергические реакции. Укусы комаров могут привести к зуду, отечности и дискомфорту. Регулярное использование репеллентов и защитной одежды может помочь предотвратить укусы комаров',

        },
        {
            heading: '🪳 Аллергия на клещей',
            text: 'Укусы клещей могут привести к развитию аллергии на их секреты. Это может вызывать кожную сыпь, зуд и аллергический дерматит. После посещения лесных или высокотравных мест рекомендуется тщательно проверять тело на наличие клещей',

        },
    ],
}

// Mock data for `news1`
const mockNews1 = [
    {
        slug: 'sample-news-1',
        head: {
            heading: 'Кишечные инфекции у детей ',
            text: 'Пыльцевая аллергия, или поллиноз - широко распространенное заболевание, связанное с реакцией иммунной системой человека на пыльцу некоторых видов растений, и проявляющаяся обычно в форме аллергического ринита и конъюнктивита, аллергического кашля или даже астмы \n\nВысокий уровень аллергических реакций в летние месяцы вызван повышенным содержанием пыльцы в воздухе, особенно от цветущих растений.оохранения, которая затрагивает миллионы маленьких пациентов каждый год',
        },
    },
    {
        slug: 'sample-news-2',
        head: {
            heading: 'Мужское здоровье',
            text: '5 ключевых гормональных анализов, которые нужно сдавать ежегодно!',
        },
    },
    {
        slug: 'sample-news-3',
        head: {
            heading: 'Влияние бактерий на настроение',
            text: 'Если посчитать все клетки вашего организма, то только 43% из них будут человеческими.',
        },
    },
    {
        slug: 'sample-news-4',
        head: {
            heading: 'Related News 4',
            text: 'Brief description of related news 4.',
        },
    },
]

export default function MainPages() {

    // Replace API states with mock data
    // const [news, setNews] = useState(null)
    // const [news1, setNews1] = useState([])
    const news = mockNews
    const news1 = mockNews1

    // const { slug } = useParams()

    // Commented out API calls
    /*
    useEffect(() => {
      const fetchNewsWithSlug = async () => {
        try {
          const response = await axios.get(
            `https://imed.uz/api/v1/new/get/${slug}`,
            {
              headers: { 'Accept-Language': lng },
            }
          )
          setNews(response.data.data)
        } catch (error) {
          console.error('Failed to fetch news:', error.message)
          setNews(null) // Reset state if fetching fails
        }
      }
      fetchNewsWithSlug()
    }, [lng, slug])
  
    useEffect(() => {
      const fetchNews = async () => {
        try {
          const response = await axios.get(
            `https://imed.uz/api/v1/new/get-all`,
            {
              headers: { 'Accept-Language': lng },
            }
          )
          setNews1(response.data.data)
        } catch (error) {
          console.error('Failed to fetch news:', error.message)
        }
      }
  
      fetchNews()
    }, [lng])
    */

    const formatTextWithNewlines = (text) => {
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ))
    }

    const slicedData = Array.isArray(news1) ? news1.slice(0, 3) : []
    // Since we're using mock data, no need for loading state
    // if (!news) return <div>Loading...</div> // Loading state or error handling

    return (
        <div className="w-full max-w-[1440px] mx-auto flex gap-6 3xl:gap-[50px] max-3xl:px-4">
            {/* Main news content */}
            <div className="w-full 2xl:max-w-[1035px]">
                <div className="mt-4">
                    {news.createdDate && (
                        <p className="font-medium text-[16px] mdx:text-[18px] xl:text-[20px] text-[#00863E]">
                            {new Date(news.createdDate).toLocaleDateString( {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    )}
                    {news.head?.heading && (
                        <h1 className="text-[25px] font-bold text-black mb-2 mdx:text-[35px] xl:text-[40px] 2xl:text-[50px] leading-[1.10] mt-2">
                            {formatTextWithNewlines(news.head.heading)}
                        </h1>
                    )}
                </div>

                {news.head?.photo?.url && (
                    <div className="w-full max-xl:my-[25px] xl:mt-7 xl:mb-[40px] flex flex-row justify-center">
                        <Image
                            src={news.head.photo.url || newsPhoto} // Use fallback if no image URL
                            width={1000}
                            height={1000}
                            quality={100}
                            alt={`News Image`}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                {/* Rendering newOptions array */}
                {news.newOptions?.map((item, index) => (
                    <div className="mt-[35px] xl:mt-[70px]" key={index}>
                        {item.heading && (
                            <h3 className="text-[20px] mdx:text-[26px] font-bold text-[#252324]">
                                {formatTextWithNewlines(item.heading)}
                            </h3>
                        )}
                        {item.text && (
                            <ol>
                                <li className="text-[15px] mdx:text-[20px] py-[15px] font-semibold text-[#333333]">
                                    {formatTextWithNewlines(item.text)}
                                </li>
                            </ol>
                        )}
                        {item.photo?.url && (
                            <div className="mt-[30px] mb-[10px] flex flex-row justify-center">
                                <Image
                                    src={item.photo.url} // Use item photo if available
                                    width={500}
                                    height={500}
                                    quality={100}
                                    alt={`News Image`}
                                    className="w-full h-auto max-w-[832px] max-h-[450px] 5xl:max-w-[1000px] object-cover rounded-xl"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
