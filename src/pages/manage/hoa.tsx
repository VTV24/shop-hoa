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
import { NextPage } from 'next/types';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ManageContainer from '~src/components/ManageContainer';
import PageLayout, { useLayoutContext } from '~src/layout/PageLayout';
import { useToastContext } from '~src/providers/toasProvider';
import { VndFormat } from '~src/services';
import hoaApi from '~src/services/hoa';
import loaiApi from '~src/services/loai';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from '@chakra-ui/react';

const Hoa: NextPage = () => {
    const inputImage = useRef<any>(null);
    const toast = useToastContext();
    const { setLoading } = useLayoutContext();
    let reader: FileReader;
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<IHoa & { files: FileList }>({
        mode: 'onBlur',
    });

    const { isOpen, onOpen, onClose } = useDisclosure({
        onClose: () => {
            reset({});
        },
    });

    const {
        isOpen: isOpenDelete,
        onOpen: onOpenDelete,
        onClose: onCloseDelete,
    } = useDisclosure({
        onClose: () => {
            reset({});
        },
    });

    const files = register('files');
    const imageUrl = watch('image');

    const [loais, setLoais] = useState<ILoai[]>([]);
    const [hoas, setHoas] = useState<IHoa[]>([]);
    const [refecth, setRefetch] = useState({});

    useEffect(() => {
        reader = new FileReader();
        reader.onload = (e) => {
            if (typeof reader.result == 'string') setValue('image', reader.result);
        };
    });

    useEffect(() => {
        load();
    }, [refecth]);

    const load = async () => {
        try {
            setLoading(true);
            const [loai, hoa] = await Promise.all([loaiApi.get(), hoaApi.get()]);
            setLoais(loai.data.data || []);
            setHoas(hoa.data.data || []);
        } catch (err) {
            toast(err);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: IHoa & { files?: FileList }) => {
        delete data.files;
        try {
            const res = data._id ? (await hoaApi.put(data._id, data)).data : (await hoaApi.post(data)).data;
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

    const onDelete = async (data: IHoa) => {
        try {
            const res = (await hoaApi.delete(data._id)).data;
            toast({
                title: 'Xóa thành công',
                description: res.message,
            });
            reset({});
            setRefetch({});
        } catch (err) {
            toast(err);
        }
    };

    return (
        <ManageContainer>
            <div className="mb-4 flex flex-row-reverse">
                <Button onClick={onOpen} leftIcon={<i className="fas fa-plus" />} colorScheme="green">
                    Thêm hoa
                </Button>
            </div>
            <table className="w-full">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên hoa</th>
                        <th>Giá bán</th>
                        <th>Số hoa đã bán</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {hoas.map((hoa, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                <div className="flex gap-4 items-center">
                                    <Image rounded="md" width={20} height="auto" src={hoa.image} />
                                    {hoa.name}
                                </div>
                            </td>
                            <td>{VndFormat(hoa.price || 0)}</td>
                            <td>{hoa.count}</td>
                            <td>
                                <div className="flex gap-4 justify-center">
                                    <IconButton
                                        colorScheme="blue"
                                        aria-label=""
                                        icon={<i className="fas fa-edit"></i>}
                                        onClick={() => {
                                            reset(hoa);
                                            onOpen();
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => {
                                            reset(hoa);
                                            onOpenDelete();
                                        }}
                                        colorScheme="red"
                                        aria-label=""
                                        icon={<i className="fas fa-trash"></i>}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AlertDialog leastDestructiveRef={undefined} isOpen={isOpenDelete} onClose={onCloseDelete}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Nguy hiểm
                        </AlertDialogHeader>

                        <AlertDialogBody>Xóa hoa này chứ</AlertDialogBody>

                        <AlertDialogFooter>
                            <Button onClick={onCloseDelete}>Hủy</Button>
                            <Button
                                isLoading={isSubmitting}
                                colorScheme="red"
                                onClick={async () => {
                                    await handleSubmit(onDelete)();
                                    onCloseDelete();
                                }}
                                ml={3}
                            >
                                Xóa
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Thông tin hoa</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody className="space-y-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormControl isRequired isInvalid={!!errors.name}>
                                <FormLabel>Tên hoa</FormLabel>
                                <Input
                                    {...register('name', {
                                        required: true,
                                    })}
                                    bg="white"
                                />
                                <FormErrorMessage>Tên hoa không được để trống</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.typeId}>
                                <FormLabel>Loại hoa</FormLabel>
                                <Select
                                    {...register('typeId', {
                                        required: true,
                                    })}
                                >
                                    {loais.map((loai) => (
                                        <option key={loai._id} value={loai._id}>
                                            {loai.name}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>Loại hoa không được để trống</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.price}>
                                <FormLabel>Giá bán</FormLabel>
                                <Input
                                    {...register('price', {
                                        required: true,
                                    })}
                                    type="number"
                                />
                                <FormErrorMessage>Giá hoa không được để trống</FormErrorMessage>
                            </FormControl>

                            <FormControl isRequired isInvalid={!!errors.image}>
                                <FormLabel>Ảnh</FormLabel>
                                <Flex gridGap="4">
                                    <Image
                                        boxSize="100px"
                                        objectFit="cover"
                                        src={imageUrl || 'https://dummyimage.com/600x400/000/fff'}
                                        alt="Segun Adebayo"
                                    />
                                    <Button
                                        onClick={() => {
                                            inputImage?.current?.click();
                                        }}
                                    >
                                        Tải lên
                                    </Button>

                                    <input
                                        onChange={(e) => {
                                            const file = e.currentTarget.files?.item(0);
                                            file && reader?.readAsDataURL(file);
                                            files.onChange(e);
                                        }}
                                        name="files"
                                        ref={(el) => {
                                            inputImage.current = el;
                                            return files.ref(el);
                                        }}
                                        onBlur={files.onBlur}
                                        hidden
                                        type="file"
                                        accept="image/*"
                                    />
                                </Flex>
                                <FormErrorMessage>Ảnh không được để trống</FormErrorMessage>
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

Hoa.layout = PageLayout;

export default Hoa;
