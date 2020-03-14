export interface IApiProblem {
    status?: number;
    title?: string;
    description?: string;
    additional?: Record<string, any>;
    type?: string;
}
declare class ApiProblem extends Error implements IApiProblem {
    status: number;
    title?: string;
    description?: string;
    additional?: Record<string, any>;
    type?: string;
    constructor(props: IApiProblem);
    toJSON(): string;
}
export default ApiProblem;
