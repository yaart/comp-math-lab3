import React from 'react';
import { IntegrationRequest } from '../../types';

interface Props {
    request: IntegrationRequest;
    setRequest: (req: IntegrationRequest) => void;
    onCalculate: () => void;
    loading: boolean;
}

const IntegrationForm = ({ request, setRequest, onCalculate, loading }: Props) => {
    const isInvalid = request.a >= request.b;

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
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Нижний (a)</label>
                    <input
                        type="number"
                        value={request.a}
                        onChange={e => setRequest({...request, a: parseFloat(e.target.value) || 0})}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Верхний (b)</label>
                    <input
                        type="number"
                        value={request.b}
                        onChange={e => setRequest({...request, b: parseFloat(e.target.value) || 0})}
                        className={`w-full p-2 border rounded-md outline-none focus:ring-2 ${isInvalid ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Точность (ε)</label>
                    <input
                        type="number"
                        step="0.0001"
                        min="0.0001"
                        value={request.epsilon}
                        onChange={e => setRequest({...request, epsilon: parseFloat(e.target.value) || 0.01})}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {isInvalid && (
                <p className="text-red-500 text-xs">Граница 'a' должна быть строго меньше 'b'</p>
            )}

            {hasSingularity() && (
                <div className={`p-3 rounded-lg ${
                    isDivergent() ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                }`}>
                    <p className={`text-sm font-medium ${
                        isDivergent() ? 'text-red-700' : 'text-black-600'
                    }`}>
                        {isDivergent()
                        ? 'Интеграл расходится на этом интервале!'
                        : 'Функция имеет разрыв на интервале. Будет использован метод для несобственных интегралов.'}
                    </p>
                </div>
            )}

            <button
                onClick={onCalculate}
                disabled={loading || isInvalid}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 transition-colors shadow-lg shadow-indigo-200"
            >
                {loading ? 'Вычисление...' : 'Рассчитать интеграл'}
            </button>
        </div>
    );
};

export default IntegrationForm;