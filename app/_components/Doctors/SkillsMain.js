"use client";

import { useState } from 'react';
import plus_green from "@/public/svg/plus-green.svg";
import close_green from "@/public/svg/close_green.svg";
import Image from "next/image";

export default function SkillsMain() {
    const [selectedTab, setSelectedTab] = useState('education');
    return (
        <div className="w-full bg-white h-full flex flex-col justify-between px-[16px] max-w-[1440px] mx-auto mt-[100px] mdx:mt-[130px] xl:mt-[150px]">
            <div className="text-[25px] mdx:text-[35px] xl:text-[45px] font-semibold flex flex-row gap-[25px] xl:gap-[50px] whitespace-nowrap relative w-full overflow-x-scroll scrollbar-hide">
                <button
                    onClick={() => setSelectedTab('education')}
                    className={`${selectedTab === `education` ? `text-black` : `text-gray-300`}`}>
                    <h3>
                        Образование
                    </h3>
                </button>
                <button
                    onClick={() => setSelectedTab(`specialization`)}
                    className={`${selectedTab === `specialization` ? `text-black` : `text-gray-300`}`}>
                    <h3>
                        Специализации
                    </h3>
                </button>
            </div>

            <hr className="my-[25px] mdl:my-[30px]" />

            <div>
                {selectedTab === 'education' && (
                    <div>
                        <div className="border-b pb-[15px] mb-[15px] mdl:pb-[30px] mdl:mb-[30px]">
                            <div className="mdl:flex mdl:justify-between w-full items-center">
                                <div className="max-w-[952px] w-full mdl:flex mdl:justify-between">
                                    <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">2015 - 2021 г.</p>
                                    <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">Ташкентский Педиатрический Медицинский Институт</p>
                                    <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">Педиатрия - Бакалавр</p>
                                </div>
                                <div className="flex gap-[15px]">
                                    <button className="w-[223px] flex justify-center items-center bg-[#00863E] py-[12px] hover:bg-[#398f61]">
                                        <p className="text-[#fff] font-extrabold">Редактировать</p>
                                    </button>
                                    <button className="border p-[12px] w-[50px]">
                                        <Image
                                            src={close_green}
                                            width={28}
                                            height={28}
                                            quality={100}
                                            alt={'Добавить новость'}
                                            className="w-full h-auto object-cover max-w-[28px]"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="border-b pb-[15px] mb-[15px] mdl:pb-[30px] mdl:mb-[30px]">
                            <div className="mdl:flex mdl:justify-between w-full items-center">
                                <div className="max-w-[952px] w-full mdl:flex mdl:justify-between">
                                    <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">2021-2023 г.</p>
                                    <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">МГУ им Н.П.Огарёва</p>
                                    <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">Оториноларингология - Ординатура</p>
                                </div>
                                <div className="flex gap-[15px]">
                                    <button className="w-[223px] flex justify-center items-center bg-[#00863E] py-[12px] hover:bg-[#398f61]">
                                        <p className="text-[#fff] font-extrabold">Редактировать</p>
                                    </button>
                                    <button className="border p-[12px] w-[50px]">
                                        <Image
                                            src={close_green}
                                            width={28}
                                            height={28}
                                            quality={100}
                                            alt={'Добавить новость'}
                                            className="w-full h-auto object-cover max-w-[28px]"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button className="text-[22px] font-bold text-[#00863E] hover:text-[#32a065] flex gap-[10px] border-b pb-[30px] items-center justify-center w-full">
                            <Image
                                src={plus_green}
                                width={28}
                                height={28}
                                quality={100}
                                alt={'Добавить новость'}
                                className="w-full h-auto object-cover max-w-[28px]"
                            />
                            Добавить образование</button>
                    </div>
                )}

                {selectedTab === 'specialization' && (
                    <div>
                        <div className="border-b pb-[15px] mb-[15px] mdl:pb-[30px] mdl:mb-[30px]">
                            <div className="mdl:flex mdl:justify-between ">
                                <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">ЛОР врач</p>
                                <div className="flex gap-[15px]">
                                    <button className="w-[223px] flex justify-center items-center bg-[#00863E] py-[12px] hover:bg-[#398f61]">
                                        <p className="text-[#fff] font-extrabold">Редактировать</p>
                                    </button>
                                    <button className="border p-[12px] w-[50px]">
                                        <Image
                                            src={close_green}
                                            width={28}
                                            height={28}
                                            quality={100}
                                            alt={'Добавить новость'}
                                            className="w-full h-auto object-cover max-w-[28px]"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="border-b pb-[15px] mb-[15px] mdl:pb-[30px] mdl:mb-[30px]">
                            <div className="mdl:flex mdl:justify-between ">
                                <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">Отоларинголог</p>
                                <div className="flex gap-[15px]">
                                    <button className="w-[223px] flex justify-center items-center bg-[#00863E] py-[12px] hover:bg-[#398f61]">
                                        <p className="text-[#fff] font-extrabold">Редактировать</p>
                                    </button>
                                    <button className="border p-[12px] w-[50px]">
                                        <Image
                                            src={close_green}
                                            width={28}
                                            height={28}
                                            quality={100}
                                            alt={'Добавить новость'}
                                            className="w-full h-auto object-cover max-w-[28px]"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button className="text-[22px] font-bold text-[#00863E] hover:text-[#32a065] flex gap-[10px] border-b pb-[30px] items-center justify-center w-full">
                            <Image
                                src={plus_green}
                                width={28}
                                height={28}
                                quality={100}
                                alt={'Добавить новость'}
                                className="w-full h-auto object-cover max-w-[28px]"
                            />
                            Добавить специализацию</button>
                    </div>
                )}
            </div>
        </div>
    );
}
