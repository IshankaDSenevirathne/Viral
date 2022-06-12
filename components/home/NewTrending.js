import {TrendingTop,TrendingBottom} from "./Trending"
import Motto from "./Motto"
import Marquee from "../utils/Marquee"
import { getLatestItems,getFavouriteItemData ,getTrendingItemData} from "../../lib/fetchDataSWR"
import Spinner from "../Spinner";
import {useSession,getSession} from "next-auth/react"
import { useEffect } from "react";

export default function NewTrending({cookies}){
    const {data:latestProducts,isLoading,error}= getLatestItems();
    const {data:session}=useSession();
    const user = cookies?.user
    ? JSON.parse(cookies.user)
    : session?.user
    ? session?.user
    : ""
    const {data:favourites,isLoading:isLoadingFavourites,error:errorfavourites}= getFavouriteItemData({userEmail:user.email});
    const {data:trending,isLoading:isLoadingTrending,error:errorTrending}=getTrendingItemData();
    useEffect(()=>{
        if(trending){
            console.log(trending)
        }
    },[trending])
    return (
        <div>
            {  isLoadingFavourites || errorfavourites || !favourites || isLoadingTrending || errorTrending || !trending?
                <div className="my-10">
                    <Spinner />
                </div>
                    :
                <div className="mt-5 md:mt-10">
                    <TrendingTop trendingItems={trending.data.slice(0,3)} user={user} favProducts={favourites.data.map((item)=>item.productId)}/>
                </div>
            }
            {isLoading || error || isLoadingFavourites || errorfavourites || !favourites?
                <div className="my-10">
                    <Spinner />
                </div>
                    :
                <div className="">
                    <Marquee user={user} products={latestProducts.data.slice(0,5)} favProducts={favourites.data.map((item)=>item.productId)}/>
                </div>
            }
            <div className="my-5">
                <Motto />
            </div>
            { isLoadingFavourites || errorfavourites || !favourites || isLoadingTrending || errorTrending || !trending?
                <div className="my-10">
                    <Spinner />
                </div>
                    :
                <div className="">
                    <TrendingBottom user={user} trendingItems={trending.data.slice(3)} favProducts={favourites.data.map((item)=>item.productId)}/>
                </div>
            }
            {isLoading || error|| isLoadingFavourites || errorfavourites || !favourites?
                <div className="my-10">
                    <Spinner />
                </div>
                    :
                <div>
                    <Marquee user={user} products={latestProducts.data.slice(5)} favProducts={favourites.data.map((item)=>item.productId)}/>
                </div>
            }   
        </div>
    )
}

export async function getServerSideProps(context) {
    const {cookies}= context.req
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
      props: {cookies,session}, // will be passed to the page component as props
    }
  }