import { Button } from '@chakra-ui/react';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import React, { FC } from 'react';
import { useCartContext } from '~src/providers/cartProvider';
import { useToastContext } from '~src/providers/toasProvider';
import { VndFormat } from '~src/services';

const FlowerCard: FC<{ hoa: IHoa }> = ({ hoa }) => {
    const toast = useToastContext();
    const { addToCart } = useCartContext();
    const [session] = useSession();

    const onAddCart = () => {
        if (session?.user?._id) {
            addToCart(hoa);
            toast({
                description: `Đã thêm ${hoa.name} vào giỏ hàng`,
                title: 'Thành công',
                status: 'success',
            });
        } else {
            toast({
                description: 'Vui lòng đăng nhập để thực hiện thao tác',
                title: 'Bạn chưa đăng nhập',
                status: 'warning',
            });
        }
    };

    return (
        <div className="p-4 w-full border rounded hover:shadow-lg transition-all duration-300">
            <a className="block relative h-48 rounded overflow-hidden">
                <img
                    className="object-cover object-center w-full h-full block"
                    src={hoa.image || 'https://dummyimage.com/420x260'}
                />
            </a>
            <div className="mt-4">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1 uppercase">
                    {hoa.type || 'Không xác định'}
                </h3>
                <h2 className="text-gray-900 title-font text-lg font-medium">{hoa.name}</h2>
                <p className="mt-1">{VndFormat(hoa.price || 0)}</p>
            </div>
            <div className="flex gap-2 mt-8 flex-row-reverse">
                <Link href={`/hoa/${hoa._id}`}>
                    <Button colorScheme="green" size="sm">
                        <a>Chi tiết</a>
                    </Button>
                </Link>
                <Button onClick={() => onAddCart()} colorScheme="yellow" size="sm">
                    Thêm vào giỏ
                </Button>
            </div>
        </div>
    );
};

export default FlowerCard;
