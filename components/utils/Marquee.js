import ProductCard from '../ProductCard.js'

import {default as M} from "react-fast-marquee";

function Marquee({user,products,favProducts}){
    return(
        <M gradient={false}>
            {products && products.map((product,index)=>
                <ProductCard key={index} favStatus={()=>{
                    const status=favProducts.includes(product._id);
                    return status
                    }} className="w-full" id={product._id} limits={400} user={user?1:0} name={product.name} email={user.email} company={product.company} images={product.images} price={product.price} genders={product.genders} ages={product.ages} features={product.features} colors={product.colors} sizes={product.sizes}/>
                )
            }
        </M>
    )
}
export default Marquee