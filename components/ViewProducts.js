//import single product template
import ProductCard from './ProductCard.js'
import {useSession,getSession} from "next-auth/react"
//data from database
import {displayProducts,getFavouriteItemData} from '../lib/fetchDataSWR';

const calculateRating=(total_rating,total_rates)=>{
  if(total_rates==0){
      return 0
  }
  const rating = Math.round(total_rating*2/total_rates)/2;
  return rating
}

export default function ViewProducts({cookies,category}) {

  const {data:products,isLoading,error}=displayProducts({category});
  const {data:session}=useSession();
  const user = cookies?.user
  ? JSON.parse(cookies.user)
  : session?.user
  ? session?.user
  : ""
  const {data:favourites,isLoadingFavourites,errorfavourites}= getFavouriteItemData({userEmail:user.email})
      return (
        <div className="flex flex-col mt-10">
          <div className= "justify-center items-center">
              <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 md:grid-cols-5 relative">
                {error ||errorfavourites && <p>An error has occured</p>}
                {isLoading || isLoadingFavourites && <p>Please wait loading products...</p>}
                {(favourites && products) && products.data.map((product,index)=><ProductCard key={index} favStatus={()=>{
                  const favProductIds= favourites.data.map((item)=>item.productId);
                  const status=favProductIds.includes(product._id);
                  return status
                  }} className="w-full" ratingDetails={{rating:calculateRating(product.ratingDetails.rating,product.ratingDetails.reviewCount),reviewCount:product.ratingDetails.reviewCount}} id={product._id} limits={1000} user={user?1:0} name={product.name} email={user.email} company={product.company} images={product.images} price={product.price} genders={product.genders} ages={product.ages} features={product.features} colors={product.colors} sizes={product.sizes}/>)}
              </div>
          </div>
      </div>
    )
}
export async function getServerSideProps(context) {
  const {cookies}= context.req
  const {category} = context.params
  const session = await getSession(context);
  if (!session && !cookies.token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
  return {
    props: {cookies,session,category}, // will be passed to the page component as props
  }
}

