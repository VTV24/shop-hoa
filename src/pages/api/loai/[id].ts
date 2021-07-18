import { NextApiRequest, NextApiResponse } from 'next';
import Loai from '~src/models/loai';
import dbConnect from '~src/utils/dbConnect';

const LoaiHoaDetail = async (req: NextApiRequest, res: NextApiResponse<IApiResult<ILoai>>) => {
    await dbConnect();
    if (req.method == 'GET') {
        try {
            const id = req.query.id;
            const _loai = await Loai.findById(id);
            if (_loai) {
                res.send({
                    message: 'Hoa nè',
                    data: _loai as ILoai,
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
            const { _id, ...loai } = req.body;
            await Loai.findByIdAndUpdate(id, loai);
            res.send({
                message: 'Cập nhật hoa thành công',
            });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: 'Cập nhật hoa thất bại',
            });
        }
    } else {
        res.status(405);
    }
};

export default LoaiHoaDetail;
