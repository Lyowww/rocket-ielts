import { baseApi } from "@/api/api";
import { EndpointEnum } from "@/enum/endpoints.enum";
import { AxiosError } from "axios";

class QuestionService {
  async uploadQuestion(
    data: UploadQuestionPayload
  ): Promise<{ results: string }> {
    try {
      const response = await baseApi.post(EndpointEnum.uploadQuestion, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return Promise.reject(error?.response?.data);
      } else {
        return Promise.reject(error);
      }
    }
  }
  async getQuestions(data: {
    exam_type: string;
    task_number: string;
  }): Promise<{ question: string; question_path: string }> {
    try {
      const response = await baseApi.post(EndpointEnum.getQuestios, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return Promise.reject(error?.response?.data);
      } else {
        return Promise.reject(error);
      }
    }
  }
  async submitAnswer(data: SubmitQuestionPayload): Promise<SubmitAnswer> {
    try {
      const response = await baseApi.post(EndpointEnum.submitAnswer, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return Promise.reject(error?.response?.data);
      } else {
        return Promise.reject(error);
      }
    }
  }
}

export const questionService = new QuestionService();
