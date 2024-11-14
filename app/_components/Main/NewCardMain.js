'use client'

import Image from "next/image"

export default function NewCardMain({ title, imageSrc, specializationList }) {

    return (
        <div className="w-full bg-white flex flex-col gap-2 justify-between overflow-hidden">
            {/* Контейнер для изображения с фиксированной высотой */}
            <div className="relative w-full h-[300px] 4xl:h-[450px]">
                <Image
                    src={imageSrc}
                    alt={`Фото врача ${title}`}
                    fill
                    quality={100}
                    style={{ objectFit: 'cover' }} // Обеспечивает заполнение контейнера изображением
                    className="object-cover"
                />
            </div>
            {/* Содержимое карточки */}
            <div className="w-full flex flex-col gap-3 p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                    {title}
                </h3>
                <div className="flex gap-2 justify-start flex-wrap">
                    {specializationList && specializationList.length > 0 ? (
                        specializationList.map((spec, index) => (
                            <span key={index} className="text-[#9C9C9C] text-sm flex items-center">
                                {spec}
                                {index < specializationList.length - 1 && (
                                    <span className="ml-2 text-[17px] text-[#EEEEEE]">|</span>
                                )}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm">Нет специализаций</span>
                    )}
                </div>
            </div>
        </div>
    )
}
