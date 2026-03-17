import React from 'react';
import { IntegrationResponse } from '../../types';

const ResultsTable = ({ response }: { response: IntegrationResponse }) => {
    const formatNumber = (value: number | undefined | null): string => {
        if (value === undefined || value === null) return '—';
        if (typeof value !== 'number') return '—';
        if (isNaN(value)) return 'NaN';
        if (!isFinite(value)) return '∞';
        return value.toString();
    };

    const formatExponential = (value: number | undefined | null): string => {
        if (value === undefined || value === null) return '—';
        if (typeof value !== 'number') return '—';
        if (isNaN(value)) return 'NaN';
        if (!isFinite(value)) return '∞';
        return value.toString();
    };

    return (
        <div className="mt-6 overflow-hidden border rounded-lg">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                    <th className="px-4 py-3">Параметр</th>
                    <th className="px-4 py-3">Значение</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                <tr>
                    <td className="px-4 py-3 font-medium text-gray-600">Приближенное значение (I)</td>
                    <td className="px-4 py-3 text-black font-bold font-mono">
                        {formatNumber(response.result)}
                    </td>
                </tr>

                {response.exactValue !== undefined && response.exactValue !== null &&
                    !isNaN(response.exactValue) && isFinite(response.exactValue) && (
                        <tr>
                            <td className="px-4 py-3 font-medium text-gray-600">Точное значение</td>
                            <td className="px-4 py-3 text-black font-mono">
                                {formatNumber(response.exactValue)}
                            </td>
                        </tr>
                    )}

                <tr>
                    <td className="px-4 py-3 font-medium text-gray-600">Кол-во разбиений (n)</td>
                    <td className="px-4 py-3">{response.n}</td>
                </tr>

                <tr>
                    <td className="px-4 py-3 font-medium text-gray-600">Абсолютная погрешность</td>
                    <td className="px-4 py-3 text-black font-mono">
                        {formatExponential(response.error)}
                    </td>
                </tr>

                {response.isImproper && (
                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-600">Тип интеграла</td>
                        <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                response.functionType === 'divergent'
                                    ? 'bg-red-100 text-red-700'
                                    : response.functionType === 'convergent improper'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-green-100 text-green-700'
                            }`}>
                                {response.functionType === 'divergent' && 'Несобственный (расходится)'}
                                {response.functionType === 'convergent improper' && 'Несобственный (сходится)'}
                                {response.functionType === 'continuous' && 'Обычный'}
                            </span>
                        </td>
                    </tr>
                )}

                {response.singularityType && response.singularityType !== 'Нет особых точек' && (
                    <tr>
                        <td className="px-4 py-3 font-medium text-gray-600">Особая точка</td>
                        <td className="px-4 py-3 text-red-500 font-medium">{response.singularityType}</td>
                    </tr>
                )}

                <tr>
                    <td className="px-4 py-3 font-medium text-gray-600">Статус</td>
                    <td className={`px-4 py-3 font-bold ${
                        response.status === 'success' ? 'text-green-600' :
                            response.status === 'warning' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                        {response.message}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;