'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import plus_green from "@/public/svg/plus-green.svg";
import pen from "@/public/svg/pen.svg";
import close from "@/public/svg/close-modal.svg";

export default function ServiceMain() {
    const [itemsLimit, setItemsLimit] = useState(12); // Default limit is 12

    const services = [
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' },
        { name: 'Прием амбулаторный (осмотр, консультация)', price: '100 000 сум' }, // Add more services as necessary
    ];

    // Effect to handle screen size changes
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 460) { // xl screen
                setItemsLimit(12);
            } else { // mobile and smaller screens
                setItemsLimit(4);
            }
        };

        // Set the initial limit based on screen size
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="w-full bg-white h-full flex flex-col justify-between px-[16px] max-w-[1440px] mx-auto my-[90px] mdx:my-[120px] xl:my-[140px]">
            <h2 className="font-semibold text-[30px] mdx:text-[35px] mdl:text-[40px] xl:text-[45px]">
                Наши услуги
            </h2>
            <div className="grid mdx:gap-x-[16px] gap-y-[12px] mdx:gap-y-[20px] mdx:grid-cols-2 mt-[25px] mdx:mt-[30px] 2xl:grid-cols-4">
                {services.map((service, index) => (
                    <div key={index} className="border border-[#EEE] p-[20px] flex flex-col justify-between min-h-[150px] mdx:min-h-[180px] 2xl:min-h-[200px]">
                        <button className="w-full right-0 flex justify-end">
                            <Image
                                src={close}
                                width={24}
                                height={24}
                                quality={100}
                                alt={'Добавить новость'}
                                className="w-full h-auto object-cover max-w-[24px]"
                            />
                        </button>
                        <h5 className="text-[18px] mdx:text-[18px] xl:text-[22px] font-semibold">{service.name}</h5>
                        <p className="text-[#00863E] text-[18px] mdx:text-[18px] xl:text-[22px] font-bold">{service.price}</p>
                        <button className="w-full right-0 flex justify-end">
                            <Image
                                src={pen}
                                width={24}
                                height={24}
                                quality={100}
                                alt={'Добавить новость'}
                                className="w-full h-auto object-cover max-w-[24px]"
                            />
                        </button>
                    </div>

                ))}
                <button className='h-[200px] w-auto border-[2px] border-dashed border-[#00863E] hover:border-[#2dbd70] flex flex-col-reverse items-center justify-center text-[22px] font-semibold text-[#00863E] hover:text-[#27a361]'>
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
    );
}
