"use client"
import Image from "next/image"
import { useEffect } from "react";

export default function NewCard({ key, title, date, imageSrc }) {

  return (
    <div className="w-full bg-white h-full flex flex-col gap-2 justify-between">
      <Image
        src={imageSrc}
        width={500}
        height={500}
        quality={100}
        alt={`News Image ${key}`}
        className="w-full h-auto object-cover"
      />
      <div className="w-full flex flex-col gap-3">
        <h3 className="text-xl max-mdx:text-lg font-semibold line-clamp-4 max-w-[280px]">
          {title}
        </h3>
        <div className="flex gap-[12px] justify-start flex-row">
          <p className="text-[#9C9C9C] text-[16px]">ЛОР-врач</p>
          <p className='text-[#EEEEEE]'>|</p>
          <p className="text-[#9C9C9C] text-[16px]">Отоларинголог</p>
        </div>
      </div>
    </div >
  )
}
