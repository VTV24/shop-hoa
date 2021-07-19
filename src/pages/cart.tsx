import {
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    IconButton,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/client';
import { NextPage } from 'next/types';
import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import PageLayout from '~src/layout/PageLayout';
import { useCartContext } from '~src/providers/cartProvider';
import { useToastContext } from '~src/providers/toasProvider';
import { VndFormat } from '~src/services';
import orderApi from '~src/services/order';

const CartPage: NextPage = () => {
    const { carts, removeFromCart, clearCart } = useCartContext();
    const toast = useToastContext();
    const [session] = useSession();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IOrder>({
        mode: 'onBlur',
    });

    const { isOpen, onOpen, onClose } = useDisclosure({
        onClose: () => {
            reset({});
        },
        onOpen: () => {
            if (session?.user) {
                reset({
                    address: session.user.address,
                    phone: session.user.phone,
                    // @ts-ignore
                    email: session.user.email,
                    totalPrice: carts.reduce((t, h) => t + h.quantity * h.hoa.price, 0),
                    userId: session.user._id,
                    detail: carts,
                    // @ts-ignore
                    name: session.user.name,
                });
            }
        },
    });

    const onSubmit = async (data: IOrder) => {
        try {
            const res = (await orderApi.post(data)).data;
            toast({
                title: 'Thành công',
                description: res.message,
            });
            reset({});
            onClose();
            clearCart();
        } catch (err) {
            toast(err);
        }
    };

    return (
        <div className="w-full">
            {carts.length == 0 && <p className="text-lg text-center font-medium">Giỏ hàng trống</p>}
            {carts.length > 0 && (
                <Fragment>
                    <table className="w-full">
                        <tr>
                            <th>STT</th>
                            <th>Tên hoa</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                            <th></th>
                        </tr>
                        <tbody>
                            {carts.map(({ hoa, quantity }, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <Image
                                                height="60px"
                                                width="60px"
                                                borderRadius="sm"
                                                src={hoa.image || 'https://dummyimage.com/420x260'}
                                            />
                                            <p>{hoa.name}</p>
                                        </div>
                                    </td>
                                    <td>{VndFormat(hoa.price)}</td>
                                    <td>{quantity}</td>
                                    <td>{VndFormat(hoa.price * quantity)}</td>
                                    <td>
                                        <IconButton
                                            onClick={() => removeFromCart(hoa)}
                                            colorScheme="red"
                                            aria-label=""
                                            icon={<i className="fas fa-trash"></i>}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex flex-row-reverse">
                        <div className="font-medium space-y-4 my-4 flex justify-end flex-col">
                            <p>Tổng tiền : {VndFormat(carts.reduce((t, h) => t + h.quantity * h.hoa.price, 0))}</p>
                            <Button onClick={onOpen} colorScheme="green">
                                Đặt hàng
                            </Button>
                        </div>
                    </div>
                </Fragment>
            )}

            <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Thông tin đơn hàng</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className="space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl isRequired isInvalid={!!errors.name}>
                                <FormLabel>Người nhận</FormLabel>
                                <Input
                                    {...register('name', {
                                        required: true,
                                    })}
                                    bg="white"
                                />
                                <FormErrorMessage>Người nhận không được để trống</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.email}>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    {...register('email', {
                                        required: true,
                                    })}
                                    bg="white"
                                />
                                <FormErrorMessage>Email không được để trống</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.phone}>
                                <FormLabel>Số điện thoại</FormLabel>
                                <Input
                                    {...register('phone', {
                                        required: true,
                                    })}
                                    bg="white"
                                />
                                <FormErrorMessage>SDT không được để trống</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.address}>
                                <FormLabel>Địa chỉ</FormLabel>
                                <Textarea {...register('address', { required: true })} />
                                <FormErrorMessage>Địa chỉ không được để trống</FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Thành tiền</FormLabel>
                                <Input readOnly {...register('totalPrice')} type="number" />
                            </FormControl>
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            onClick={() => handleSubmit(onSubmit)()}
                            isLoading={isSubmitting}
                            type="submit"
                            colorScheme="green"
                        >
                            Lưu
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

CartPage.layout = PageLayout;

export default CartPage;
