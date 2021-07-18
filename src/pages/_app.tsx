import type { AppProps } from 'next/app';
import { Provider } from 'next-auth/client';
import React, { FC, useEffect, useRef } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import NoneLayout from '~src/layout/NoneLayout';
import LoadingBar from 'react-top-loading-bar';
import Head from 'next/head';

import '~styles/globals.scss';
import 'tailwindcss/tailwind.css';
import ToastProvider from '~src/providers/toasProvider';
import CartProvider from '~src/providers/cartProvider';

const App: FC<AppProps & { Component: { layout?: React.FC } }> = ({ Component, pageProps }) => {
    const Layout = Component.layout || NoneLayout;
    const router = useRouter();

    const isLoading = useRef(false);
    const loadingTop = useRef({
        continuousStart: () => {},
        complete: () => {},
    });

    useEffect(() => {
        const routeChangeStart = (url: string) => {
            // if (url.split('?')[0] != window.location.pathname) {
            loadingTop.current.continuousStart();
            isLoading.current = true;
            // }
        };

        const hashChangeComplete = () => {
            if (isLoading.current) {
                loadingTop.current.complete();
                isLoading.current = false;
            }
        };

        router.events.on('routeChangeComplete', routeChangeStart);
        router.events.on('routeChangeComplete', hashChangeComplete);
        return () => {
            router.events.off('routeChangeStart', routeChangeStart);
            router.events.off('routeChangeComplete', hashChangeComplete);
        };
    }, []);

    return (
        <Provider session={pageProps.session}>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://pro.fontawesome.com/releases/v5.8.2/css/all.css"
                    integrity="sha384-xVVam1KS4+Qt2OrFa+VdRUoXygyKIuNWUUUBZYv+n27STsJ7oDOHJgfF0bNKLMJF"
                    crossOrigin="anonymous"
                />
            </Head>
            <ChakraProvider>
                <ToastProvider>
                    <LoadingBar color="#f11946" ref={loadingTop} />
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ToastProvider>
            </ChakraProvider>
        </Provider>
    );
};

export default App;
