import Image from "next/image"
import {useSession,getSession,signOut} from "next-auth/react"
import {Fragment,useState} from "react"
import {Dashboard,SettingsData} from "../../components/admin/Dashboard"
import {ShopData} from "../../components/admin/ShopData"
import {OrdersData} from "../../components/admin/OrdersData"
import cookie from "js-cookie";
import {TruckIcon,CogIcon,MenuIcon,ChartPieIcon,XIcon,DatabaseIcon, LogoutIcon,ShoppingBagIcon,CreditCardIcon} from '@heroicons/react/outline'
import {Dialog,Transition } from '@headlessui/react'
import {useRouter} from "next/router";


export default function ManageShop({cookies}){
    const router = useRouter()
    const {panel} = router.query;
    const {data:session}=useSession()
    const user = cookies.user?JSON.parse(cookies.user):session.user
    const cart = cookies.cart?JSON.parse(cookies.cart):[];
    
    const panels = [<Dashboard />,<ShopData />,<OrdersData />,<SettingsData />];
    const mobilePanels = [<Dashboard />,<ShopData />,<OrdersData />,<SettingsData />];
    const [dashboardTab,setDashboardTab] = useState(panels[0]);
    const [mobileTab,setMobileTab]=useState(mobilePanels[parseInt(panel)])
    const [sideNavOpen,setSideNavOpen]=useState(false)
    async function handleLogOut(){
        if(session){
          signOut();
        }
        cookie.remove("user");
        cookie.remove("token");
        cookie.remove("cart");
        router.push("/");
      }
    return(
        <div>
                <div className="w-screen min-h-screen md:hidden bg-gray-100">
                    <div className="flex fixed top-0 left-0 justify-between bg-gray-800 p-2 w-screen z-10">
                        <div className="flex items-center">
                            <img
                            className="h-10 w-auto md:h-12"
                            src="/Logo.svg"
                            alt="Workflow"
                            />
                            <h1 className="text-white font-bold text-xl md:text-3xl">&nbsp;VIRAL</h1>
                        </div>
                        <div className="flex items-center">
                            <div className="">
                                <button onClick={()=>setSideNavOpen(true)}><MenuIcon className="text-white h-8 w-8"/></button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border-b border-gray-200 flex justify-start items-center px-5">
                        <div className="bg-white  flex justify-between items-center pt-16 w-full">
                            <div className="flex flex-col">
                                <p className="text-gray-800 container mx-auto font-bold text-xl">Welcome,</p>
                                <p className="text-gray-800 container mx-auto font-bold text-xl text-blue-500">{user.name || (user.firstName+ " " + user.lastName)}</p>
                            </div>
                            <div className="mr-5">
                                {user.image?<Image src={user.image} width={75} height={75} className="rounded-full"/>:<Image src="/user .png" width={75} height={75} className="rounded-full"/>}
                            </div>
                        </div>
                    </div>
                    <div>
                        {user && dashboardTab}
                    </div>
                    <Transition.Root show={sideNavOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-10 md:hidden" onClose={()=>setSideNavOpen(false)}>
                            <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            >
                            <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="md:hidden fixed inset-0 overflow-hidden">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-16">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="md:hidden pointer-events-auto relative w-screen max-w-md">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                                        <button
                                            type="button"
                                            className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                            onClick={() => setSideNavOpen(false)}
                                        >
                                            <span className="sr-only">Close panel</span>
                                            <XIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <Dialog.Title className="text-4xl font-medium text-gray-900">Menu</Dialog.Title>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="flex flex-col items-start justify-between h-full">
                                                <div className="flex flex-col items-start">
                                                    <button onClick={()=>{setMobileTab(mobilePanels[0]);setSideNavOpen(false)}} className="flex w-fit items-center justify-center mb-5 rounded-md  text-gray-400  text-lg  hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <LogoutIcon className="h-6 w-6 mr-1" /> Statistics
                                                    </button>
                                                    <button onClick={()=>{setMobileTab(mobilePanels[1]);setSideNavOpen(false)}} className="flex w-fit items-center justify-center mb-5 rounded-md  text-gray-400  text-lg  hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <LogoutIcon className="h-6 w-6 mr-1" /> Store
                                                    </button>
                                                    <button onClick={()=>{setMobileTab(mobilePanels[2]);setSideNavOpen(false)}} className="flex w-fit items-center justify-center mb-5 rounded-md  text-gray-400  text-lg  hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <LogoutIcon className="h-6 w-6 mr-1" /> Orders
                                                    </button>
                                                    <button onClick={()=>{setMobileTab(mobilePanels[3]);setSideNavOpen(false)}} className="flex w-fit items-center justify-center mb-5 rounded-md  text-gray-400  text-lg  hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <LogoutIcon className="h-6 w-6 mr-1" /> Account
                                                    </button>
                                                   
                                                </div>
                                                <div className="flex flex-col p-5">
                                                    <div>
                                                        {user.image?<Image src={user.image} width={50} height={50} className="rounded-full"/>:<Image src="/user .png" width={50} height={50} className="rounded-full"/>}
                                                        <p className="text-sm text-gray-500">{user.name || (user.firstName+ " " + user.lastName)}</p>
                                                    </div>
                                                    <a href="/" className="flex w-fit items-center justify-center mb-5 rounded-md  text-gray-400  text-lg  hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <LogoutIcon className="h-6 w-6 mr-1" /> Store Front
                                                    </a>
                                                    <button onClick={()=>handleLogOut()} className="flex w-fit items-center justify-center mb-5 rounded-md py-2 text-gray-400  md:text-md lg:text-lg hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <LogoutIcon className="h-6 w-6 mr-1" /> LogOut
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                                </div>
                            </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                </div>
                <div className="hidden md:flex w-screen min-h-screen overflow-y-auto scrollbar bg-gray-100">
                    <div className="grid grid-cols-12 w-full">
                        <div className="z-10 w-full md:col-span-3 lg:col-span-2 bg-gray-800">
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
                                                    <a onClick={()=>setDashboardTab(panels[0])} className="w-100 flex items-center justify-start py-2 pl-5 text-gray-400 md:text-xl xl:text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <ChartPieIcon className="h-6 w-6 mr-2" /> Statistics
                                                    </a>
                                            </div>
                                            
                                            <div className="w-100 row-span-1">
                                                    <a onClick={()=>setDashboardTab(panels[1])} className="w-100 flex items-center justify-start py-2 pl-5 text-gray-400  md:text-xl xl:text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <DatabaseIcon className="h-6 w-6 mr-2" />Store
                                                    </a>
                                            </div>
                                            <div className="w-100 row-span-1">
                                                    <a onClick={()=>setDashboardTab(panels[2])} className="w-100 flex items-center justify-start py-2 pl-5 text-gray-400  md:text-xl xl:text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <TruckIcon className="h-6 w-6 mr-2" /> Orders
                                                    </a>
                                            </div>
                                            <div className="w-100 row-span-1">
                                                    <a onClick={()=>setDashboardTab(panels[3])} className="w-100 flex items-center justify-start py-2 pl-5 text-gray-400  md:text-xl xl:text-2xl hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <TruckIcon className="h-6 w-6 mr-2" /> Account
                                                    </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col p-5">
                                        <div>
                                            {user.image?<Image src={user.image} width={50} height={50} className="rounded-full"/>:<Image src="/user .png" width={50} height={50} className="rounded-full"/>}
                                            <p className="text-sm text-gray-500">{user.name || (user.firstName+ " " + user.lastName)}</p>
                                        </div>
                                        <button onClick={()=>router.push("/")} className="flex w-fit items-center justify-center  rounded-md py-2 text-gray-400  md:text-md lg:text-lg hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                            <LogoutIcon className="h-6 w-6 mr-1" /> Store Front
                                        </button>
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
