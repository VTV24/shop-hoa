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

const Login: NextPage<{}> = () => {
    const router = useRouter();
    const [onlyMail, setOnlyMail] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<ILoginRequest>({
        mode: 'onBlur',
    });
    const toast = useToastContext();

    useEffect(() => {
        if (router.query.error) {
            const _err = router.query.error as string;
            if (_err == 'OAuthAccountNotLinked') {
                toast({
                    status: 'error',
                    title: 'Lỗi',
                    description: 'Email này đã được dùng cho phương thức đăng nhập khác',
                });
            }
            router.push({ query: {} });
        }
    }, [router.query]);

    const onSubmit = async (data: ILoginRequest) => {
        try {
            const res = (await accountApi.login(data)).data;
            if (res.data?._id) {
                await signIn('credentials', {
                    ...res.data,
                    callbackUrl: (router.query.callbackUrl as string) || '/',
                });
            } else {
                toast({
                    title: 'Thất bại',
                    description: 'Đăng nhập không thành công',
                });
            }
        } catch (err) {
            toast(err);
        }
    };

    const onMail = (data: ILoginRequest) => {
        return signIn('email', {
            email: data.email,
            callbackUrl: (router.query.callbackUrl as string) || '/',
        });
    };

    return (
        <Fragment>
            <Head>
                <title>Đăng nhập</title>
            </Head>
            <form
                onSubmit={onlyMail ? handleSubmit(onMail) : handleSubmit(onSubmit)}
                className="flex justify-center items-center w-screen h-screen"
            >
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
                    <FormControl isRequired isInvalid={!!errors.email}>
                        <FormLabel>Email</FormLabel>
                        <Input
                            {...register('email', {
                                required: true,
                            })}
                            bg="white"
                            type="email"
                        />
                        <FormErrorMessage>Email không được để trống</FormErrorMessage>
                    </FormControl>
                    {!onlyMail && (
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
                    )}
                    <Checkbox isChecked={onlyMail} onChange={(e) => setOnlyMail(e.currentTarget.checked)}>
                        Đăng nhập không cần mật khẩu
                    </Checkbox>
                    {!onlyMail && (
                        <Button
                            isLoading={isSubmitting}
                            width="full"
                            type="submit"
                            colorScheme="blue"
                            loadingText="Đăng nhập"
                        >
                            Đăng nhập
                        </Button>
                    )}

                    {onlyMail && (
                        <Button isLoading={isSubmitting} type="submit" colorScheme="blue" loadingText="Đăng nhập">
                            Lấy link đăng nhập
                        </Button>
                    )}
                    <Flex gridGap="2">
                        <Button
                            leftIcon={<i className="fab fa-facebook-f"></i>}
                            onClick={() =>
                                signIn('facebook', {
                                    callbackUrl: (router.query.callbackUrl as string) || '/',
                                })
                            }
                            colorScheme="facebook"
                        >
                            Facebook
                        </Button>

                        <Button
                            leftIcon={<i className="fab fa-twitter"></i>}
                            onClick={() =>
                                signIn('facebook', {
                                    callbackUrl: (router.query.callbackUrl as string) || '/',
                                })
                            }
                            colorScheme="twitter"
                        >
                            Twitter
                        </Button>
                    </Flex>

                    <p>
                        Chưa có tài khoản
                        <Link href="/account/register">
                            <a className="ml-1 font-medium text-blue-700">Đăng kí</a>
                        </Link>
                    </p>
                </Flex>
            </form>
        </Fragment>
    );
};

export default Login;

export const getServerSideProps = async (context: any) => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};
