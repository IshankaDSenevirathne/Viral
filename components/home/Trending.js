import ProductCard from '../ProductCard.js'

const calculateRating=(total_rating,total_rates)=>{
    if(total_rates==0){
        return 0
    }
    const rating = Math.round(total_rating*2/total_rates)/2;
    return rating
}

function TrendingBottom({user,trendingItems,favProducts}){
    return (
        <div>
            <div className="md:hidden w-screen flex">
                <div className="w-full h-full">
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[0]._id)} ratingDetails={{rating:calculateRating(trendingItems[0].ratingDetails.rating,trendingItems[0].ratingDetails.reviewCount),reviewCount:trendingItems[0].ratingDetails.reviewCount}}  className="h-full w-full" limits={2000} id={trendingItems[0]._id} user={user?1:0} name={trendingItems[0].name} email={user.email} company={trendingItems[0].company} images={trendingItems[0].images} price={trendingItems[0].price} genders={trendingItems[0].genders} ages={trendingItems[0].ages} features={trendingItems[0].features} colors={trendingItems[0].colors} sizes={trendingItems[0].sizes}/>
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[1]._id)} ratingDetails={{rating:calculateRating(trendingItems[1].ratingDetails.rating,trendingItems[1].ratingDetails.reviewCount),reviewCount:trendingItems[1].ratingDetails.reviewCount}}  className="h-full w-full" limits={2000} id={trendingItems[1]._id} user={user?1:1} name={trendingItems[1].name} email={user.email} company={trendingItems[1].company} images={trendingItems[1].images} price={trendingItems[1].price} genders={trendingItems[1].genders} ages={trendingItems[1].ages} features={trendingItems[1].features} colors={trendingItems[1].colors} sizes={trendingItems[1].sizes}/>
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[2]._id)} ratingDetails={{rating:calculateRating(trendingItems[2].ratingDetails.rating,trendingItems[2].ratingDetails.reviewCount),reviewCount:trendingItems[2].ratingDetails.reviewCount}} className="h-full w-full" limits={2000} id={trendingItems[2]._id} user={user?2:2} name={trendingItems[2].name} email={user.email} company={trendingItems[2].company} images={trendingItems[2].images} price={trendingItems[2].price} genders={trendingItems[2].genders} ages={trendingItems[2].ages} features={trendingItems[2].features} colors={trendingItems[2].colors} sizes={trendingItems[2].sizes}/>
                </div>
            </div>
            <div className="hidden md:grid w-full h-screen grid grid-rows-2 grid-cols-3 overflow-hidden">
                <div className="w-full h-full relative">
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[0]._id)} ratingDetails={{rating:calculateRating(trendingItems[0].ratingDetails.rating,trendingItems[0].ratingDetails.reviewCount),reviewCount:trendingItems[0].ratingDetails.reviewCount}} page={"new_trending"} className="h-full w-full" layoutType={"fill"} id={trendingItems[0]._id} user={user?1:0} name={trendingItems[0].name} email={user.email} company={trendingItems[0].company} images={trendingItems[0].images} price={trendingItems[0].price} genders={trendingItems[0].genders} ages={trendingItems[0].ages} features={trendingItems[0].features} colors={trendingItems[0].colors} sizes={trendingItems[0].sizes}/>
                </div>
                <div className="relative row-span-2 col-span-2 w-full h-full">
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[1]._id)} ratingDetails={{rating:calculateRating(trendingItems[1].ratingDetails.rating,trendingItems[1].ratingDetails.reviewCount),reviewCount:trendingItems[1].ratingDetails.reviewCount}} page={"new_trending"} className="h-full w-full" layoutType={"fill"} id={trendingItems[1]._id} user={user?1:1} name={trendingItems[1].name} email={user.email} company={trendingItems[1].company} images={trendingItems[1].images} price={trendingItems[1].price} genders={trendingItems[1].genders} ages={trendingItems[1].ages} features={trendingItems[1].features} colors={trendingItems[1].colors} sizes={trendingItems[1].sizes}/>
                </div>
                <div className="relative w-full h-full">
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[2]._id)} ratingDetails={{rating:calculateRating(trendingItems[2].ratingDetails.rating,trendingItems[2].ratingDetails.reviewCount),reviewCount:trendingItems[2].ratingDetails.reviewCount}}page={"new_trending"} className="h-full w-full" layoutType={"fill"} id={trendingItems[2]._id} user={user?2:2} name={trendingItems[2].name} email={user.email} company={trendingItems[2].company} images={trendingItems[2].images} price={trendingItems[2].price} genders={trendingItems[2].genders} ages={trendingItems[2].ages} features={trendingItems[2].features} colors={trendingItems[2].colors} sizes={trendingItems[2].sizes}/>
                </div>
            </div>
        </div>
    )
}
function TrendingTop({user,trendingItems,favProducts}){
    return (
        <div>
            <div className="md:hidden w-screen flex">
                <div className="w-full h-full">
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[0]._id)} ratingDetails={{rating:calculateRating(trendingItems[0].ratingDetails.rating,trendingItems[0].ratingDetails.reviewCount),reviewCount:trendingItems[0].ratingDetails.reviewCount}}  className="h-full w-full" limits={2000} id={trendingItems[0]._id} user={user?1:0} name={trendingItems[0].name} email={user.email} company={trendingItems[0].company} images={trendingItems[0].images} price={trendingItems[0].price} genders={trendingItems[0].genders} ages={trendingItems[0].ages} features={trendingItems[0].features} colors={trendingItems[0].colors} sizes={trendingItems[0].sizes}/>
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[1]._id)} ratingDetails={{rating:calculateRating(trendingItems[1].ratingDetails.rating,trendingItems[1].ratingDetails.reviewCount),reviewCount:trendingItems[1].ratingDetails.reviewCount}}  className="h-full w-full" limits={2000} id={trendingItems[1]._id} user={user?1:1} name={trendingItems[1].name} email={user.email} company={trendingItems[1].company} images={trendingItems[1].images} price={trendingItems[1].price} genders={trendingItems[1].genders} ages={trendingItems[1].ages} features={trendingItems[1].features} colors={trendingItems[1].colors} sizes={trendingItems[1].sizes}/>
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[2]._id)} ratingDetails={{rating:calculateRating(trendingItems[2].ratingDetails.rating,trendingItems[2].ratingDetails.reviewCount),reviewCount:trendingItems[2].ratingDetails.reviewCount}} className="h-full w-full" limits={2000} id={trendingItems[2]._id} user={user?2:2} name={trendingItems[2].name} email={user.email} company={trendingItems[2].company} images={trendingItems[2].images} price={trendingItems[2].price} genders={trendingItems[2].genders} ages={trendingItems[2].ages} features={trendingItems[2].features} colors={trendingItems[2].colors} sizes={trendingItems[2].sizes}/>
                </div>
            </div>
            <div className="hidden md:grid w-full h-screen grid grid-rows-2 grid-cols-3 overflow-hidden">
                <div className="relative row-span-2 col-span-2 w-full h-full">
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[0]._id)} ratingDetails={{rating:calculateRating(trendingItems[0].ratingDetails.rating,trendingItems[0].ratingDetails.reviewCount),reviewCount:trendingItems[0].ratingDetails.reviewCount}} page={"new_trending"} className="h-full w-full" layoutType={"fill"} id={trendingItems[0]._id} user={user?0:0} name={trendingItems[0].name} email={user.email} company={trendingItems[0].company} images={trendingItems[0].images} price={trendingItems[0].price} genders={trendingItems[0].genders} ages={trendingItems[0].ages} features={trendingItems[0].features} colors={trendingItems[0].colors} sizes={trendingItems[0].sizes}/>
                </div>
                <div className="w-full h-full relative">
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[1]._id)} ratingDetails={{rating:calculateRating(trendingItems[1].ratingDetails.rating,trendingItems[1].ratingDetails.reviewCount),reviewCount:trendingItems[1].ratingDetails.reviewCount}} page={"new_trending"} className="h-full w-full" layoutType={"fill"} id={trendingItems[1]._id} user={user?1:1} name={trendingItems[1].name} email={user.email} company={trendingItems[1].company} images={trendingItems[1].images} price={trendingItems[1].price} genders={trendingItems[1].genders} ages={trendingItems[1].ages} features={trendingItems[1].features} colors={trendingItems[1].colors} sizes={trendingItems[1].sizes}/>
                </div>
                <div className="relative w-full h-full">
                    <ProductCard favStatus={()=>favProducts.includes(trendingItems[2]._id)} ratingDetails={{rating:calculateRating(trendingItems[2].ratingDetails.rating,trendingItems[2].ratingDetails.reviewCount),reviewCount:trendingItems[2].ratingDetails.reviewCount}} page={"new_trending"} className="h-full w-full" layoutType={"fill"} id={trendingItems[2]._id} user={user?2:2} name={trendingItems[2].name} email={user.email} company={trendingItems[2].company} images={trendingItems[2].images} price={trendingItems[2].price} genders={trendingItems[2].genders} ages={trendingItems[2].ages} features={trendingItems[2].features} colors={trendingItems[2].colors} sizes={trendingItems[2].sizes}/>
                </div>
                
            </div>
        </div>
    )
}

export {TrendingTop,TrendingBottom};