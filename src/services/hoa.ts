import { instance } from './instance';

class HoaApi {
    get = (query?: IQueryHoa) =>
        instance.get<IApiResult<IHoa[]>>('/api/hoa', {
            params: query,
        });
    detail = (id: string) => instance.get<IApiResult<IHoa>>(`/api/hoa/${id}`);
    post = (data: IHoa) => instance.post<IApiResult<IHoa>>('/api/hoa', data);
    delete = (id: string) => instance.delete<IApiResult>(`/api/hoa/${id}`);
    put = (id: string, data: IHoa) => instance.put<IApiResult<IHoa>>(`/api/hoa/${id}`, data);
}

const hoaApi = new HoaApi();

export default hoaApi;
