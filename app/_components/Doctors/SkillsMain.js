'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import plus_green from '@/public/svg/plus-green.svg';
import close_green from '@/public/svg/close_green.svg';
import ModalAddSpecialization from '../DoctorsModal/ModalAddSpecialization';
import ModalAddEducation from '../DoctorsModal/ModalAddEducation';
import ConfirmDeleteModal from '../DoctorsModal/ModalConfirmDelete';
import ModalEditSpecialization from '../DoctorsModal/ModalEditSpecialization';
import ModalEditEducation from '../DoctorsModal/ModalEditEducation';

const translations = {
    ru: {
        addEducation: 'Добавить образование',
        addSpecialization: 'Добавить специализацию',
        edit: 'Редактировать',
        delete: 'Удалить',
        noSpecializations: 'Нет специализаций',
        noEducation: 'Нет образования',
        education: 'Образование',
        specialization: 'Специализации',
        errorDeletingSpecialization: 'Ошибка при удалении специализации',
        specializationDeleted: 'Специализация успешно удалена',
        errorDeletingEducation: 'Ошибка при удалении образования',
        educationDeleted: 'Образование успешно удалено',
        confirmDeleteTitle: 'Подтверждение удаления',
        confirmDeleteMessageEducation: 'Вы уверены, что хотите удалить это образование?',
        confirmDeleteMessageSpecialization: 'Вы уверены, что хотите удалить эту специализацию?',
        educationAdded: 'Образование успешно добавлено',
        errorAddingEducation: 'Ошибка при добавлении образования',
        errorUpdatingSpecialization: 'Ошибка при обновлении специализации',
        specializationUpdated: 'Специализация успешно обновлена',
        educationUpdated: 'Образование успешно обновлено',
        errorUpdatingEducation: 'Ошибка при обновлении образования',
        specializationAdded: 'Специализация успешно добавлена',
        errorAddingSpecialization: 'Ошибка при добавлении специализации',
    },
    uz: {
        addEducation: 'Ta\'lim qo\'shish',
        addSpecialization: 'Maxsuslik qo\'shish',
        edit: 'Tahrirlash',
        delete: 'O\'chirish',
        noSpecializations: 'Maxsus yo\'qlik',
        noEducation: 'Ta\'lim yo\'q',
        education: 'Ta\'lim',
        specialization: 'Maxsusliklar',
        errorDeletingSpecialization: 'Maxsuslikni o\'chirishda xatolik',
        specializationDeleted: 'Maxsuslik muvaffaqiyatli o\'chirildi',
        errorDeletingEducation: 'Ta\'limni o\'chirishda xatolik',
        educationDeleted: 'Ta\'lim muvaffaqiyatli o\'chirildi',
        confirmDeleteTitle: 'O\'chirishni tasdiqlash',
        confirmDeleteMessageEducation: 'Siz rostdan ham ushbu ta\'limni o\'chirmoqchimisiz?',
        confirmDeleteMessageSpecialization: 'Siz rostdan ham ushbu maxsuslikni o\'chirmoqchimisiz?',
        educationAdded: 'Ta\'lim muvaffaqiyatli qo\'shildi',
        errorAddingEducation: 'Ta\'lim qo\'shishda xatolik',
        errorUpdatingSpecialization: 'Maxsuslikni yangilashda xatolik',
        specializationUpdated: 'Maxsuslik muvaffaqiyatli yangilandi',
        educationUpdated: 'Ta\'lim muvaffaqiyatli yangilandi',
        errorUpdatingEducation: 'Ta\'limni yangilashda xatolik',
        specializationAdded: 'Maxsuslik muvaffaqiyatli qo\'shildi',
        errorAddingSpecialization: 'Maxsuslik qo\'shishda xatolik',
    },
};

