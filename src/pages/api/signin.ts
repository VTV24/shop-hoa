import { NextApiRequest, NextApiResponse } from 'next';
import { compare } from 'bcrypt';
import User from '~src/models/user';
import dbConnect from '~src/utils/dbConnect';

const SignIn = async (req: NextApiRequest, res: NextApiResponse<ILoginResult>) => {
    await dbConnect();
    if (req.method == 'POST') {
        try {
            console.log(req.body);
            const { email, password } = req.body;
            const _user = await User.findOne({
                email: email,
            });

            if (_user) {
                const isLogin = await compare(password, _user.password);
                if (isLogin) {
                    const _result: ILoginResult = {
                        message: 'Đăng nhập thành công',
                        data: {
                            email: _user.email,
                            name: _user.name,
                            address: _user.address,
                            image: _user.image,
                            phone: _user.phone,
                            _id: _user._id,
                            isAdmin: _user.isAdmin,
                        },
                    };
                    res.send(_result);
                    return;
                }
            }

            res.status(404).send({
                message: 'Email hoặc mật khẩu không đúng',
            });
        } catch {
            res.status(500).send({
                message: 'Đăng nhập không thành công',
            });
        }
    } else {
        res.status(405);
    }
};

export default SignIn;
