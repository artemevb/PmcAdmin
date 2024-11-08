'use client'

import { useEffect, useState } from 'react'
import Image from "next/image";
import plus_green from "@/public/svg/plus-green.svg";
import axios from 'axios'
import { useParams } from 'next/navigation'
import EditBlockModal from './EditBlockModal' // Импорт модального окна

// Функция для форматирования текста с переносами строк
const formatTextWithNewlines = (text) => {
    if (typeof text === 'object') {
        // Если текст разделен по локалям
        return Object.keys(text).map((lang, index) => (
            <span key={index}>
                {text[lang]}
                <br />
            </span>
        ));
    }
    return text.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
};

export default function MainPages() {
    const { slug } = useParams(); // Динамические маршруты
    const [locale, setLocale] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('locale') || 'ru';
        }
        return 'ru';
    });
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [updateStatus, setUpdateStatus] = useState({ success: null, message: '' }); // Для обратной связи

    const switchLocale = (newLocale) => {
        if (newLocale === locale) return;
        setLocale(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale);
        }
    };

    useEffect(() => {
        if (!slug) return;

        const fetchNews = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`https://pmc.result-me.uz/v1/newness/get/${slug}`, {
                    headers: { 'Accept-Language': locale },
                });
                const data = response.data.data;
                console.log("Fetched news data:", data); // Отладка
                setNews(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching news:', err);
                setError(locale === 'ru' ? 'Не удалось загрузить новость.' : 'Yangilikni yuklashda xato yuz berdi.');
                setLoading(false);
            }
        };

        fetchNews();
    }, [slug, locale]);

    const handleEditClick = (block, isFirst) => {
        setCurrentBlock({ ...block, isFirst });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentBlock(null);
    };

    const handleSaveBlock = (updatedNews) => {
        // Обновите локальное состояние news с обновленными данными
        setNews(updatedNews);

        // Установите статус обновления для отображения уведомления
        setUpdateStatus({ success: true, message: locale === 'ru' ? 'Блок успешно обновлен.' : 'Blok muvaffaqiyatli yangilandi.' });

        // Закройте модальное окно
        setIsModalOpen(false);
        setCurrentBlock(null);

        // Сбросить статус уведомления через некоторое время
        setTimeout(() => {
            setUpdateStatus({ success: null, message: '' });
        }, 3000);
    };

    const handleDeleteClick = async (blockId) => {
        const confirmDelete = window.confirm(locale === 'ru' 
            ? 'Вы уверены, что хотите удалить этот блок?' 
            : 'Ushbu blokni o\'chirishga ishonchingiz komilmi?');

        if (!confirmDelete) return;

        try {
            // Optionally, show a loading state or disable the button here

            await axios.delete(`https://pmc.result-me.uz/v1/newness/block/delete/${blockId}`, {
                headers: { 'Accept-Language': locale },
            });

            // Update the local state by filtering out the deleted block
            setNews((prevNews) => ({
                ...prevNews,
                optionList: prevNews.optionList.filter(block => block.id !== blockId),
            }));

            // Set success status
            setUpdateStatus({ success: true, message: locale === 'ru' 
                ? 'Блок успешно удален.' 
                : 'Blok muvaffaqiyatli o\'chirildi.' });

            // Reset the status after a delay
            setTimeout(() => {
                setUpdateStatus({ success: null, message: '' });
            }, 3000);
        } catch (err) {
            console.error('Error deleting block:', err);
            setUpdateStatus({ success: false, message: locale === 'ru' 
                ? 'Не удалось удалить блок.' 
                : 'Blok o\'chirilishda xato yuz berdi.' });
            
            // Reset the status after a delay
            setTimeout(() => {
                setUpdateStatus({ success: null, message: '' });
            }, 3000);
        }
    };

    if (loading) return <div className="text-center">Загрузка...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!news) return <div className="text-center">Новость не найдена.</div>;

    return (
        <>
            <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
                {/* Уведомление об обновлении */}
                {updateStatus.message && (
                    <div className={`mb-4 p-4 text-center rounded ${updateStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {updateStatus.message}
                    </div>
                )}

                {/* Главный заголовок */}
                <div className="w-full 2xl:max-w-[1035px] mx-auto">
                    <div className="mt-4">
                        {news.createdDate && (
                            <p className="font-medium text-[16px] mdx:text-[18px] xl:text-[20px] text-[#00863E]">
                                {new Date(news.createdDate).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        )}

                        {/* Главный заголовок */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            {news.optionList?.[0]?.title && (
                                <h1 className="text-[25px] font-bold text-black mb-2 mdx:text-[35px] xl:text-[40px] 2xl:text-[50px] leading-[1.10] mt-2">
                                    {formatTextWithNewlines(
                                        locale === 'ru'
                                            ? (typeof news.optionList[0].title === 'string' ? news.optionList[0].title : news.optionList[0].title.ru)
                                            : (typeof news.optionList[0].title === 'string' ? news.optionList[0].title : news.optionList[0].title.uz)
                                    )}
                                </h1>
                            )}

                            {/* Переключатель языка */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => switchLocale('ru')}
                                    className={`px-4 py-2 rounded ${locale === 'ru' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    Русский
                                </button>
                                <button
                                    onClick={() => switchLocale('uz')}
                                    className={`px-4 py-2 rounded ${locale === 'uz' ? 'bg-[#00863E] text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    O'zbek
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Главное изображение */}
                    {news.optionList?.[0]?.photo?.url && (
                        <div className="w-full max-xl:my-[25px] xl:mt-7 xl:mb-[40px] flex flex-row justify-center">
                            <Image
                                src={news.optionList[0].photo.url || '/images/News/image-full.png'}
                                width={1000}
                                height={600}
                                quality={100}
                                alt="Main News Image"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Список блоков */}
                    {news.optionList?.map((item, index) => (
                        <div className="mt-[35px] xl:mt-[70px] w-full h-full" key={item.id}>
                            <div className="flex flex-col justify-between items-start">
                                {index !== 0 && item.title && (
                                    <h3 className={`text-[20px] mdx:text-[26px] font-bold text-[#252324]`}>
                                        {formatTextWithNewlines(
                                            locale === 'ru'
                                                ? (typeof item.title === 'string' ? item.title : item.title.ru)
                                                : (typeof item.title === 'string' ? item.title : item.title.uz)
                                        )}
                                    </h3>
                                )}
                            </div>
                            {item.body && (
                                <p className="text-[15px] mdx:text-[20px] py-[15px] font-semibold text-[#333333]">
                                    {formatTextWithNewlines(
                                        locale === 'ru'
                                            ? (typeof item.body === 'string' ? item.body : item.body.ru)
                                            : (typeof item.body === 'string' ? item.body : item.body.uz)
                                    )}
                                </p>
                            )}
                            {index !== 0 && item.photo?.url && (
                                <div className="mt-[30px] mb-[10px] flex flex-row justify-center w-full h-full">
                                    <Image
                                        src={item.photo.url}
                                        width={1035}
                                        height={500}
                                        quality={100}
                                        alt="Block Image"
                                        className="w-full h-full max-w-[832px] max-h-[500px] 5xl:max-w-[1035px] object-cover "
                                    />
                                </div>
                            )}
                            {/* Кнопки редактирования и удаления блока */}
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => handleEditClick(item, index === 0)} // Передаем isFirst
                                    className="w-[223px] py-3 bg-[#00863E] hover:bg-[#2f9c62] text-white "
                                >
                                    {index === 0 
                                        ? ('Редактировать вступление') 
                                        : ('Редактировать блок')}
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(item.id)}
                                    className="w-[223px] py-3 bg-red-500 hover:bg-red-700 text-white"
                                >
                                    Удалить блок
                                </button>
                            </div>
                        </div>
                    ))}
                    <button className='mt-[80px] w-full flex flex-col items-center justify-center h-[198px] border-[3px]  border-dashed text-[#00863E] text-[22px] hover:text-[#2c9e61] font-bold custom-border'>
                        <Image
                            src={plus_green}
                            width={30} // Adjusted to match the className width
                            height={30} // Adjusted to match the className width
                            quality={100}
                            alt="Green Arrow"
                            className="w-[30px] h-[30px]" // Ensure height matches for consistent sizing
                        />
                        Добавить блок
                    </button>
                </div>
            </div>

            {/* Модальное окно редактирования блока */}
            <EditBlockModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                blockData={currentBlock}
                onSave={handleSaveBlock}
                locale={locale} // Передача текущей локали
                newsId={news.id} // Передача ID новости
                newsActive={news.active} // Передача состояния активности новости
                isFirst={currentBlock?.isFirst} // Передача информации о первом блоке
            />
        </>
    )
}

