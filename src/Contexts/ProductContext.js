import react, { createContext } from 'react'
import { useState } from 'react'

export const SingleProduct = createContext(null)

function ProductContext({children}){
    const [singleItem,setSingleItem] = useState(null)
    return(
        <SingleProduct.Provider value={{singleItem,setSingleItem}}>
            {children}
        </SingleProduct.Provider>
    )
}

export default ProductContext