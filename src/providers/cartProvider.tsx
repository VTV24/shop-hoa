import { useSession } from 'next-auth/client';
import { createContext, FC, useContext, useEffect, useState } from 'react';

type ICartContext = {
    carts: ICart[];
    addToCart: (hoa: IHoa, quantity?: number) => void;
    removeFromCart: (hoa: IHoa, quantity?: number) => void;
    clearCart: () => void;
};

// @ts-ignore
const cartContext = createContext<ICartContext>({});

export const useCartContext = () => useContext(cartContext);

const CartProvider: FC = ({ children }) => {
    const [carts, setCarts] = useState<ICart[]>([]);
    const [session] = useSession();

    useEffect(() => {
        if (session?.user?._id) {
            setCarts(JSON.parse(localStorage.getItem(session.user._id) || '[]'));
        }
    }, [session?.user?._id]);

    useEffect(() => {
        if (session?.user?._id) {
            localStorage.setItem(session.user._id, JSON.stringify(carts));
        }
    }, [JSON.stringify(carts)]);

    const addToCart = (hoa: IHoa, quantity = 1) => {
        const _hoa = carts.find((h) => h.hoa._id == hoa._id);
        if (_hoa) {
            _hoa.quantity = _hoa.quantity + quantity;
        } else {
            carts.push({ hoa: hoa, quantity: quantity });
        }
        setCarts([...carts]);
    };

    const removeFromCart = (hoa: IHoa, quantity?: number) => {
        const _index = carts.findIndex((h) => h.hoa._id == hoa._id);
        if (_index != -1) {
            if (quantity) {
                carts[_index].quantity == quantity;
            } else {
                carts.splice(_index, 1);
            }
            setCarts([...carts]);
        }
    };

    const clearCart = () => {
        setCarts([]);
    };

    return (
        <cartContext.Provider
            value={{
                carts: carts,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </cartContext.Provider>
    );
};

export default CartProvider;
