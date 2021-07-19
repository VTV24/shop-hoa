type IRouter = {
    role?: ('admin' | 'user')[];
    name: string;
    path: string;
    hidden?: boolean;
};

type IQueryHoa = {
    sort?: keyof IHoa;
    dsc?: string;
    search?: string;
    type?: string;
    gte?: number;
    lte?: number;
};

type ICart = { hoa: IHoa; quantity: number };
