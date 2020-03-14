import { getStatusText, INTERNAL_SERVER_ERROR } from 'http-status-codes';

export interface IApiProblem {
  status?: number;
  title?: string;
  description?: string;
  additional?: Record<string, any>;
  type?: string;
}

class ApiProblem extends Error implements IApiProblem {
  status: number;
  title?: string;
  description?: string;
  additional?: Record<string, any>;
  type?: string;

  constructor(props: IApiProblem) {
    super(props.title);

    this.status = props.status || INTERNAL_SERVER_ERROR;
    this.title = props.title || getStatusText(this.status) || 'Unknown error';
    this.additional = props.additional;
    this.description = props.description;
    this.type = props?.additional?.type || 'https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html';
  }

  toJSON(): string {
    return JSON.stringify({
      additional: this.additional,
      description: this.description,
      status: this.status,
      title: this.title
    });
  }
}

export default ApiProblem;
