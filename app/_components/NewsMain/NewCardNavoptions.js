"use client"
import Image from "next/image";
import GreenArrow from "@/public/svg/arrow-right-green-news.svg";

export default function NewCard({ key, title, subtitle, date }) {

    return (
        <div className="w-full bg-white h-full flex flex-col justify-between pb-[25px] border-b">
            <div className="w-full flex flex-col flex-grow justify-between">
                {/* Combined Title and Subtitle with Line Clamp */}
                <div className="line-clamp-4">
                    <h3 className="text-[22px]  font-semibold mt-0 lh line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-[16px]  lh font-medium text-[#666] mt-[8px] line-clamp-2">
                        {subtitle}
                    </p>
                </div>

                {/* Button with Arrow */}
                <div className="flex flex-row gap-[5px] items-center mt-[10px]">
                    <p className="text-[#00863E] xl:text-[20px] text-[16px] mdx:text-[18px] font-bold">
                        Кнопка
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
