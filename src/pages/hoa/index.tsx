import { Box, Button, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner } from '@chakra-ui/react';
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

    const {
        search: { value: search },
    } = useLayoutContext();

    const [hoas, setHoas] = useState<IHoa[]>([]);
    const [loais, setLoais] = useState<ILoai[]>([]);
    const { reset, register, handleSubmit, control, getValues, watch, setValue } = useForm<IQueryHoa>();
    const toast = useToastContext();
    const [load, setLoad] = useState(1);

    useEffect(() => {
        loadLoai();
    }, []);

    useEffect(() => {
        if (search != '') {
            handleSubmit((data) =>
                onFilter({
                    ...data,
                    search: search,
                }),
            )();
        } else {
            const { sort, dsc, type } = router.query;
            handleSubmit((data) =>
                // @ts-ignore
                onFilter({ ...data, sort: sort || 'name', dsc: dsc || false, gte: 0, lte: 10000000, type: type }),
            )();
            // @ts-ignore
            reset({ sort: sort || 'name', dsc: dsc || false, gte: 0, lte: 10000000, type: type });
        }
    }, [search]);

    useEffect(() => {
        const { type } = router.query;
        // @ts-ignore
        setValue('type', type);
    }, [loais]);

    const loadLoai = async () => {
        try {
            const loai = (await loaiApi.get()).data.data;
            setLoais(loai || []);
        } catch (err) {
            toast(err);
        } finally {
            setLoad((l) => l - 1);
        }
    };

    const loadHoa = async (query: IQueryHoa) => {
        try {
            setLoad((l) => l + 1);
            const hoa = await hoaApi.get(query);
            setHoas(hoa.data.data || []);
        } catch (err) {
            toast(err);
        } finally {
            setLoad((l) => l - 1);
        }
    };

    const onFilter = (data: IQueryHoa) => {
        loadHoa(data);
        delete data.gte;
        delete data.lte;
        router.push({
            query: data,
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
                                <option value="false">Tăng dần</option>
                                <option value="true">Giảm dần</option>
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
            <div className="flex flex-col gap-y-4 justify-center items-center flex-1">
                {load > 0 && <Spinner></Spinner>}
                {load <= 0 && hoas.length == 0 && <p className="text-lg font-medium">Không tìm thấy hoa</p>}
                {load <= 0 && hoas.length > 0 && search != '' && (
                    <div className="flex w-full">
                        <p className="text-lg text-left font-medium">Kết quả tiềm kiếm cho : {search}</p>
                    </div>
                )}

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
