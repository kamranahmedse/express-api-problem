import { getStatusText, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { FormattedErrorType } from './mongoose-plugin';

export type ApiProblemOptionsType = {
  status?: number;
  title?: string;
  detail?: string | FormattedErrorType[];
  instance?: string;
  additional?: Record<string, any>;
  type?: string;
}

export type SpecErrorType = Omit<ApiProblemOptionsType, 'additional'> & Record<string, any>;

export class ApiProblem extends Error {
  status: number;
  title?: string;
  detail?: string | FormattedErrorType[];
  instance?: string;
  type?: string;

  constructor(props: ApiProblemOptionsType = {}) {
    super(props.title || 'Server Error');

    this.status = props.status || INTERNAL_SERVER_ERROR;
    this.title = props.title || getStatusText(this.status);
    this.detail = props.detail;
    this.instance = props.instance;
    this.type = props?.type;

    Object.assign(this, props.additional);
  }
}