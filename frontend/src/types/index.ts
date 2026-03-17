export interface IntegrationRequest {
    functionId: number;
    methodId: number;
    a: number;
    b: number;
    epsilon: number;
}

export interface PointDTO {
    x: number;
    y: number;
}

export interface IntegrationResponse {
    result: number;
    n: number;
    error: number;
    exactValue?: number;
    graphPoints: PointDTO[];
    status: string;
    message: string;
    isImproper?: boolean;
    functionType?: string;
    singularityType?: string;
}