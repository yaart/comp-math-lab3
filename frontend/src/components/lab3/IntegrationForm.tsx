import React, { useEffect } from 'react';
import { IntegrationRequest } from '../../types';
import { useNumberInput } from "../../hook/useNumberInput";

interface Props {
    request: IntegrationRequest;
    setRequest: (req: IntegrationRequest) => void;
    onCalculate: () => void;
    loading: boolean;
}

const IntegrationForm = ({ request, setRequest, onCalculate, loading }: Props) => {
    const aInput = useNumberInput(request.a, (value) => setRequest({ ...request, a: value }));
    const bInput = useNumberInput(request.b, (value) => setRequest({ ...request, b: value }));
    const epsilonInput = useNumberInput(request.epsilon, (value) => setRequest({ ...request, epsilon: value }));

    useEffect(() => {
        aInput.setValue(request.a);
        bInput.setValue(request.b);
        epsilonInput.setValue(request.epsilon);
    }, [request.a, request.b, request.epsilon]);

    const isInvalid = request.a >= request.b;

    const hasInputErrors = !!(aInput.error || bInput.error || epsilonInput.error);

    const hasSingularity = () => {
        if (request.functionId === 4 && request.a <= 0 && request.b >= 0) return true;
        if (request.functionId === 5 && request.a < 2 && request.b > 2) return true;
        return false;
    };

    const isDivergent = () => {
        return request.functionId === 5 && request.a < 2 && request.b > 2;
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                {/* Поле A */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Нижний (a)</label>
                    <input
                        type="text"
                        value={aInput.value}
                        onChange={aInput.handleChange}
                        className={`w-full p-2 border rounded-md outline-none focus:ring-2 transition-all ${
                            aInput.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                        }`}
                        placeholder="a"
                    />
                    {aInput.error && (
                        <p className="text-[10px] text-red-500 mt-1">{aInput.error}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Верхний (b)</label>
                    <input
                        type="text"
                        value={bInput.value}
                        onChange={bInput.handleChange}
                        className={`w-full p-2 border rounded-md outline-none focus:ring-2 transition-all ${
                            isInvalid || bInput.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                        }`}
                        placeholder="b"
                    />
                    {bInput.error && (
                        <p className="text-[10px] text-red-500 mt-1">{bInput.error}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Точность (ε)</label>
                    <input
                        type="text"
                        value={epsilonInput.value}
                        onChange={epsilonInput.handleChange}
                        className={`w-full p-2 border rounded-md outline-none focus:ring-2 transition-all ${
                            epsilonInput.error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                        }`}
                        placeholder="0.01"
                    />
                    {epsilonInput.error && (
                        <p className="text-[10px] text-red-500 mt-1">{epsilonInput.error}</p>
                    )}
                </div>
            </div>

            {isInvalid && !aInput.error && !bInput.error && (
                <p className="text-red-500 text-xs">Граница 'a' должна быть строго меньше 'b'</p>
            )}

            {hasSingularity() && (
                <div className={`p-3 rounded-lg animate-in fade-in slide-in-from-top-1 ${
                    isDivergent() ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                    <p className={`text-sm font-medium ${
                        isDivergent() ? 'text-red-700' : 'text-yellow-800'
                    }`}>
                        {isDivergent()
                            ? 'Интеграл расходится на этом интервале!'
                            : 'Функция имеет разрыв на интервале. Будет использован метод для несобственных интегралов.'}
                    </p>
                </div>
            )}

            <button
                onClick={onCalculate}
                disabled={loading || isInvalid || hasInputErrors}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors shadow-lg shadow-indigo-200"
            >
                {loading ? 'Вычисление...' : 'Рассчитать интеграл'}
            </button>
        </div>
    );
};

export default IntegrationForm;