// app_components/Doctors/Main.js

'use client'

import React, { useEffect, useState, useCallback } from 'react';
import Image from "next/image";
import plus_green from "@/public/svg/plus-green.svg";
import axios from 'axios';
import { useParams } from 'next/navigation';
import EditBlockModal from './EditBlockModal';
import AddBlockModal from './AddBlockModal';
import translations from './translations';
import { useRouter } from 'next/navigation';

const formatTextWithNewlines = (text) => {
    if (text && typeof text === 'object') {
        return Object.keys(text).map((lang, index) => (
            <span key={index}>
                {text[lang]}
                <br />
            </span>
        ));
    } else if (typeof text === 'string') {
        return text.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    }
    return null; 
};

export default function MainPages() {
    const { slug } = useParams();
    const [locale, setLocale] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('locale') || 'ru';
        }
        return 'ru';
    });
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentBlock, setCurrentBlock] = useState(null);
    const [updateStatus, setUpdateStatus] = useState({ success: null, message: '' });

    const switchLocale = (newLocale) => {
        if (newLocale === locale) return;
        setLocale(newLocale);
        if (typeof window !== 'undefined') {
            localStorage.setItem('locale', newLocale);
        }
    };

    const fetchNews = useCallback(async () => {
        if (!slug) return;

        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://api.pmc.dr-psixoterapevt.uz/v1/newness/get/${slug}`, {
                headers: { 'Accept-Language': locale },
            });
            const data = response.data.data;
            console.log("Fetched news data:", data);
            setNews(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching news:', err);
            setError(translations[locale].confirmDelete); // Используем перевод
            setLoading(false);
        }
    }, [slug, locale]);


    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleEditClick = (block, isFirst) => {
        setCurrentBlock({ ...block, isFirst });
        setIsEditModalOpen(true);
    };

    const handleModalClose = () => {
        setIsEditModalOpen(false);
        setCurrentBlock(null);
    };

    const handleSaveBlock = (updatedNews) => {
        setNews(updatedNews);
        setUpdateStatus({ success: true, message: translations[locale].blockSuccessfullyUpdated });
        setTimeout(() => {
            setUpdateStatus({ success: null, message: '' });
        }, 3000);
        setIsEditModalOpen(false);
        setCurrentBlock(null);
    };

    const handleDeleteClick = async (blockId) => {
        const confirmDelete = window.confirm(locale === 'ru'
            ? translations[locale].confirmDelete // 'Вы уверены, что хотите удалить этот блок?'
            : translations[locale].confirmDelete); // 'Ushbu blokni o\'chirishga ishonchingiz komilmi?'

        if (!confirmDelete) return;

        try {
            await axios.delete(`https://api.pmc.dr-psixoterapevt.uz/v1/newness/block/delete/${blockId}`, {
                headers: { 'Accept-Language': locale },
            });

            setNews((prevNews) => ({
                ...prevNews,
                optionList: prevNews.optionList.filter(block => block.id !== blockId),
            }));

            setUpdateStatus({
                success: true, message: locale === 'ru'
                    ? translations[locale].blockSuccessfullyDeleted // 'Блок успешно удален.'
                    : translations[locale].blockSuccessfullyDeleted // 'Blok muvaffaqiyatli o\'chirildi.'
            });

            setTimeout(() => {
                setUpdateStatus({ success: null, message: '' });
            }, 3000);
        } catch (err) {
            console.error('Error deleting block:', err);
            setUpdateStatus({
                success: false, message: locale === 'ru'
                    ? translations[locale].errorDeletingBlock // 'Не удалось удалить блок.'
                    : translations[locale].errorDeletingBlock // 'Blok o\'chirilishda xato yuz berdi.'
            });

            setTimeout(() => {
                setUpdateStatus({ success: null, message: '' });
            }, 3000);
        }
    };

    const handleAddBlockClick = () => {
        setIsAddModalOpen(true);
    };

    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
    };

    // Шаг 2: Изменение handleSaveNewBlock для вызова fetchNews
    const handleSaveNewBlock = (newBlock) => {
        // Вместо непосредственного обновления состояния, вызываем fetchNews для получения актуальных данных
        setUpdateStatus({ success: true, message: translations[locale].blockSuccessfullyAdded });

        setTimeout(() => {
            setUpdateStatus({ success: null, message: '' });
        }, 3000);

        setIsAddModalOpen(false);

        // Вызовите fetchNews для обновления данных после добавления блока
        fetchNews();
    };

    if (loading) return <div className="text-center">Загрузка...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!news) return <div className="text-center">{locale === 'ru' ? 'Новость не найдена.' : 'Yangilik topilmadi.'}</div>;

    return (
        <>
            <button
                onClick={() => router.back()}
                className='text-[20px] text-[#00863E] font-bold hover:text-[#2c8d59] ml-[200px] w-[40px]'
            >
                Назад
            </button>
            <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
                {updateStatus.message && (
                    <div className={`mb-4 p-4 text-center rounded ${updateStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {updateStatus.message}
                    </div>
                )}

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

                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            {news.optionList?.[0]?.title && (
                                <h1 className="text-[25px] font-bold text-black mb-2 mdx:text-[35px] xl:text-[40px] 2xl:text-[50px] leading-[1.10] mt-2">
                                    {formatTextWithNewlines(
                                        locale === 'ru'
                                            ? (typeof news.optionList[0].title === 'string'
                                                ? news.optionList[0].title
                                                : (news.optionList[0].title?.ru || ''))
                                            : (typeof news.optionList[0].title === 'string'
                                                ? news.optionList[0].title
                                                : (news.optionList[0].title?.uz || ''))
                                    )}
                                </h1>
                            )}

                            <div className="flex gap-2">
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
                                    Ozbek
                                </button>
                            </div>
                        </div>
                    </div>

                    {news.optionList?.[0]?.photo?.url && (
                        <div className="w-full max-w-[1035px] h-[500px] max-xl:my-[25px] xl:mt-7 xl:mb-[40px] flex justify-center relative">
                            <Image
                                src={news.optionList[0].photo.url || '/images/News/image-full.png'}
                                layout="fill" // Используем fill для полного покрытия
                                quality={100}
                                alt="Main News Image"
                                className="object-cover" // Обеспечиваем полное покрытие с сохранением пропорций
                            />
                        </div>
                    )}


                    {news.optionList?.map((item, index) => (
                        <div className="mt-[35px] xl:mt-[70px] w-full h-full" key={item.id}>
                            <div className="flex flex-col justify-between items-start">
                                {index !== 0 && item.title && (
                                    <h3 className="text-[20px] mdx:text-[26px] font-bold text-[#252324]">
                                        {formatTextWithNewlines(
                                            locale === 'ru'
                                                ? (typeof item.title === 'string'
                                                    ? item.title
                                                    : (item.title?.ru || ''))
                                                : (typeof item.title === 'string'
                                                    ? item.title
                                                    : (item.title?.uz || ''))
                                        )}
                                    </h3>
                                )}
                            </div>
                            {item.body && (
                                <p className="text-[15px] mdx:text-[20px] py-[15px] font-semibold text-[#333333]">
                                    {formatTextWithNewlines(
                                        locale === 'ru'
                                            ? (typeof item.body === 'string'
                                                ? item.body
                                                : (item.body?.ru || ''))
                                            : (typeof item.body === 'string'
                                                ? item.body
                                                : (item.body?.uz || ''))
                                    )}
                                </p>
                            )}
                            {index !== 0 && item.photo?.url && (
                                <div className="mt-[30px] mb-[10px] flex justify-center relative w-full max-w-[1035px] h-[500px]">
                                    <Image
                                        src={item.photo.url}
                                        layout="fill" // Используем fill для полного покрытия контейнера
                                        quality={100}
                                        alt="Block Image"
                                        className="object-cover" // Обеспечиваем полное покрытие с сохранением пропорций
                                    />
                                </div>
                            )}

                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => handleEditClick(item, index === 0)}
                                    className="w-[223px] py-3 bg-[#00863E] hover:bg-[#2f9c62] text-white "
                                >
                                    {index === 0
                                        ? (locale === 'ru' ? 'Редактировать вступление' : 'Tanishuvni tahrirlash')
                                        : (locale === 'ru' ? 'Редактировать блок' : 'Blokni tahrirlash')}
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(item.id)}
                                    className="w-[223px] py-3 bg-red-500 hover:bg-red-700 text-white"
                                >
                                    {locale === 'ru' ? 'Удалить блок' : 'Blokni o\'chirish'}
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleAddBlockClick}
                        className='mt-[80px] w-full flex flex-col items-center justify-center h-[198px] border-[3px] border-dashed text-[#00863E] text-[22px] hover:text-[#2c9e61] font-bold custom-border'
                    >
                        <Image
                            src={plus_green}
                            width={30}
                            height={30}
                            quality={100}
                            alt="Green Arrow"
                            className="w-[30px] h-[30px]"
                        />
                        {locale === 'ru' ? 'Добавить блок' : 'Blok qo\'shish'}
                    </button>
                </div>
            </div>

            {/* Модальное окно редактирования блока */}
            <EditBlockModal
                isOpen={isEditModalOpen}
                onClose={handleModalClose}
                blockData={currentBlock}
                onSave={handleSaveBlock}
                locale={locale}
                newsId={news.id}
                newsActive={news.active}
                isFirst={currentBlock?.isFirst}
            />

            {/* Модальное окно добавления блока */}
            <AddBlockModal
                isOpen={isAddModalOpen}
                onClose={handleAddModalClose}
                onSave={handleSaveNewBlock}
                locale={locale}
                newsId={news.id}
                existingBlocks={news.optionList}
                fetchNews={fetchNews} // Передаём fetchNews как проп
            />
        </>
    )
}

