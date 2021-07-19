import React, { FC, Fragment, useEffect, useRef } from 'react';
import Image from 'next/image';
import Logo from '~public/images/flower.png';
import { Button } from '@chakra-ui/button';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';
import { IconButton, Image as Avatar, Input, InputGroup, InputLeftAddon, InputRightAddon } from '@chakra-ui/react';
import { useLayoutContext } from '~src/layout/PageLayout';
import { useCartContext } from '~src/providers/cartProvider';
const Header: FC = () => {
    const [session] = useSession();
    const {
        search: { value: search },
        setSearch,
    } = useLayoutContext();
    const searchRef = useRef<HTMLInputElement>(null);
    const { carts } = useCartContext();

    useEffect(() => {
        if (searchRef.current) {
            searchRef.current.value = search;
        }
    }, [search]);

    return (
        <header className="flex items-center w-full h-14 fixed top-0 left-0 bg-white shadow px-16 py-2 z-10">
            <div className="flex items-center gap-2 h-full flex-1">
                <Image width={40} src={Logo} objectFit="contain" />
                <h1 className="uppercase text-lg font-bold">ShopHoa</h1>
            </div>

            <nav className="mx-16">
                <ul className="flex gap-4 items-center">
                    <li>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setSearch(searchRef.current?.value || '');
                            }}
                        >
                            <InputGroup>
                                <Input
                                    onBlur={() => {
                                        setSearch(searchRef.current?.value || '');
                                    }}
                                    defaultValue={search}
                                    ref={searchRef}
                                    placeholder="Nhập tên hoa, mô tả cần tìm"
                                ></Input>
                                <InputRightAddon
                                    onClick={(e) => {
                                        setSearch(searchRef.current?.value || '');
                                    }}
                                    className="cursor-pointer"
                                >
                                    <i className="fas fa-search" />
                                </InputRightAddon>
                            </InputGroup>
                        </form>
                    </li>
                    <li className="cursor-pointer hover:text-blue-800">
                        <Link href="/">
                            <a>Trang chủ</a>
                        </Link>
                    </li>
                    <li className="cursor-pointer hover:text-blue-800">
                        <Link href="/hoa">
                            <a>Danh sách hoa</a>
                        </Link>
                    </li>

                    {session?.user && (
                        <li className="cursor-pointer flex gap-1 hover:text-blue-800">
                            <Link href="/cart">
                                <a>Giỏ hàng</a>
                            </Link>
                            {carts.length > 0 && (
                                <div
                                    style={{ minWidth: '1rem' }}
                                    className="h-4 p-1 rounded-full bg-red-600 flex justify-center items-center"
                                >
                                    <p className="text-xs font-medium text-white">{carts.length}</p>
                                </div>
                            )}
                        </li>
                    )}

                    {session?.user?.isAdmin && (
                        <li className="cursor-pointer hover:text-blue-800">
                            <Link href="/manage">
                                <a>Quản lí</a>
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>
            <div className="flex items-center gap-2">
                {!session?.user && (
                    <Fragment>
                        <Button onClick={() => signIn()} colorScheme="facebook" size="sm">
                            Đăng nhập
                        </Button>
                        <Button variant="outline" colorScheme="facebook" size="sm">
                            Đăng kí
                        </Button>
                    </Fragment>
                )}

                {session?.user && (
                    <Fragment>
                        <Avatar
                            className="cursor-pointer"
                            borderRadius="full"
                            boxSize="30px"
                            src={session.user.image || '/images/user.png'}
                        />

                        <IconButton
                            aria-label=""
                            title="Đăng xuất"
                            onClick={() => {
                                signOut({
                                    callbackUrl: '/',
                                });
                            }}
                            colorScheme="red"
                            variant="link"
                            icon={<i className="fas fa-sign-out-alt"></i>}
                        />
                    </Fragment>
                )}
            </div>
        </header>
    );
};

export default Header;
