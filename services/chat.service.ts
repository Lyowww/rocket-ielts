import { baseApi } from "@/api/api";
import { EndpointEnum } from "@/enum/endpoints.enum";
import { AxiosError } from "axios";

class ChatService {
  async getChatQuestion(data: SubmitQuestionPayload): Promise<SubmitAnswer> {
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

  async answerChatQuestion(data: SubmitQuestionPayload): Promise<SubmitAnswer> {
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

export const chatService = new ChatService();
