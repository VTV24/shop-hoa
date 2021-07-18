import {
    Button,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useDisclosure,
} from '@chakra-ui/react';
import { NextPage } from 'next/types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ManageContainer from '~src/components/ManageContainer';
import PageLayout, { useLayoutContext } from '~src/layout/PageLayout';
import { useToastContext } from '~src/providers/toasProvider';
import orderApi from '~src/services/order';

const Order: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToastContext();
    const { setLoading } = useLayoutContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, getValues } = useForm<IOrder>({
        mode: 'onBlur',
    });

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [refecth, setRefetch] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const res = (await orderApi.get()).data.data;
                setOrders(res || []);
            } catch (err) {
                toast(err);
                setOrders([]);
            }
        })();
    }, [refecth]);

    return (
        <ManageContainer>
            <div className="mb-4 flex flex-row-reverse">
                <Button onClick={onOpen} leftIcon={<i className="fas fa-plus" />} colorScheme="green">
                    Thêm loại hoa
                </Button>
            </div>
            <table className="w-full">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã đơn hàng</th>
                        <th>Người mua</th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{order._id}</td>
                            <td>{order.name}</td>
                            <td>{order.email}</td>
                            <td>{order.phone}</td>
                            <td>
                                {!order.isConfirm && (
                                    <div className="flex gap-4 justify-center">
                                        <IconButton
                                            title="Xác nhận"
                                            colorScheme="green"
                                            aria-label=""
                                            icon={<i className="fas fa-check"></i>}
                                            onClick={() => {
                                                onOpen();
                                                reset(order);
                                            }}
                                        />
                                    </div>
                                )}
                                {order.isConfirm && (
                                    <div className="flex gap-4 justify-center">
                                        <IconButton
                                            title="Hủy"
                                            colorScheme="red"
                                            aria-label=""
                                            icon={<i className="fas fa-trash"></i>}
                                        />
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Thông tin loại hoa</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className="space-y-4">
                        <FormControl isReadOnly>
                            <FormLabel>Người nhận</FormLabel>
                            <Input {...register('name')} bg="white" />
                        </FormControl>

                        <FormControl isReadOnly>
                            <FormLabel>Email</FormLabel>
                            <Input {...register('email')} bg="white" />
                        </FormControl>

                        <FormControl isReadOnly>
                            <FormLabel>Số điện thoại</FormLabel>
                            <Input {...register('phone')} bg="white" />
                        </FormControl>

                        <FormControl isReadOnly>
                            <FormLabel>Địa chỉ</FormLabel>
                            <Textarea {...register('address')} />
                        </FormControl>

                        <FormControl isReadOnly>
                            <FormLabel>Thành tiền</FormLabel>
                            <Input readOnly {...register('totalPrice')} type="number" />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            onClick={async () => {
                                try {
                                    setIsSubmitting(true);
                                    await orderApi.confirm(getValues('_id'));
                                    setRefetch({});
                                } catch (err) {
                                    toast(err);
                                } finally {
                                    setIsSubmitting(false);
                                }
                            }}
                            isLoading={isSubmitting}
                            type="submit"
                            colorScheme="green"
                        >
                            Xác nhận đơn hàng
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </ManageContainer>
    );
};

Order.layout = PageLayout;

export default Order;
