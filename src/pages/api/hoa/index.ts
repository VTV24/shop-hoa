import { FilterQuery } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import Hoa from '~src/models/hoa';
import Loai from '~src/models/loai';
import dbConnect from '~src/utils/dbConnect';

const Hoas = async (req: NextApiRequest, res: NextApiResponse<IApiResult<IHoa[]>>) => {
    await dbConnect();
    if (req.method == 'GET') {
        try {
            console.log(req.query);
            const {
                sort = 'name',
                dsc = 'false',
                gte = 0,
                lte = 10000000,
                type = '',
                search = '',
            } = req.query as IQueryHoa;
            const _query: FilterQuery<ILoai> = {};
            if (type != '') {
                _query.code = type;
            }
            const _loais: string[] = (await Loai.find(_query)).map((l) => l._id);
            const _hoaQuery: FilterQuery<IHoa> = {
                typeId: {
                    $in: _loais,
                },
                price: {
                    $gte: gte,
                    $lte: lte,
                },
            };
            if (search != '') {
                _hoaQuery.$text = {
                    $search: search,
                };
            }

            const _hoas: IHoa[] = await Hoa.find(_hoaQuery).sort({ [sort as string]: dsc == 'true' ? -1 : 1 });
            res.send({
                message: 'Thành công',
                data: _hoas,
            });
        } catch (err) {
            console.log(err);

            res.status(500).send({
                message: 'Lấy danh sách thất bại',
            });
        }
    }
    if (req.method == 'POST') {
        try {
            const hoa: IHoa = req.body;
            const newHoa = await new Hoa(hoa).save();
            res.send({
                message: 'Thêm hoa mới thành công',
                data: [newHoa],
            });
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: 'Thêm hoa thất bại',
            });
        }
    } else {
        res.status(405);
    }
};

export default Hoas;
