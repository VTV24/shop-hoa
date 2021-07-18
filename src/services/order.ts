import { instance } from './instance';

class OrderApi {
    get = () => instance.get<IApiResult<IOrder[]>>('/api/order');
    detail = (id: string) => instance.get<IApiResult<IOrder>>(`/api/order/${id}`);

    post = (data: IOrder) => instance.post<IApiResult>('/api/order', data);
    confirm = (id: string) => instance.patch<IApiResult>(`/api/order/${id}`);
}

const orderApi = new OrderApi();

export default orderApi;
