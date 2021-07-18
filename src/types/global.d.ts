type IRouter = {
    role?: ('admin' | 'user')[];
    name: string;
    path: string;
    hidden?: boolean;
};

type IQueryHoa = {
    sort?: keyof IHoa;
    dsc?: boolean;
    search?: string;
    type?: string;
    gte?: number;
    lte?: number;
};

type ICart = { hoa: IHoa; quantity: number };
