import React from 'react';

export default function Modal({
    isOpen,
    onClose,
    title,
    formData,
    handleChange,
    handleSubmit,
    createError,
    successMessage,
    loading,
    t,
}) {
    if (!isOpen) return null; // Если модальное окно не открыто, ничего не рендерим

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-11/12 max-w-[1235px] p-6 relative">
                <button
                    className="absolute top-2 right-[20px] text-[#454545] text-[40px]"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h3 className="text-[30px] font-bold mb-[40px] border-b pb-[30px]">{title}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#A6A6A6]">{t.nameRu}</label>
                        <input
                            type="text"
                            value={formData.name.ru}
                            onChange={(e) => handleChange(e, 'name', 'ru')}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#A6A6A6]">{t.nameUz}</label>
                        <input
                            type="text"
                            value={formData.name.uz}
                            onChange={(e) => handleChange(e, 'name', 'uz')}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#A6A6A6]">{t.priceRu}</label>
                        <input
                            type="text"
                            value={formData.price.ru}
                            onChange={(e) => handleChange(e, 'price', 'ru')}
                            required
                            placeholder="150000 сум"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#A6A6A6]">{t.priceUz}</label>
                        <input
                            type="text"
                            value={formData.price.uz}
                            onChange={(e) => handleChange(e, 'price', 'uz')}
                            required
                            placeholder="150000 som"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
                        />
                    </div>
                    {/* {createError && <p className="text-red-500 text-sm">{createError}</p>} */}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                    <div className="flex justify-end space-x-2 pt-[50px]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-[60px] py-[15px] bg-gray-200 text-gray-700"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="px-[60px] py-[15px] bg-[#00863E] text-white hover:bg-[#006f34]"
                            disabled={loading}
                        >
                            {loading ? t.loading : t.submit}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
