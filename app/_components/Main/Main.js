"use client"
import { useState } from "react";
import List_Doctors from "../Doctors/List";
import News from "../News/NewsList";
import news_icon from '@/public/svg/fluent_news-16-regular.svg'
import jam_medical from '@/public/svg/jam_medical.svg'
import Image from "next/image";

export default function Main() {
  // State to control the displayed component
  const [activeComponent, setActiveComponent] = useState("doctors");

  return (
    <div className="flex w-full h-full ">
      {/* Sidebar */}
      <div className="w-1/4 bg-white">
        <ul >
          <li>
            <button
              onClick={() => setActiveComponent("doctors")}
              className={`w-full flex gap-[12px] items-center text-left text-[22px] font-bold py-[30px] pl-[30px] ${activeComponent === "doctors" ? "bg-custom-myata text-[#00863E]" : "text-black"
                }`}
            >
              <Image
                src={news_icon}
                width={28}
                height={28}
                quality={100}
                alt={`news_icon Image `}
                className="w-full h-auto object-cover max-w-[28px]"
              />
              Врачи
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveComponent("news")}
              className={`w-full flex gap-[12px] items-center text-[22px] font-bold text-left py-[30px] pl-[30px] ${activeComponent === "news" ? "bg-custom-myata text-[#00863E]" : "text-black"
                }`}
            >
              <Image
                src={jam_medical}
                width={28}
                height={28}
                quality={100}
                alt={`jam_medical Image `}
                className="w-full h-auto object-cover max-w-[28px]"
              />
              Новости
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 pl-[40px]">
        {activeComponent === "doctors" && <List_Doctors />}
        {activeComponent === "news" && <News />}
      </div>
    </div>
  );
}
