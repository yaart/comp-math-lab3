import React from 'react';

const FUNCTIONS = [
    { id: 1, formula: "4x³ - 3x² + 5x - 20", type: "continuous" },
    { id: 2, formula: "2x³ - 5x² - 3x + 21", type: "continuous" },
    { id: 3, formula: "x³ - 3x² + 6x - 19", type: "continuous" },
    { id: 4, formula: "1/√|x|", type: "singular", point: 0, convergent: true },
    { id: 5, formula: "1/(x-2)", type: "singular", point: 2, convergent: false },
    { id: 6, formula: "sin(x)", type: "continuous" }
];

const FunctionSelector = ({ selected, onChange }: { selected: number, onChange: (id: number) => void }) => {
    return (
        <div>
            <label className="block text-sm font-semibold mb-2 uppercase text-gray-500">Выберите функцию</label>
            <div className="space-y-2">
                {FUNCTIONS.map(f => (
                    <div
                        key={f.id}
                        onClick={() => onChange(f.id)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            selected === f.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-serif">∫ ({f.formula}) dx</span>
                            {f.type === 'singular' && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    f.convergent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {f.convergent ? `Сход. (разрыв в x=${f.point})` : `Расход. (разрыв в x=${f.point})`}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FunctionSelector;