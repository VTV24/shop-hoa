import { Button } from '@chakra-ui/react';
import React, { FC } from 'react';
import { VndFormat } from '~src/services';

const FlowerCard: FC<{ hoa: IHoa & { type?: string } }> = ({ hoa }) => {
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
                <Button colorScheme="green" size="sm">
                    Chi tiết
                </Button>
                <Button colorScheme="yellow" size="sm">
                    Thêm vào giỏ
                </Button>
            </div>
        </div>
    );
};

export default FlowerCard;
