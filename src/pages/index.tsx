import { NextPage } from 'next/types';
import Head from 'next/head';
import PageLayout, { useLayoutContext } from '~src/layout/PageLayout';
import React, { Fragment, useEffect, useState } from 'react';
import { FlowerCardContainer } from '~src/components/utils';
import FlowerCard from '~src/components/FlowerCard';
import { useToastContext } from '~src/providers/toasProvider';
import hoaApi from '~src/services/hoa';
import loaiApi from '~src/services/loai';
import { useRouter } from 'next/dist/client/router';

const Home: NextPage = () => {
    const [hoas, setHoas] = useState<IHoa[]>([]);
    const [loais, setLoais] = useState<ILoai[]>([]);
    const router = useRouter();

    const { setLoading } = useLayoutContext();
    const toast = useToastContext();

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            setLoading(true);
            const [loai, hoa] = await Promise.all([loaiApi.get(), hoaApi.get({ dsc: 'true', sort: 'count' })]);
            setLoais(loai.data.data || []);
            setHoas(hoa.data.data || []);
        } catch (err) {
            toast(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <Head>
                <title>Trang chủ</title>
            </Head>
            <p className="font-medium text-xl mb-4">Hoa nổi bật</p>
            <FlowerCardContainer className="justify-center lg:justify-between">
                {hoas.map((hoa, index) => (
                    <FlowerCard
                        key={index}
                        hoa={{
                            ...hoa,
                            type: loais.find((l) => l._id == hoa.typeId)?.name,
                        }}
                    />
                ))}
            </FlowerCardContainer>
        </Fragment>
    );
};

Home.layout = PageLayout;

export default Home;
