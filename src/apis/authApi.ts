import { axiosConfiguration } from "../configurations/AxiosConfiguration";

export const loginGoogle = async (code: string) => {
    const res = await axiosConfiguration.post('/auth/google', { code, redirectUri: 'http://localhost:5173/login' });
    return res.data;
}