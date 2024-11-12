// app/_components/Doctors/Main.jsx

'use client';

import Image from 'next/image';
import plus_green from "@/public/svg/plus-green.svg";
import close_green from "@/public/svg/close_green.svg";

export default function Main_info({ fullName, description, experience, receptionTime, photo, locale, specializations }) {
    return (
        <div className="w-full bg-white h-full flex flex-col justify-between px-[16px] max-w-[1440px] mx-auto">
            <div className="mdl:flex mdl:flex-row mdl:gap-[10px] xl:gap-[40px]">
                <div className="w-full h-full max-h-[666px] xl:max-w-[588px]">
                    <Image
                        src={photo || "/images/default-image.png"} // Запасное изображение, если нет фото
                        width={1500}
                        height={1500}
                        quality={100}
                        alt={`Фото врача ${fullName}`}
                        className="w-full h-auto object-cover rounded-[10px] max-h-[666px] max-w-[588px]"
                    />
                </div>
                <div className="w-full xl:max-w-[569px]">
                    <div className="flex flex-row gap-[8px] max-mdl:mt-[20px] flex-wrap">
                        {specializations.length > 0 ? (

                            specializations.map((spec, index) => (
                                <div key={spec.id} className="rounded-[100px] flex items-center justify-center border-[#00863E] border">
                                    <p className="text-[#00863E] text-[14px] mdl:text-[16px] xl:text-[18px] py-[8px] px-[15px] font-medium">{spec.name}</p>
                                </div>
                            ))


                        ) : (
                            <div className="rounded-[100px] flex items-center justify-center border-[#00863E] border">
                                <p className="text-[#00863E] text-[14px] mdl:text-[16px] xl:text-[18px] py-[8px] px-[15px] font-medium">нет специализации</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="mt-[15px] xl:mt-[30px] text-[25px] mdl:text-[30px] lg:text-[35px] xl:text-[45px] lh font-semibold">{fullName || "Без имени"}</h2>
                        <p className="mt-[8px] mdx:mt-[12px] xl:mt-[20px] text-[15px] xl:text-[20px] text-[#666666] font-medium">{description}</p>
                    </div>
                    <div>
                        <div className="border rounded-[16px] flex flex-col px-[20px] py-[16px] mt-[25px] xl:mt-[40px]">
                            <div>
                                <h5 className="text-[18px] mdx:text-[20px] mdl:text-[24px] xl:text-[30px] font-semibold">{experience}</h5>
                                <p className="text-[#9C9C9C] text-[14px] xl:text-[18px] font-medium">Опыт работы</p>
                            </div>
                            <hr className="my-[16px]" />
                            <div>
                                <h5 className="text-[18px] mdx:text-[20px] mdl:text-[24px] xl:text-[30px] font-semibold">{receptionTime}</h5>
                                <p className="text-[#9C9C9C] text-[14px] xl:text-[18px] font-medium">Время приёма</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className="w-full max-w-[223px] flex justify-center items-center bg-[#00863E] py-[12px] hover:bg-[#398f61] mt-[25px] xl:mt-[60px]">
                            <p className="text-[#fff] font-extrabold">Редактировать</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