export default function SkillsMain({ doctorId, locale }) {
    const [doctorData, setDoctorData] = useState(null);
    const [activeTab, setActiveTab] = useState('education');
    const [isModalOpenSpecialization, setIsModalOpenSpecialization] = useState(false);
    const [isModalOpenEducation, setIsModalOpenEducation] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [deleteType, setDeleteType] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isEditSpecializationModalOpen, setIsEditSpecializationModalOpen] = useState(false);
    const [currentSpecialization, setCurrentSpecialization] = useState(null);
    const [isEditEducationModalOpen, setIsEditEducationModalOpen] = useState(false);
    const [currentEducation, setCurrentEducation] = useState(null);
    const t = translations[locale];

    const fetchDoctorData = async () => {
        try {
            const response = await fetch(`https://pmc.result-me.uz/v1/doctor/get-by-id/${doctorId}`, {
                headers: {
                    'Accept-Language': '-', // Устанавливаем Accept-Language в '-'
                },
            });
            const data = await response.json();
            if (data.data) {
                setDoctorData(data.data);
            }
        } catch (error) {
            console.error('Ошибка при получении данных врача:', error);
        }
    };

    useEffect(() => {
        fetchDoctorData();
    }, [doctorId]);

    const refreshDoctor = () => {
        fetchDoctorData();
    };

    // Остальные функции остаются без изменений, убедитесь, что они корректно работают с объектами

    // Функция для добавления специализации
    const handleSaveSpecialization = async (specializationData) => {
        try {
            const response = await fetch(`https://pmc.result-me.uz/v1/doctor/specialization/create/${doctorId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': '-', // Устанавливаем Accept-Language в '-'
                },
                body: JSON.stringify({
                    name: {
                        uz: specializationData.uz,
                        ru: specializationData.ru,
                    },
                }),
            });

            if (response.ok) {
                alert(t.specializationAdded || 'Специализация успешно добавлена');
                setIsModalOpenSpecialization(false);
                refreshDoctor(); // Обновляем данные врача
            } else {
                const errorData = await response.json();
                alert(`${t.errorAddingSpecialization}: ${errorData.message || 'Неизвестная ошибка'}`);
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
            alert(t.errorAddingSpecialization);
        }
    };

    // Аналогично обновите функции handleUpdateSpecialization, handleSaveEducation, handleUpdateEducation

    // Функция для обновления специализации
    const handleUpdateSpecialization = async (updatedSpec) => {
        try {
            const response = await fetch(`https://pmc.result-me.uz/v1/doctor/specialization/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': '-', // Устанавливаем Accept-Language в '-'
                },
                body: JSON.stringify(updatedSpec),
            });

            if (response.ok) {
                alert(t.specializationUpdated);
                setIsEditSpecializationModalOpen(false);
                refreshDoctor();
            } else {
                const errorData = await response.json();
                alert(`${t.errorUpdatingSpecialization}: ${errorData.message || 'Неизвестная ошибка'}`);
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
            alert(t.errorUpdatingSpecialization);
        }
    };

    // Функция для добавления образования
    const handleSaveEducation = async (educationData) => {
        try {
            const response = await fetch(`https://pmc.result-me.uz/v1/doctor/education/create/${doctorId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': '-',
                },
                body: JSON.stringify(educationData),
            });

            if (response.ok) {
                alert(t.educationAdded);
                setIsModalOpenEducation(false);
                refreshDoctor();
            } else {
                const errorData = await response.json();
                alert(`${t.errorAddingEducation}: ${errorData.message || 'Неизвестная ошибка'}`);
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
            alert(t.errorAddingEducation);
        }
    };


    // Функция для обновления образования
    const handleUpdateEducation = async (updatedEducation) => {
        try {
            const response = await fetch(`https://pmc.result-me.uz/v1/doctor/education/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept-Language': '-', // Устанавливаем Accept-Language в '-'
                },
                body: JSON.stringify(updatedEducation),
            });

            if (response.ok) {
                alert(t.educationUpdated);
                setIsEditEducationModalOpen(false);
                refreshDoctor();
            } else {
                const errorData = await response.json();
                alert(`${t.errorUpdatingEducation}: ${errorData.message || 'Неизвестная ошибка'}`);
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
            alert(t.errorUpdatingEducation);
        }
    };

    // Inside SkillsMain.js

    // Function to open the confirmation modal
    const openConfirmDelete = (type, id) => {
        setDeleteType(type);
        setDeleteId(id);
        setIsConfirmDeleteOpen(true);
    };

    // Function to get the confirmation message based on the type
    const getConfirmDeleteMessage = () => {
        if (deleteType === 'education') {
            return t.confirmDeleteMessageEducation;
        } else if (deleteType === 'specialization') {
            return t.confirmDeleteMessageSpecialization;
        } else {
            return '';
        }
    };

    // Function to handle the delete action after confirmation
    const handleConfirmDelete = async () => {
        if (!deleteType || !deleteId) {
            return;
        }
        try {
            let url = '';
            if (deleteType === 'education') {
                url = `https://pmc.result-me.uz/v1/doctor/education/delete/${deleteId}`;
            } else if (deleteType === 'specialization') {
                url = `https://pmc.result-me.uz/v1/doctor/specialization/delete/${deleteId}`;
            } else {
                return;
            }

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept-Language': '-',
                },
            });

            if (response.ok) {
                if (deleteType === 'education') {
                    alert(t.educationDeleted);
                } else if (deleteType === 'specialization') {
                    alert(t.specializationDeleted);
                }
                setIsConfirmDeleteOpen(false);
                refreshDoctor();
            } else {
                const errorData = await response.json();
                if (deleteType === 'education') {
                    alert(`${t.errorDeletingEducation}: ${errorData.message || 'Неизвестная ошибка'}`);
                } else if (deleteType === 'specialization') {
                    alert(`${t.errorDeletingSpecialization}: ${errorData.message || 'Неизвестная ошибка'}`);
                }
            }
        } catch (error) {
            console.error('Ошибка запроса:', error);
            if (deleteType === 'education') {
                alert(t.errorDeletingEducation);
            } else if (deleteType === 'specialization') {
                alert(t.errorDeletingSpecialization);
            }
        }
    };


    // Функции для открытия модальных окон редактирования
    const handleEditSpecialization = (spec) => {
        setCurrentSpecialization(spec);
        setIsEditSpecializationModalOpen(true);
    };

    const handleEditEducation = (edu) => {
        setCurrentEducation(edu);
        setIsEditEducationModalOpen(true);
    };

    return (
        <div className="w-full bg-white h-full flex flex-col justify-between px-[16px] max-w-[1440px] mx-auto mt-[100px] mdx:mt-[130px] xl:mt-[150px]">
            {/* Навигационные вкладки */}
            <div className="flex gap-[50px] mb-8">
                <button
                    className={`transition-opacity text-[20px] mdx:text-[25px] xl:text-[45px] font-semibold ${activeTab === 'education' ? 'text-black' : 'opacity-25'
                        }`}
                    onClick={() => setActiveTab('education')}
                >
                    {t.education}
                </button>
                <button
                    className={`transition-opacity text-[20px] mdx:text-[25px] xl:text-[45px] font-semibold ${activeTab === 'specialization' ? 'text-black' : 'opacity-25'
                        }`}
                    onClick={() => setActiveTab('specialization')}
                >
                    {t.specialization}
                </button>
            </div>

            {/* Вкладка Образование */}
            {activeTab === 'education' && (
                <div>
                    {doctorData && doctorData.educationList && doctorData.educationList.length > 0 ? (
                        doctorData.educationList.map((education) => (
                            <div key={education.id} className="border-y pb-[15px] mdl:pb-[30px] xl:py-[30px]">
                                <div className="mdl:flex mdl:justify-between w-full items-center">
                                    <div className="max-w-[952px] w-full mdl:flex mdl:justify-between">
                                        <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">
                                            {education.startYear} - {education.finishYear} г.
                                        </p>
                                        <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">
                                            {education.institution[locale]}
                                        </p>
                                        <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">
                                            {education.qualification[locale]}
                                        </p>
                                    </div>
                                    <div className="flex gap-[15px]">
                                        <button
                                            className="w-[223px] flex justify-center items-center bg-[#00863E] py-[12px] hover:bg-[#398f61]"
                                            onClick={() => handleEditEducation(education)}
                                        >
                                            <p className="text-[#fff] font-extrabold">{t.edit}</p>
                                        </button>
                                        <button
                                            className="border p-[12px] w-[50px]"
                                            onClick={() => openConfirmDelete('education', education.id)}
                                        >
                                            <Image
                                                src={close_green}
                                                width={28}
                                                height={28}
                                                quality={100}
                                                alt={t.delete}
                                                className="w-full h-auto object-cover max-w-[28px]"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">{t.noEducation}</p>
                    )}
                    <button
                        className="text-[22px] font-bold text-[#00863E] hover:text-[#32a065] flex gap-[10px] border-b py-[30px] items-center justify-center w-full"
                        onClick={() => setIsModalOpenEducation(true)}
                    >
                        <Image
                            src={plus_green}
                            width={28}
                            height={28}
                            quality={100}
                            alt={'Добавить образование'}
                            className="w-full h-auto object-cover max-w-[28px]"
                        />
                        {t.addEducation}
                    </button>
                </div>
            )}

            {/* Вкладка Специализации */}
            {activeTab === 'specialization' && (
                <div>
                    {doctorData && doctorData.specializationList && doctorData.specializationList.length > 0 ? (
                        doctorData.specializationList.map((spec) => (
                            <div key={spec.id} className="border-y border-[#EEEEEE] pb-[15px] mdl:pb-[30px] xl:py-[30px]">
                                <div className="mdl:flex mdl:justify-between w-full items-center">
                                    <p className="text-[16px] mdx:text-[18px] xl:text-[20px] max-w-[345px] font-semibold">
                                        {spec.name[locale]}
                                    </p>
                                    <div className="flex gap-[15px]">
                                        <button
                                            className="w-[223px] flex justify-center items-center bg-[#00863E] py-[12px] hover:bg-[#398f61]"
                                            onClick={() => handleEditSpecialization(spec)}
                                        >
                                            <p className="text-[#fff] font-extrabold">{t.edit}</p>
                                        </button>
                                        <button
                                            className="border p-[12px] w-[50px]"
                                            onClick={() => openConfirmDelete('specialization', spec.id)}
                                        >
                                            <Image
                                                src={close_green}
                                                width={28}
                                                height={28}
                                                quality={100}
                                                alt={t.delete}
                                                className="w-full h-auto object-cover max-w-[28px]"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">{t.noSpecializations}</p>
                    )}
                    <button
                        className="text-[22px] font-bold text-[#00863E] hover:text-[#32a065] flex gap-[10px] border-b py-[30px] items-center justify-center w-full"
                        onClick={() => setIsModalOpenSpecialization(true)}
                    >
                        <Image
                            src={plus_green}
                            width={28}
                            height={28}
                            quality={100}
                            alt={'Добавить специализацию'}
                            className="w-full h-auto object-cover max-w-[28px]"
                        />
                        {t.addSpecialization}
                    </button>
                </div>
            )}

            {/* Модальные окна */}
            <ModalAddSpecialization
                isOpen={isModalOpenSpecialization}
                onClose={() => setIsModalOpenSpecialization(false)}
                onSave={handleSaveSpecialization}
                locale={locale}
            />

            <ModalAddEducation
                isOpen={isModalOpenEducation}
                onClose={() => setIsModalOpenEducation(false)}
                onSave={handleSaveEducation}
                locale={locale}
            />

            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleConfirmDelete}
                message={getConfirmDeleteMessage()}
            />

            <ModalEditSpecialization
                isOpen={isEditSpecializationModalOpen}
                onClose={() => setIsEditSpecializationModalOpen(false)}
                onSave={handleUpdateSpecialization}
                specialization={currentSpecialization}
                locale={locale}
            />

            <ModalEditEducation
                isOpen={isEditEducationModalOpen}
                onClose={() => setIsEditEducationModalOpen(false)}
                onSave={handleUpdateEducation}
                education={currentEducation}
                locale={locale}
            />
        </div>
    );
}
