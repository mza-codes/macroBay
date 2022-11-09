import { createContext, useContext } from 'react'
import { useState } from 'react'

const RetailProducts = createContext(null);

function ProductContext({ children }) {
    const [saleItems, setSaleItems] = useState([]);
    return (
        <RetailProducts.Provider value={{ saleItems, setSaleItems }}>
            {children}
        </RetailProducts.Provider>
    )
};

export const useProductContext = () => useContext(RetailProducts);

export default ProductContext;