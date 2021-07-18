import Link from 'next/link';
import { FC } from 'react';
import { cx } from 'xwind';
import { useLayoutContext } from '~src/layout/PageLayout';
import routers from '~src/routerConfig';

const ManageContainer: FC = ({ children }) => {
    const { currentRouter } = useLayoutContext();

    return (
        <div className="flex gap-4">
            <div className="w-56">
                <ul className="flex flex-col gap-4 border p-4 shadow sticky top-20">
                    <li className="py-2 border-b font-bold text-lg">Thao tác</li>
                    {routers
                        .filter((r) => r.role?.includes('admin') && !r.hidden)
                        .map((r, index) => (
                            <li
                                key={index}
                                className={cx('hover:text-blue-700', {
                                    'text-blue-800': currentRouter?.path == r.path,
                                })}
                            >
                                <Link href={r.path}>
                                    <a>{r.name}</a>
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
};

export default ManageContainer;
