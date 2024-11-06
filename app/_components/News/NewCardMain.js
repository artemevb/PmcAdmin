"use client";
import Image from "next/image";
import GreenArrow from "@/public/svg/arrow-right-green-news.svg";

export default function NewCard({ key, title, subtitle, date, imageSrc }) {
    return (
        <div className="w-full bg-white h-full flex flex-col justify-between">
            <Image
                src={imageSrc}
                width={800}
                height={800}
                quality={100}
                alt={`News Image ${key}`}
                className="w-full h-auto object-cover"
            />
            <div className="w-full flex flex-col flex-grow justify-between mt-[10px] xl:mt-[15px]">
                {/* Combined Title and Subtitle with Line Clamp */}
                <div className="line-clamp-4">
                    <h3 className="text-[20px] mdx:text-[24px] xl:text-[26px] font-bold mt-0 lh line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-[15px] mdx:text-[16px] xl:text-[18px] lh font-medium text-[#666] mt-[8px] line-clamp-2">
                        {subtitle}
                    </p>
                </div>

                {/* Button with Arrow */}
                <div className="flex flex-row gap-[5px] items-center mt-[10px]">
                    <p className="text-[#00863E] xl:text-[20px] text-[16px] mdx:text-[18px] font-bold">
                        Читать далее
                    </p>
                    <Image
                        src={GreenArrow}
                        width={25} // Adjusted to match the className width
                        height={25} // Adjusted to match the className width
                        quality={100}
                        alt="Green Arrow"
                        className="w-[25px] h-[25px]" // Ensure height matches for consistent sizing
                    />
                </div>
            </div>
        </div>
    );
}
