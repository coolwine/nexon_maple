import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EventService {
  private axiosInstance = axios.create({ baseURL: 'http://event:3000' });

  async list(Authorization: string): Promise<any> {
    const headers = { Authorization };
    const { data } = await this.axiosInstance.get('/event', { headers });
    return data;
  }

  async detail(Authorization: string, id: string): Promise<any> {
    const headers = { Authorization };
    const { data } = await this.axiosInstance.get(`/event/${id}`, { headers });
    return data;
  }

  /**
   * 이벤트 생성
   */
  async create(Authorization: string, body: any): Promise<any> {
    const headers = { Authorization };
    const { data } = await this.axiosInstance.post('/event', body, {
      headers,
    });
    return data;
  }
}
