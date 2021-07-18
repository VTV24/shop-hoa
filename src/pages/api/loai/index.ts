import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '~src/utils/dbConnect';
import Loai from '~src/models/loai';

const LoaiHoa = async (req: NextApiRequest, res: NextApiResponse<IApiResult<ILoai[]>>) => {
    await dbConnect();
    if (req.method == 'GET') {
        try {
            const _loai: ILoai[] = await Loai.find({});
            res.send({
                message: 'Thành công',
                data: _loai,
            });
        } catch {
            res.status(500).send({
                message: 'Lấy danh sách thất bại',
            });
        }
    }
    if (req.method == 'POST') {
        try {
            const loai: ILoai = req.body;
            const newLoai = await new Loai(loai).save();
            res.send({
                message: 'Thêm loại hoa mới thành công',
                data: [newLoai],
            });
        } catch {
            res.status(500).send({
                message: 'Thêm loại hoa thất bại',
            });
        }
    } else {
        res.status(405);
    }
};

export default LoaiHoa;
