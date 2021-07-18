import { instance } from './instance';

class AccountApi {
    login = (data: ILoginRequest) => instance.post<ILoginResult>('/api/signin', data);

    register = (data: Omit<IUser, '_id'>) => instance.post<IApiResult>('/api/signup', data);

    getInfo = (data: Omit<ILoginRequest, 'password'>) => instance.post<ILoginResult>('api/get-info', data);
}

const accountApi = new AccountApi();

export default accountApi;
