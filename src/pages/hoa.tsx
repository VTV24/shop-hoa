import { Box, Button, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import { NextPage } from 'next/types';
import { default as React, Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FlowerCard from '~src/components/FlowerCard';
import { FlowerCardContainer } from '~src/components/utils';
import PageLayout, { useLayoutContext } from '~src/layout/PageLayout';
import { useToastContext } from '~src/providers/toasProvider';
import { VndFormat } from '~src/services';
import hoaApi from '~src/services/hoa';
import loaiApi from '~src/services/loai';

const Hoa: NextPage = () => {
    const router = useRouter();

    const { search } = useLayoutContext();

    const [hoas, setHoas] = useState<IHoa[]>([]);
    const [loais, setLoais] = useState<ILoai[]>([]);
    const { reset, register, handleSubmit, control, getValues, watch } = useForm<IQueryHoa>();
    const { setLoading } = useLayoutContext();
    const toast = useToastContext();

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        const { sort, dsc, type } = router.query;
        // @ts-ignore
        reset({ sort: sort || 'name', dsc: dsc || false, gte: 0, lte: 10000000, type: type });
    }, [loais]);

    useEffect(() => {
        handleSubmit(onFilter)();
    }, [search]);

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

    const loadHoa = async (query: IQueryHoa) => {
        try {
            setLoading(true);
            const hoa = await hoaApi.get(query);
            setHoas(hoa.data.data || []);
        } catch (err) {
            toast(err);
        } finally {
            setLoading(false);
        }
    };

    const onFilter = (data: IQueryHoa) => {
        const _query = data;
        if (search && search != '') {
            _query.search = search;
        }

        loadHoa(data);
        delete _query.gte;
        delete _query.lte;
        router.push({
            query: _query,
        });
    };

    return (
        <div className="flex gap-x-4">
            <div className="w-60">
                <form
                    onSubmit={handleSubmit(onFilter)}
                    className="flex flex-col gap-4 border px-4 py-2 shadow sticky top-20"
                >
                    <div className="py-2">
                        <p className="border-b py-2 font-medium">Danh mục</p>
                        <div className="flex flex-col gap-2">
                            <Select {...register('type')}>
                                <option value="">Tất cả</option>
                                {loais.map((loai, index) => (
                                    <option key={index} value={loai.code}>
                                        {loai.name}
                                    </option>
                                ))}
                            </Select>
                            <Button type="submit">Lọc</Button>
                        </div>
                    </div>

                    <div className="py-2">
                        <p className="border-b py-2 font-medium">Sắp xếp</p>
                        <div className="flex flex-col gap-2">
                            <Select {...register('sort')}>
                                <option value="name">Tên</option>
                                <option value="price">Giá</option>
                            </Select>

                            <Select {...register('dsc')}>
                                <option value="true">Tăng dần</option>
                                <option value="false">Giảm dần</option>
                            </Select>

                            <Button type="submit">Sắp xếp</Button>
                        </div>
                    </div>

                    <div className="py-2">
                        <p className="border-b py-2 font-medium">Giá</p>
                        <div className="py-1">
                            <Controller
                                control={control}
                                name="gte"
                                render={({ field: { onChange, value } }) => (
                                    <Fragment>
                                        <p className="text-xs">Từ: {VndFormat(value || 0)}</p>
                                        <Slider
                                            defaultValue={value || 0}
                                            onChange={onChange}
                                            min={0}
                                            max={getValues('lte')}
                                            step={10000}
                                        >
                                            <SliderTrack bg="blue.100">
                                                <Box position="relative" right={10} />
                                                <SliderFilledTrack bg="blue.600" />
                                            </SliderTrack>
                                            <SliderThumb boxSize={6} />
                                        </Slider>
                                    </Fragment>
                                )}
                            />

                            <Controller
                                control={control}
                                name="lte"
                                render={({ field: { onChange, value } }) => (
                                    <Fragment>
                                        <p className="text-xs">Đến: {VndFormat(value || 0)}</p>
                                        <Slider
                                            defaultValue={value || 10000000}
                                            onChange={onChange}
                                            min={getValues('gte')}
                                            max={10000000}
                                            step={10000}
                                        >
                                            <SliderTrack bg="blue.100">
                                                <Box position="relative" right={10} />
                                                <SliderFilledTrack bg="blue.600" />
                                            </SliderTrack>
                                            <SliderThumb boxSize={6} />
                                        </Slider>
                                    </Fragment>
                                )}
                            />

                            <Button type="submit">Lọc</Button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex flex-col gap-y-16 justify-center items-center flex-1">
                {/* <p className="text-lg font-medium">Kết quả tiềm kiếm cho : ACB</p> */}
                <FlowerCardContainer>
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
            </div>
        </div>
    );
};

Hoa.layout = PageLayout;

export default Hoa;
