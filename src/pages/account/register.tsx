import { NextPage } from 'next/types';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    Flex,
    Button,
    useToast,
    Checkbox,
} from '@chakra-ui/react';
import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { getProviders, signIn } from 'next-auth/client';
import { useRouter } from 'next/dist/client/router';
import { useForm } from 'react-hook-form';
import accountApi from '~src/services/account';
import Link from 'next/link';
import { useToastContext } from '~src/providers/toasProvider';

const Register: NextPage<{}> = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<Omit<IUser, '_id'>>({
        mode: 'onBlur',
    });
    const toast = useToastContext();

    const onSubmit = async (data: IUser) => {
        try {
            const res = await accountApi.register(data);
            toast({
                status: 'success',
                title: res.status,
                description: res.data.message,
            });
            reset({});
        } catch (err) {
            toast(err);
        }
    };

    return (
        <Fragment>
            <Head>
                <title>Đăng nhập</title>
            </Head>
            <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center w-screen h-screen">
                <Flex
                    backgroundColor="white"
                    border="2px solid"
                    borderColor="blue.600"
                    borderRadius="md"
                    flexDirection="column"
                    gridGap="4"
                    minWidth={400}
                    alignItems="center"
                    p="8"
                >
                    <FormControl isRequired isInvalid={!!errors.name}>
                        <FormLabel>Tên</FormLabel>
                        <Input
                            {...register('name', {
                                required: true,
                            })}
                            bg="white"
                        />
                        <FormErrorMessage>Tên không được để trống</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.name}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            {...register('email', {
                                required: true,
                            })}
                            bg="white"
                        />
                        <FormErrorMessage>Email không được để trống</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Điện thoại</FormLabel>
                        <Input {...register('phone')} bg="white" />
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.address}>
                        <FormLabel>Địa chỉ</FormLabel>
                        <Input
                            {...register('address', {
                                required: true,
                            })}
                            bg="white"
                        />
                        <FormErrorMessage>Địa chỉ không được để trống</FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={!!errors.password}>
                        <FormLabel>Mật khẩu</FormLabel>
                        <Input
                            {...register('password', {
                                required: true,
                            })}
                            bg="white"
                        />
                        <FormErrorMessage>Password không được để trống</FormErrorMessage>
                    </FormControl>

                    <Checkbox {...register('isAdmin')}>Đăng kí làm admin</Checkbox>

                    <Button isLoading={isSubmitting} type="submit" colorScheme="blue" loadingText="Đăng kí">
                        Đăng kí
                    </Button>

                    <Link href="/account/login">
                        <a className="ml-1 font-medium text-blue-700">Đăng nhập</a>
                    </Link>
                </Flex>
            </form>
        </Fragment>
    );
};

export default Register;

export const getServerSideProps = async (context: any) => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};
