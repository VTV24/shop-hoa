import axios, { AxiosError, AxiosResponse } from 'axios';

export const instance = axios.create({
    baseURL: process.env.NEXTAUTH_URL,
    headers: {
        'content-type': 'application/json',
    },
    timeout: 10000 /** 10s time out throw network error */,
});

export const setUserId = (userId: string) => {
    instance.defaults.headers['userId'] = userId;
};

export const removeUserId = () => {
    delete instance.defaults.headers['userId'];
};

const getUrl = (config: any) => {
    if (config.baseURL) {
        return config.url.replace(config.baseURL, '').split('?')[0];
    }
    return config.url;
};

instance.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(
            ` %c ${response.status} - ${getUrl(response.config)}:`,
            'color: #008000; font-weight: bold',
            response,
        );
        return response;
    },
    function (error: AxiosError) {
        if (error.response) {
            // server trả response về là lỗi code đã handle
            console.log(`%c ${error.response?.status}  :`, 'color: red; font-weight: bold', error.response?.data);

            return Promise.reject({
                title: error.response?.status,
                description: error.response?.data.message || 'Lỗi chưa xác định',
                status: 'error',
            });
        } else if (error.request) {
            // request mãi mãi ko thấy response
            // `error.request` là XMLHttpRequest trong website còn nodejs là http.ClientRequest
            console.log(`%c ${JSON.stringify(error)}  :`, 'color: red; font-weight: bold');
            return Promise.reject({
                summary: 'Lỗi kết nỗi',
                type: 'error',
                detail: 'Vui lòng kiểm tra lại kết nối mạng',
            });
        } else {
            console.log(
                `%c ${JSON.stringify(error)}  :`,
                'color: red; font-weight: bold',
                'có gì đó sai sai, hình như là setting sai',
            );
            return Promise.reject(error);
        }
    },
);
