import { useToast, UseToastOptions } from '@chakra-ui/react';
import { Children, createContext, FC, useContext } from 'react';

// @ts-ignore
const toastContext = createContext<(options: UseToastOptions) => void>({});

export const useToastContext = () => useContext(toastContext);

const ToastProvider: FC = ({ children }) => {
    const toast = useToast();

    const showToast = (options: UseToastOptions) =>
        toast({
            isClosable: true,
            duration: 3000,
            status: 'info',
            position: 'bottom-right',
            ...options,
        });
    return <toastContext.Provider value={showToast}>{children}</toastContext.Provider>;
};

export default ToastProvider;
