import React from 'react';

const METHODS = [
    { id: 1, name: "Левые прямоугольники" },
    { id: 2, name: "Правые прямоугольники" },
    { id: 3, name: "Средние прямоугольники" },
    { id: 4, name: "Метод трапеций" },
    { id: 5, name: "Метод Симпсона" },
    { id: 6, name: "Метод Монте-Карло" },
];

const MethodSelector = ({ selected, onChange }: { selected: number, onChange: (id: number) => void }) => {
    return (
        <div>
            <label className="block text-sm font-semibold mb-2 uppercase text-gray-500">Метод решения</label>
            <select
                value={selected}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
            >
                {METHODS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>
        </div>
    );
};

export default MethodSelector;