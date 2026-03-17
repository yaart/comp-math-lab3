import axios from 'axios';
import { IntegrationRequest, IntegrationResponse } from '../types';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

export const lab3Api = {
    calculate: (data: IntegrationRequest) =>
        API.post<IntegrationResponse>('/lab3/calculate', data),
};