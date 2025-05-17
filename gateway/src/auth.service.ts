import axios, { AxiosRequestConfig } from 'axios';
import { HttpException, Injectable } from '@nestjs/common';
import { API_ENDPOINTS, HTTP_ERROR_MESSAGES, HTTP_STATUS } from './constants';

export interface Resister {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface Login {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private async fetch(url = '', options: AxiosRequestConfig): Promise<any> {
    try {
      const response = await axios({ ...options, url });
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || HTTP_ERROR_MESSAGES.AUTH_ERROR,
        error.response?.status || HTTP_STATUS.SERVER_ERROR,
      );
    }
  }

  public async register(data: Resister): Promise<any> {
    return this.fetch(`${API_ENDPOINTS.SERVICES.AUTH_SERVICE}/register`, {
      method: 'post',
      data,
    });
  }

  public async login(data: Login): Promise<any> {
    return this.fetch(`${API_ENDPOINTS.SERVICES.AUTH_SERVICE}/login`, {
      method: 'post',
      data,
    });
  }
}
