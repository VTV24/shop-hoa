import { NextPage } from 'next/types';
import PageLayout from '~src/layout/PageLayout';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import ManageContainer from '~src/components/ManageContainer';

const Manage: NextPage = () => {
    const router = useRouter();

    return <ManageContainer></ManageContainer>;
};
Manage.layout = PageLayout;

export default Manage;
