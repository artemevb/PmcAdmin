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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-md p-6 relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t.nameRu}</label>
                        <input
                            type="text"
                            value={formData.name.ru}
                            onChange={(e) => handleChange(e, 'name', 'ru')}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t.nameUz}</label>
                        <input
                            type="text"
                            value={formData.name.uz}
                            onChange={(e) => handleChange(e, 'name', 'uz')}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t.priceRu}</label>
                        <input
                            type="text"
                            value={formData.price.ru}
                            onChange={(e) => handleChange(e, 'price', 'ru')}
                            required
                            placeholder="150000 сум"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t.priceUz}</label>
                        <input
                            type="text"
                            value={formData.price.uz}
                            onChange={(e) => handleChange(e, 'price', 'uz')}
                            required
                            placeholder="150000 som"
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    {createError && <p className="text-red-500 text-sm">{createError}</p>}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
                        >
                            {t.cancel}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#00863E] text-white rounded-md hover:bg-[#006f34]"
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
