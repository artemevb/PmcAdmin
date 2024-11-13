'use client'

import Image from "next/image"

export default function NewCardMain({ title, imageSrc, specializationList }) {
    console.log('Title:', title)
    console.log('Specializations:', specializationList)

    return (
        <div className="w-full bg-white h-full flex flex-col gap-2 justify-between">
            <Image
                src={imageSrc}
                width={1000}
                height={1000}
                quality={100}
                alt={`Фото врача ${title}`}
                className="w-full h-auto object-cover"
            />
            <div className="w-full flex flex-col gap-3">
                <h3 className="text-xl font-semibold">
                    {title}
                </h3>
                <div className="flex gap-[12px] justify-start flex-wrap">
                    {specializationList && specializationList.length > 0 ? (
                        specializationList.map((spec, index) => (
                            <span key={index} className="text-[#9C9C9C] text-[16px]">
                                {spec}{index < specializationList.length - 1 && ','}
                            </span>
                        ))
                    ) : (
                        <span className="text-[#9C9C9C] text-[16px]">Нет специализаций</span>
                    )}
                </div>
            </div>
        </div>
    )
}


