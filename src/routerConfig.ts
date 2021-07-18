const routers: IRouter[] = [
    {
        name: 'Trang chủ',
        path: '/',
    },
    {
        name: 'Hoa',
        path: '/hoa',
    },
    {
        name: 'Giỏ hàng',
        path: '/cart',
        role: ['admin', 'user'],
        hidden: true,
    },
    {
        name: 'Quản lí',
        path: '/manage',
        role: ['admin'],
        hidden: true,
    },
    {
        name: 'Quản lí hoa',
        path: '/manage/hoa',
        role: ['admin'],
    },
    {
        name: 'Quản lí loại hoa',
        path: '/manage/loai',
        role: ['admin'],
    },
    {
        name: 'Quản lí đơn hàng',
        path: '/manage/order',
        role: ['admin'],
    },
];

export default routers;
