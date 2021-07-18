type IOrder = {
    _id: string;
    name: string;
    userId: string;
    email: string;
    phone?: string;
    address: string;
    totalPrice: number;
    detail: ICart[];
    isConfirm: boolean;
};
