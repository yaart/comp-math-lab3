import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { IntegrationRequest } from '../../types';

interface FileUploadProps {
    onDataLoaded: (data: IntegrationRequest) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>('');

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            parseFile(content);
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
        setFileName(file.name);
    };

    const parseFile = (content: string) => {
        try {
            const lines = content.split('\n')
                .map(l => l.trim())
                .filter(l => l.length > 0);

            if (lines.length < 4) {
                throw new Error("Формат: func_id, method_id, a b, eps (всего 4 строки)");
            }

            const functionId = parseInt(lines[0]);
            const methodId = parseInt(lines[1]);
            const limits = lines[2].split(/[,\s]+/).filter(Boolean).map(Number);
            const epsilon = parseFloat(lines[3]);

            if (isNaN(functionId)) throw new Error("Некорректный ID функции (строка 1)");
            if (isNaN(methodId)) throw new Error("Некорректный ID метода (строка 2)");
            if (limits.length < 2 || isNaN(limits[0]) || isNaN(limits[1])) {
                throw new Error("Некорректные пределы a и b (строка 3)");
            }
            if (isNaN(epsilon)) throw new Error("Некорректная точность epsilon (строка 4)");
            if (limits[0] >= limits[1]) throw new Error("Предел 'a' должен быть меньше 'b'");

            onDataLoaded({
                functionId,
                methodId,
                a: limits[0],
                b: limits[1],
                epsilon
            });

            toast.success('Данные успешно импортированы');
        } catch (err: any) {
            toast.error(err.message || "Ошибка парсинга файла");
            setFileName('');
        }
    };

    const clearFile = () => {
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-[10px] font-black uppercase tracking-widest rounded shadow-sm"
            >
                <Upload className="w-3.5 h-3.5 text-indigo-500" />
                {fileName ? 'Заменить данные' : 'Загрузить .txt'}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
            />

            {fileName && (
                <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded animate-in fade-in slide-in-from-left-2">
                    <span className="text-[9px] text-indigo-600 font-mono font-bold truncate max-w-[100px]">
                        {fileName}
                    </span>
                    <button
                        onClick={clearFile}
                        className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                    >
                        <X className="w-2.5 h-2.5 text-indigo-400" />
                    </button>
                </div>
            )}
        </div>
    );
};