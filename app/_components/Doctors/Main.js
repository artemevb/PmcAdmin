// app/_components/Doctors/Main.jsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import EditDoctorModal from '../DoctorsModal/EditDoctorModal';

export default function Main_info({ doctor, locale, fetchDoctor }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSave = () => {
        handleCloseModal();
        fetchDoctor(); // Обновляем данные врача после сохранения
    };

    return (
        <div className="w-full bg-white h-full flex flex-col justify-between px-[16px] max-w-[1440px] mx-auto">
            <div className="md:flex md:gap-4 xl:gap-10 h-full">
                <div className="w-full h-full max-h-[666px] max-w-[588px]">
                    <Image
                        src={doctor.photo?.url || '/images/default-image.png'}
                        width={1500}
                        height={1500}
                        quality={100}
                        alt={`Фото врача ${doctor.fullName || 'Без имени'}`}
                        className="w-full h-auto object-cover rounded-[10px] max-h-[666px] max-w-[588px]"
                    />
                </div>
                <div className="w-full xl:max-w-xl">
                    <div className="flex flex-row gap-2 mt-5 flex-wrap">
                        {doctor.specializationList && doctor.specializationList.length > 0 ? (
                            doctor.specializationList.map((spec, index) => (
                                <div
                                    key={spec.id || index}
                                    className="rounded-full flex items-center justify-center border-green-700 border"
                                >
                                    <p className="text-green-700 text-sm md:text-base xl:text-lg py-2 px-4 font-medium">
                                        {spec.name || 'Без названия'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-full flex items-center justify-center border-green-700 border">
                                <p className="text-green-700 text-sm md:text-base xl:text-lg py-2 px-4 font-medium">
                                    нет специализации
                                </p>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="mt-4 xl:mt-8 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold">
                            {doctor.fullName || 'Без имени'}
                        </h2>
                        <p className="mt-2 md:mt-3 xl:mt-5 text-sm xl:text-lg text-gray-600 font-medium">
                            {doctor.description || 'Нет описания'}
                        </p>
                    </div>
                    <div>
                        <div className="border rounded-xl flex flex-col px-5 py-4 mt-6 xl:mt-10">
                            <div>
                                <h5 className="text-lg md:text-xl xl:text-2xl font-semibold">
                                    {doctor.experience || 'Нет данных'}
                                </h5>
                                <p className="text-gray-500 text-sm xl:text-base font-medium">Опыт работы</p>
                            </div>
                            <hr className="my-4" />
                            <div>
                                <h5 className="text-lg md:text-xl xl:text-2xl font-semibold">
                                    {doctor.receptionTime || 'Нет данных'}
                                </h5>
                                <p className="text-gray-500 text-sm xl:text-base font-medium">Время приёма</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="w-full flex justify-center items-center bg-green-700 py-3 hover:bg-green-800 mt-6 xl:mt-14 max-w-[223px]"
                            onClick={handleEditClick}
                        >
                            <p className="text-white font-extrabold">Редактировать</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Модальное окно */}
            {isModalOpen && (
                <EditDoctorModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    doctorId={doctor.id}
                    locale={locale}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
