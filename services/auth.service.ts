import { baseApi } from "@/api/api";
import { EndpointEnum } from "@/enum/endpoints.enum";
import { AxiosError } from "axios";

class AuthService {
  async signIn(
    data: SigninPayload
  ): Promise<{ access: string; refresh: string }> {
    try {
      const response = await baseApi.post(EndpointEnum.signin, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return Promise.reject(error?.response?.data);
      } else {
        return Promise.reject(error);
      }
    }
  }

  async signUp(data: SignupPayload): Promise<{ msg: string }> {
    try {
      const response = await baseApi.post(EndpointEnum.signup, data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return Promise.reject(error?.response?.data);
      } else {
        return Promise.reject(error);
      }
    }
  }

  async logOut(data: { refresh: string }): Promise<{ refresh: string }> {
    try {
      const response = await baseApi.post(EndpointEnum.logout, data);
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

export const authService = new AuthService();
