import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '~src/utils/dbConnect';
import Order from '~src/models/order';
import { getSession } from 'next-auth/client';
import nodemailer from 'nodemailer';
import mail from '~src/utils/mail';

const LoaiHoa = async (req: NextApiRequest, res: NextApiResponse<IApiResult<IOrder[]>>) => {
    await dbConnect();
    if (req.method == 'GET') {
        try {
            const _orders = await Order.find({});
            res.send({
                message: 'Thành công',
                data: _orders,
            });
        } catch {
            res.status(500).send({
                message: 'Lấy danh sách thất bại',
            });
        }
    }
    if (req.method == 'POST') {
        try {
            const session = await getSession({ req });
            if (session?.user?._id) {
                const order: IOrder = req.body;
                const newOrder = await new Order(order).save();

                const transporter = nodemailer.createTransport(process.env.MAIL_SERVER);

                const mailInfo = await transporter.sendMail({
                    from: process.env.MAIL_FROM,
                    to: order.email,
                    subject: `Xác nhận đặt hàng: ${newOrder._id}`,
                    html: mail(newOrder),
                });

                if (mailInfo.accepted) {
                    res.send({
                        message: 'Tạo đơn hàng thành công',
                        data: [newOrder],
                    });
                } else {
                    res.send({
                        message: 'Địa chỉ mail không đúng',
                        data: [newOrder],
                    });
                }
            } else {
                res.status(403).send({
                    message: 'Vui lòng đăng nhập',
                });
            }
        } catch {
            res.status(500).send({
                message: 'Tạo đơn hàng thất bại',
            });
        }
    } else {
        res.status(405);
    }
};

export default LoaiHoa;
