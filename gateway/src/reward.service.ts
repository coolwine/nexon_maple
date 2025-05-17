import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RewardService {
  private axiosInstance = axios.create({ baseURL: 'http://event:3000' });

  /**
   * 보상 생성
   */
  async createReward(Authorization: string, body: any): Promise<any> {
    const headers = { Authorization };
    const { data } = await this.axiosInstance.post('/reward/create', body, {
      headers,
    });
    return data;
  }

  /**
   * 보상 요청
   */
  async requestReward(Authorization: string, body: any): Promise<any> {
    const headers = { Authorization };
    const { data } = await this.axiosInstance.post('/reward/request', body, {
      headers,
    });
    return data;
  }

  /**
   * 보상 요청 내역 조회
   */
  async rewardHistory(Authorization: string): Promise<any> {
    const headers = { Authorization };
    const { data } = await this.axiosInstance.get('/reward/history', {
      headers,
    });
    return data;
  }

  /**
   * 보상 요청 내역 조회
   */
  async rewardHistoryAll(Authorization: string): Promise<any> {
    const headers = { Authorization };
    const { data } = await this.axiosInstance.get('/reward/history/all', {
      headers,
    });
    return data;
  }

  /**
   * 보상 요청 내역 조회
   */
  async createRewardType(Authorization: string, body: any): Promise<any> {
    const headers = { Authorization };
    const { data } = await this.axiosInstance.post('/reward/type', body, {
      headers,
    });
    return data;
  }
}
