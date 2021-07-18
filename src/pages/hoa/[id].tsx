import {
    Button,
    Image,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
} from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import { NextPage } from 'next/types';
import { default as React, useEffect, useRef, useState } from 'react';
import PageLayout, { useLayoutContext } from '~src/layout/PageLayout';
import { useToastContext } from '~src/providers/toasProvider';
import { VndFormat } from '~src/services';
import hoaApi from '~src/services/hoa';
import loaiApi from '~src/services/loai';
import { useCartContext } from '~src/providers/cartProvider';
import { useSession } from 'next-auth/client';
const Hoa: NextPage = () => {
    const router = useRouter();
    const [hoa, setHoa] = useState<IHoa>();
    const [loais, setLoais] = useState<ILoai[]>([]);
    const { setLoading } = useLayoutContext();

    const toast = useToastContext();
    const { addToCart } = useCartContext();
    const [session] = useSession();
    const quantityRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        load();
    }, []);

    const onAddCart = (hoa: IHoa, quantity?: number) => {
        if (session?.user?._id) {
            addToCart(hoa, quantity);
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

    const load = async () => {
        try {
            const id = router.query.id as string;
            if (id) {
                setLoading(true);
                const [loai, hoa] = await Promise.all([
                    (await loaiApi.get()).data.data,
                    (await hoaApi.detail(id)).data.data,
                ]);
                setLoais(loai || []);
                if (hoa) {
                    setHoa({
                        ...hoa,
                        type: loai?.find((l) => l._id == hoa?.typeId)?.name,
                    });
                }
            }
        } catch (err) {
            toast(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-x-4">
            <Image borderRadius="md" width="300px" src={hoa?.image || 'https://dummyimage.com/420x260'}></Image>
            <div className="flex flex-col justify-between">
                <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-900 title-font text-2xl font-medium">{hoa?.name || 'Không xác định'}</h2>
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1 uppercase">
                        {hoa?.type || 'Không xác định'}
                    </h3>
                </div>

                <div className="flex gap-4 flex-col">
                    <p className="mt-1">Giá : {VndFormat(hoa?.price || 0)}</p>
                    <NumberInput defaultValue={1} min={1} max={200}>
                        <NumberInputField ref={quantityRef} />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Button
                        onClick={(e) => {
                            if (hoa) {
                                onAddCart(hoa, parseInt(quantityRef.current?.value || '1'));
                            }
                        }}
                        colorScheme="yellow"
                    >
                        Thêm vào giỏ
                    </Button>
                </div>
            </div>
        </div>
    );
};

Hoa.layout = PageLayout;

export default Hoa;
