import Image from "next/image"
import {useSession,getSession,signOut} from "next-auth/react"
import {useState} from "react"
import {ChartPieIcon,CogIcon,DatabaseIcon,TruckIcon,UsersIcon} from '@heroicons/react/solid'
import {Dashboard,SettingsData} from "../../components/Dashboard"
import {ShopData} from "../../components/ShopData"
import {OrdersData} from "../../components/OrdersData"

const panels = [<Dashboard />,<ShopData />,<OrdersData />,<SettingsData />];

export default function ManageShop(){
    const [dashboardTab,setDashboardTab] = useState(panels[0]);

    return(
        <div className="w-screen min-h-screen">
            <div className="grid grid-cols-12  min-h-screen">
                <div className="col-span-2 bg-gray-800">
                    <div className="flex flex-col w-100 h-screen justify-between">
                        <div className="grid grid-rows-8 gap-2">
                            <div className="w-100 m-12 row-span-4">
                                    <Image src="/vercel.svg" height={300} width={300}/>
                            </div>
                            <div className="w-100 row-span-1">
                                    <a onClick={()=>setDashboardTab(panels[0])} className="w-100 flex items-center justify-start py-4 pl-5 text-gray-400 text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                        <ChartPieIcon className="h-6 w-6 mr-2" /> Statistics
                                    </a>
                            </div>
                            <div className="w-100 row-span-1">
                                    <a onClick={()=>setDashboardTab(panels[1])} className="w-100 flex items-center justify-start py-4 pl-5 text-gray-400 text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                        <DatabaseIcon className="h-6 w-6 mr-2" /> Store
                                    </a>
                            </div>
                            <div className="w-100 row-span-1">
                                    <a onClick={()=>setDashboardTab(panels[2])} className="w-100 flex items-center justify-start py-4 pl-5 text-gray-400 text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                        <TruckIcon className="h-6 w-6 mr-2" /> Orders
                                    </a>
                            </div>
                            <div className="w-100 row-span-1">
                                    <a onClick={()=>setDashboardTab(panels[3])} className="w-100 flex items-center justify-start py-4 pl-5 text-gray-400 text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                        <CogIcon className="h-6 w-6 mr-2" /> Settings
                                    </a>
                            </div>
                        </div>
                        <div>
                            <div className="w-100 ">
                                <a className="w-100 flex items-center justify-start py-2 pl-5 mb-10 text-gray-400 text-xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                    <CogIcon className="h-6 w-6 mr-2" /> Settings
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-10 ">
                    {dashboardTab}
                </div>
            </div>
        </div>
    )

}
export async function getServerSideProps(context) {
    const {cookies}= context.req
    const session = await getSession(context);
    if(!session && !cookies.user){
        return{
            redirect:{
                permanent:false,
                destination:"/"
            },
        }
    }
    if(!session.user.userType || session.user.userType!="ADMIN"){
        return{
            redirect:{
                permanent:false,
                destination:"/private/ManageUser?panel=0"
            }
        }
    }else{
        return {
            props: {cookies,session}, // will be passed to the page component as props
        }
    }
  }
