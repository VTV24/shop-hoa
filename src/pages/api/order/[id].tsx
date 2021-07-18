import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '~src/utils/dbConnect';
import Order from '~src/models/order';

const OrderDetail = async (req: NextApiRequest, res: NextApiResponse<IApiResult<IOrder>>) => {
    await dbConnect();
    if (req.method == 'PATCH') {
        try {
            if (req.query.id) {
                const _orders = await Order.findByIdAndUpdate(req.query.id, {
                    isConfirm: true,
                });
                res.send({
                    message: 'Đã xác nhận đơn hàng',
                    // @ts-ignore
                    data: _orders,
                });
            } else {
                res.status(404).send({
                    message: 'Đơn hàng không tồn tại',
                });
            }
        } catch {
            res.status(500).send({
                message: 'Lấy danh sách thất bại',
            });
        }
    } else {
        res.status(405);
    }
};

export default OrderDetail;
