import { instance } from './instance';

class LoaiApi {
    get = () => instance.get<IApiResult<ILoai[]>>('/api/loai');
    detail = (id: string) => instance.get<IApiResult<ILoai>>(`/api/loai/${id}`);

    post = (data: ILoai) => instance.post<IApiResult>('/api/loai', data);
    put = (id: string, data: ILoai) => instance.put<IApiResult>(`/api/loai/${id}`, data);
}

const loaiApi = new LoaiApi();

export default loaiApi;
