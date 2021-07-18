import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';
import User from '~src/models/user';
import dbConnect from '~src/utils/dbConnect';

const SignUp = async (req: NextApiRequest, res: NextApiResponse) => {
    await dbConnect();
    if (req.method == 'POST') {
        try {
            console.log(req.body);
            const { email, password, name, address, phone, isAdmin } = req.body;
            const _user = await User.findOne({
                email: email,
            });

            if (_user) {
                res.status(409).send({
                    message: 'Email đã tồn tại',
                });
            } else {
                const _passwordHash = await hash(password, 3);
                const _newUser = new User({
                    email: email,
                    name: name,
                    address: address,
                    phone: phone,
                    isAdmin: isAdmin || false,
                    password: _passwordHash,
                });
                await _newUser.save();
                res.send({
                    data: await _newUser.save(),
                    message: 'Đăng kí thành công. Vui lòng đăng nhập để tiếp tục',
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send({
                message: 'Đăng kí không thành công',
            });
        }
    } else {
        res.status(405);
    }
};

export default SignUp;
