import {
    Button,
    FormControl,
    FormErrorMessage,
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
import loaiApi from '~src/services/loai';

const Loai: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToastContext();
    const { setLoading } = useLayoutContext();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ILoai>({
        mode: 'onBlur',
    });

    const [loais, setLoais] = useState<ILoai[]>([]);
    const [refecth, setRefetch] = useState({});

    useEffect(() => {
        setLoading(true);
        loaiApi
            .get()
            .then((res) => {
                setLoais(res.data.data || []);
            })
            .catch((err) => {
                toast(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refecth]);

    const onSubmit = async (data: ILoai) => {
        try {
            const res = data._id ? (await loaiApi.put(data._id, data)).data : (await loaiApi.post(data)).data;
            toast({
                title: 'Thành công',
                description: res.message,
            });
            if (!data._id) {
                reset({});
            }
            setRefetch({});
        } catch (err) {
            toast(err);
        }
    };

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
                        <th>Mã loại</th>
                        <th>Tên loại hoa</th>
                        <th>Mô tả</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {loais.map((loai, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{loai.code}</td>
                            <td>{loai.name}</td>
                            <td>{loai.description}</td>
                            <td>
                                <div className="flex gap-4 justify-center">
                                    <IconButton
                                        colorScheme="blue"
                                        aria-label=""
                                        icon={<i className="fas fa-edit"></i>}
                                        onClick={() => {
                                            reset(loai);
                                            onOpen();
                                        }}
                                    />
                                </div>
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl isRequired isInvalid={!!errors.name}>
                                <FormLabel>Mã loại hoa</FormLabel>
                                <Input
                                    {...register('code', {
                                        required: true,
                                    })}
                                    bg="white"
                                />
                                <FormErrorMessage>Mã loại loại hoa không được để trống</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.name}>
                                <FormLabel>Tên loại hoa</FormLabel>
                                <Input
                                    {...register('name', {
                                        required: true,
                                    })}
                                    bg="white"
                                />
                                <FormErrorMessage>Tên loại hoa không được để trống</FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Mô tả</FormLabel>
                                <Textarea {...register('description')} />
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
        </ManageContainer>
    );
};

Loai.layout = PageLayout;

export default Loai;
