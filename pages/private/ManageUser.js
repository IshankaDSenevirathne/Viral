import {useSession,getSession,signOut} from "next-auth/react"
import cookie from "js-cookie";
import {TruckIcon,CogIcon,TrashIcon,ChartPieIcon,DatabaseIcon, LogoutIcon,ShoppingBagIcon,CreditCardIcon} from '@heroicons/react/outline'
import { useEffect,useState,useContext } from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import Overview from "../../components/user/Overview";
import Orders from "../../components/user/Orders";
import Account from "../../components/user/Account";
import Reviews from "../../components/user/Reviews";

export default function ManagesUser({cookies}){
    const router = useRouter()
    const {panel} = router.query;
    const {data:session}=useSession()
    const user = cookies.user?JSON.parse(cookies.user):session.user
    const cart = cookies.cart?JSON.parse(cookies.cart):[];
    const panels = [<Overview user={user} cart={cart}/>,<Orders user={user}/>,<Reviews />,<Account />];
    const [dashboardTab,setDashboardTab]=useState(panels[parseInt(panel)])
    async function handleLogOut(){
        if(session){
          signOut();
        }
        cookie.remove("user");
        cookie.remove("token");
        cookie.remove("cart");
      }
        return(
            <div>
                <div className="w-screen min-h-screen md:hidden">

                </div>
                <div className="hidden md:flex w-screen h-screen overflow-y-auto scrollbar bg-gray-100">
                    <div className="grid grid-cols-12">
                        <div className="md:col-span-3 lg:col-span-2 bg-gray-800">
                            <div className="fixed grid grid-cols-12 top-0 left-0 w-screen">
                                <div className="md:col-span-3 lg:col-span-2 flex flex-col w-full h-screen justify-between">
                                    <div className="grid grid-rows-8 w-full">
                                        <div className="w-full flex justify-center bg-blue-600 md:py-5 lg:py-10">
                                            <a href="/" className="row-span-4">
                                                    <Image src="/Logo.svg" height={60} width={60} objectFit="contain"/>
                                            </a >
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="w-100 row-span-1">
                                                    <a onClick={()=>setDashboardTab(panels[0])} className="w-100 flex items-center justify-start py-4 pl-5 text-gray-400 md:text-xl lg:text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <ChartPieIcon className="h-6 w-6 mr-2" /> Overview
                                                    </a>
                                            </div>
                                            <div className="w-100 row-span-1">
                                                    <a onClick={()=>setDashboardTab(panels[1])} className="w-100 flex items-center justify-start py-4 pl-5 text-gray-400  md:text-xl lg:text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <DatabaseIcon className="h-6 w-6 mr-2" /> Orders
                                                    </a>
                                            </div>
                                            <div className="w-100 row-span-1">
                                                    <a onClick={()=>setDashboardTab(panels[2])} className="w-100 flex items-center justify-start py-4 pl-5 text-gray-400  md:text-xl lg:text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <TruckIcon className="h-6 w-6 mr-2" /> Reviews
                                                    </a>
                                            </div>
                                            <div className="w-100 row-span-1">
                                                    <a onClick={()=>setDashboardTab(panels[3])} className="w-100 flex items-center justify-start py-4 pl-5 text-gray-400  md:text-xl lg:text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <TruckIcon className="h-6 w-6 mr-2" /> Account
                                                    </a>
                                            </div>
                                            <div className="w-100 row-span-1">
                                                    <a href="/" className="w-100 flex items-center justify-start py-4 pl-5 text-gray-400  md:text-xl lg:text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <TruckIcon className="h-6 w-6 mr-2" /> Store
                                                    </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col p-5">
                                        <div>
                                            {user.image?<Image src={user.image} width={50} height={50} className="rounded-full"/>:<Image src="/user .png" width={50} height={50} className="rounded-full"/>}
                                        </div>
                                        <button onClick={()=>handleLogOut()} className="flex w-fit items-center justify-center mb-5 rounded-md py-2 text-gray-400  md:text-md lg:text-lg hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                            <LogoutIcon className="h-6 w-6 mr-1" /> LogOut
                                        </button>
                                    </div>
                                </div>
                                <div className="md:col-span-9 lg:col-span-10">
                                </div>
                            </div>
                        </div>
                        <div className="z-10 md:col-span-9 lg:col-span-10">
                            {dashboardTab}
                        </div>
                    </div>
                </div>
            </div>
    )
}


export async function getServerSideProps(context) {
    const {cookies}= context.req
    console.log(context)
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

