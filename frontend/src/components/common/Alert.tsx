import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
    type: 'error' | 'success' | 'info' | 'warning';
    message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
    const styles = {
        error: 'bg-red-50 border-red-200 text-red-700',
        success: 'bg-green-50 border-green-200 text-green-700',
        info: 'bg-blue-50 border-blue-200 text-blue-700',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-700'
    };

    const icons = {
        error: <XCircle className="w-5 h-5 text-red-500" />,
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertCircle className="w-5 h-5 text-yellow-500" />
    };

    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${styles[type]}`}>
            <div className="flex-shrink-0 mt-0.5">
                {icons[type]}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium">{message}</p>
            </div>
        </div>
    );
};