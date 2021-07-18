import { NextApiRequest, NextApiResponse } from 'next';
import Hoa from '~src/models/hoa';
import dbConnect from '~src/utils/dbConnect';

const HoaDetail = async (req: NextApiRequest, res: NextApiResponse<IApiResult<IHoa>>) => {
    await dbConnect();
    if (req.method == 'GET') {
        try {
            const id = req.query.id;
            const _hoa = await Hoa.findById(id);
            if (_hoa) {
                res.send({
                    message: 'Hoa nè',
                    data: _hoa as IHoa,
                });
            } else {
                res.status(500).send({
                    message: 'Không tìm thây hoa',
                });
            }
        } catch {
            res.status(500).send({
                message: 'Lỗi xử lí',
            });
        }
    }
    if (req.method == 'PUT') {
        try {
            const id = req.query.id;
            const { _id, ...hoa } = req.body;
            await Hoa.findByIdAndUpdate(id, hoa);
            res.send({
                message: 'Cập nhật hoa thành công',
            });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: 'Cập nhật hoa thất bại',
            });
        }
    }
    if (req.method == 'DELETE') {
        try {
            const id = req.query.id;
            await Hoa.findByIdAndDelete(id);
            res.send({
                message: 'Đã xóa hoa',
            });
        } catch {
            res.status(500).send({
                message: 'Lỗi xử lí',
            });
        }
    } else {
        res.status(405);
    }
};

export default HoaDetail;
