import { createContext } from "react";
import { products } from "../assets/assets";

export const ShopContext = createContext();

    const currency = 'R';
    const delivery_fee= 90;


const ShopContextProvide = (props) => {

    const value = {
        products, currency, delivery_fee
    }

    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvide