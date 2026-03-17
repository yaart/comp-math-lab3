import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Calculator, AlertCircle, Info } from "lucide-react";

import MethodSelector from "../components/lab3/MethodSelector";
import { Header } from "./Header";
import IntegrationForm from "../components/lab3/IntegrationForm";
import IntegrationChart from "../components/lab3/IntegrationChart";
import ResultsTable from "../components/lab3/ResultsTable";
import { FileUpload } from "../components/common/FileUpload";
import FunctionSelector from "../components/lab3/FunctionSelector";

import { lab3Api } from '../services/api';
import { IntegrationRequest, IntegrationResponse } from '../types';

const IntegrationPage: React.FC = () => {
    const [request, setRequest] = useState<IntegrationRequest>({
        functionId: 1,
        methodId: 5,
        a: 0,
        b: 2,
        epsilon: 0.001
    });

    const [response, setResponse] = useState<IntegrationResponse | null>(null);
    const [loading, setLoading] = useState(false);


    const handleCalculate = async () => {
        setLoading(true);
        setResponse(null);

        try {
            const res = await lab3Api.calculate(request);

            if (res.data) {
                setResponse(res.data);

                if (res.data.status === 'error') {
                    toast.error(res.data.message || 'Ошибка вычисления');
                } else if (res.data.status === 'warning') {
                    toast.custom((t) => (
                        <div className="bg-orange-50 text-orange-800 px-4 py-3 rounded-lg shadow-lg border border-orange-200 flex items-center gap-2">
                            <span className="text-xl">⚠️</span>
                            <span className="font-medium">{res.data.message}</span>
                        </div>
                    ), { duration: 5000 });
                } else {
                    toast.success('Расчет выполнен успешно');
                }
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Ошибка при связи с сервером";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleFileLoaded = (data: IntegrationRequest) => {
        setRequest(data);
        setResponse(null);
    };

    const hasGraphPoints = response?.graphPoints && response.graphPoints.length > 0;

    return (
        <div className="min-h-screen bg-slate-50 pb-12 font-sans text-slate-800">
            <Header />

            <main className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">


                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Конфигурация</h2>
                                <FileUpload onDataLoaded={handleFileLoaded} />
                            </div>

                            <div className="space-y-6">
                                <FunctionSelector
                                    selected={request.functionId}
                                    onChange={(id) => setRequest({...request, functionId: id})}
                                />
                                <MethodSelector
                                    selected={request.methodId}
                                    onChange={(id) => setRequest({...request, methodId: id})}
                                />
                                <IntegrationForm
                                    request={request}
                                    setRequest={setRequest}
                                    onCalculate={handleCalculate}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
                            {response ? (
                                <div className="animate-in zoom-in-95 duration-300">
                                    <div className="border-b border-slate-100 pb-4 mb-4 flex justify-between items-center">
                                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                                            Результаты
                                        </h2>
                                        {loading && <span className="text-[10px] animate-pulse text-indigo-500 font-bold">ОБНОВЛЕНИЕ...</span>}
                                    </div>

                                    {hasGraphPoints ? (
                                        <IntegrationChart
                                            points={response.graphPoints}
                                            a={request.a}
                                            b={request.b}
                                        />
                                    ) : (
                                        <div className="h-[300px] my-4 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-xl px-6">
                                            <AlertCircle className="text-slate-300 mb-2" size={32} />
                                            <p className="text-[11px] text-slate-500 text-center max-w-[300px]">
                                                График недоступен для выбранного интервала или точности.
                                                Числовые данные приведены в таблице ниже.
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6">
                                        <ResultsTable response={response} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                    <div className="bg-slate-50 p-6 rounded-full mb-4">
                                        <Calculator size={40} className="opacity-10" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 text-center max-w-[250px]">
                                        {loading ? 'Вычисление...' : 'Ожидание параметров'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default IntegrationPage;