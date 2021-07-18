import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '~src/utils/dbConnect';
import Hoa from '~src/models/hoa';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    const data = await Hoa.find({});
    res.status(200).json(data);
};

export default handler;
