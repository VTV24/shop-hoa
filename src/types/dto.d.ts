type ILoginRequest = {
    email: string;
    password: string;
};

type ISignUpData = {
    name: string;
    email: string;
    password: string;
    address: string;
    phone: string;
};

type ILoginResult = IApiResult<Omit<IUser, 'password'>>;

type IApiResult<IData = any> = {
    message: string;
    data?: IData;
};
