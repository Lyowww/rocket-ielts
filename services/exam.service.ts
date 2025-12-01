import { baseApi } from "@/api/api";
import { EndpointEnum } from "@/enum/endpoints.enum";
import {
  HistoricalExamListResponse,
  HistoricalExamQueryParams,
} from "@/types/historical-exam";
import { AxiosError } from "axios";

class ExamService {
  async getHistoricalExams(
    params?: HistoricalExamQueryParams
  ): Promise<HistoricalExamListResponse> {
    try {
      const response = await baseApi.get(EndpointEnum.historicalExams, {
        params,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return Promise.reject(error?.response?.data ?? error);
      }
      return Promise.reject(error);
    }
  }

  async getHistoricalExamById(id: number): Promise<HistoricalExam> {
    try {
      const response = await baseApi.get(`${EndpointEnum.historicalExamDetail}${id}/`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return Promise.reject(error?.response?.data ?? error);
      }
      return Promise.reject(error);
    }
  }
}

export const examService = new ExamService();

