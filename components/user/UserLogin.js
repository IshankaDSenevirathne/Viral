import { useSession, signIn, signOut, getSession } from "next-auth/react"
import {useState,useEffect,useContext,Fragment} from "react"
import Image from "next/image"
import Link from "next/link"
import {Menu, Transition,Dialog } from '@headlessui/react'
import axios from "axios"
import cookie from "js-cookie";
import { parseCookies } from 'nookies';
import {LogoutIcon,UserIcon,CogIcon,TruckIcon,InformationCircleIcon} from "@heroicons/react/outline"
import {HeartIcon as SolidHeartIcon,XIcon} from "@heroicons/react/solid"
import {getFavouriteItemData} from "../../lib/fetchDataSWR"
import Spinner from "../Spinner"
import {useRouter} from "next/router";
import {Store} from "../../lib/Store";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function UserLogin() {

  const [isLoginOpen,setIsLoginOpen] = useState(false);
  const [isSignUpOpen,setIsSignUpOpen] = useState(false);
  const [isFavouritesOpen,setFavouritesOpen] = useState(false);
  const [isUserOpen,setUserOpen] = useState(false);
  const [userFirstName,setUserFirstName]=useState("");
  const [userLastName,setUserLastName]=useState("");
  const [userEmail,setUserEmail]=useState("");
  const [userPassword,setUserPassword]=useState("");
  
  const [userState,setUserState]=useState("");
  const {state,dispatch} = useContext(Store);
  const favouritesStore=state.favourites;
  const [favourites,setFavourites]=useState(favouritesStore?favouritesStore:[]);

  const { data: session } = useSession();
  const router = useRouter();
  const cookies = parseCookies();
  const user = cookies?.user
                ? JSON.parse(cookies.user)
                : session?.user
                ? session?.user
                : ""
  const {data:favouriteItems,isLoading:isLoadingfavourites,errorfavourites} = getFavouriteItemData({userEmail:user.email});
  
  useEffect(()=>{
    if(user){
      setUserState(user);
    }
  },[router,setUserState])

  useEffect(()=>{
    if(favouriteItems && favouriteItems.data.length>0){
      dispatch({type:"ADD_TO_FAVOURITES",payload:favouriteItems.data})
      setFavourites(favouriteItems.data)
    }
  },[favouriteItems])
  async function handleLogOut(){
    if(session){
      signOut();
    }
    cookie.remove("user");
    cookie.remove("token");
    cookie.remove("cart");
    setUserState("")
  }
  async function handleSignUp(){
    try{
      const credentials = {firstName:userFirstName,lastName:userLastName,email:userEmail,password:userPassword};
      const res = await axios.post("/api/manage-user/register-user",credentials,{headers:{"Content-Type":"application/json"}});
      if(res.status==201){
        alert("success");
        cookie.set("token",res.data.token);
        cookie.set("user",JSON.stringify(res.data.user));
        router.push("/");
      }
    }catch(error){
      console.log(error);
    }
  }
  async function handleLogIn(){
    try{
      const credentials = {email:userEmail,password:userPassword};
      console.log(credentials);
      const res = await axios.post("/api/manage-user/login-user",credentials,{headers:{"Content-Type":"application/json"}});
      console.log(res)
      if(res.status==200){
        alert("success");
        cookie.set("token",res.data.token);
        cookie.set("user",JSON.stringify(res.data.user));
        router.push("/");
      }
    }
    catch(error){
      console.log(error);
    }
  }
  async function handleRemoveFromFavourites(e,item){
    e.preventDefault();
    const favouritesRemaining = favourites.filter((favItem)=>favItem.productId!= item.productId)
    const res = await axios.post("/api/manage-user/user-favourites",item,{headers:{"Content-Type":"application/json"}});
    if(res.status==200){
      dispatch({type:"REMOVE_FROM_FAVOURITES",payload:{ 
        productName:item.name,
       }});
      setFavourites(favouritesRemaining);
    }
  }
  if(user){
    return (
          <div className="flex  ml-3  items-center">
              <div>
                <div className="flex flex-col md:hidden">
                    <button className="relative text-gray-300 border-white border hover:text-red-400 focus:outline-none rounded-full p-2 hover:border-red-400 font-semibold hover:bg-white hover:text-white text-sm duration-300 delay-10" onClick={()=>setFavouritesOpen(true)}> 
                        <SolidHeartIcon className="h-5 w-5" aria-hidden="true" />
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-400 text-white rounded-full text-xs">{favourites.length}</div></button>
                    <Transition appear show={isFavouritesOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-50" onClose={()=>setFavouritesOpen(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="hidden fixed inset-0 bg-gray-700 bg-opacity-0 transition-opacity backdrop-brightness-50 sm:block" />
                            </Transition.Child>

                            <div className="fixed z-50 inset-0 overflow-y-auto">
                                <div className="flex min-h-screen w-screen text-center sm:block md:px-2 lg:px-4">
                                {/* This element is to trick the browser into centering the modal contents. */}
                                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                    &#8203;
                                </span>
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="flex text-base text-left transform transition shadow-2xl w-screen sm:w-fit sm:inline-block sm:max-w-xl md:max-w-2xl md:mx-4 sm:align-middle lg:max-w-7xl">
                                            <div className="flex flex-col px-5 py-16 bg-white rounded-md shadow-2xl w-screen sm:w-fit gap-1">
                                                {isLoadingfavourites?
                                                    <div className="text-center">
                                                        <Spinner />
                                                    </div>
                                                  :favourites.length!=0? favourites.map((item,index)=>
                                                    <div key={index}>
                                                          <div className="block text-sm text-gray-700 grid grid-cols-3 border pt-1 pl-1 rounded-md shadow-md">
                                                              <div className="col-span-1 gap-0">
                                                                  <Image src={item.productImages[0]} className="rounded-md" width={200} height={200} objectFit="cover"/>
                                                              </div>
                                                              <div className="col-span-2 pl-2">
                                                                  <div className="flex flex-row justify-between h-full">
                                                                      <div className="flex items-center">
                                                                          <div className="flex flex-col items-start">
                                                                              <p className="text-gray-800  text-lg font-bold">{item.productName}</p>
                                                                              <div className="flex flex-row w-full justify-left">
                                                                                  <p className="text-gray-400 text-sm">by </p>
                                                                                  <p className="text-gray-400 text-sm">&nbsp;{item.productCompany}</p>
                                                                              </div>
                                                                              <div className="flex flex-row w-full justify-left pt-4">
                                                                                  <p className="text-gray-500 text-sm font-bold">&nbsp;{item.productPrice}<span className="text-blue-500 font-bold" >$</span></p>
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                                                      <div className="flex text-right items-start ">
                                                                          <button onClick={(e)=>handleRemoveFromFavourites(e,item)}>
                                                                              <SolidHeartIcon className="text-right pr-1 pt-1 h-7 w-7 text-red-400 rounded-sm hover:text-red-200"/>
                                                                          </button>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                    </div>
                                                    )
                                                    :  
                                                    <div>
                                                          <div className="w-full h-full">
                                                              <p className="text-gray-400 text-xl py-20 border border-dashed rounded-md flex flex-col justify-center items-center w-full h-full">Wishlist Empty</p>
                                                          </div>
                                                    </div>
                                                  }
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </div>
                <Menu as="div" className="z-10 relative hidden md:flex">
                  <Menu.Button className="relative text-gray-300 border-white border hover:text-red-400 focus:outline-none rounded-full p-2 hover:border-red-400 font-semibold hover:bg-white hover:text-white text-sm duration-300 delay-10 ">
                      <span className="sr-only">Favourite Items</span>
                      <SolidHeartIcon className="h-5 w-5" aria-hidden="true" />
                      {favourites ? 
                      <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-400 text-white rounded-full text-xs">{favourites.length}</div>
                        :
                      <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-400 text-white rounded-full text-xs">0</div>
                    }
                  </Menu.Button>
                  <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 rounded-md  w-screen md:w-128 shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="flex flex-col max-h-screen md:max-h-142 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-white scrollbar-thumb-rounded pl-1 pt-1 pr-3">
                            {isLoadingfavourites?
                                <Menu.Item>
                                <div className="text-center">
                                    <Spinner />
                                </div>
                                </Menu.Item>
                              :favourites.length!=0? favourites.map((item,index)=>
                                <Menu.Item key={index}>
                                    {({ active }) => (
                                      <div className={classNames(active ? 'bg-gray-100 rounded-md' : '', 'block  text-sm text-gray-700',"grid grid-cols-3")}>
                                          <div className="col-span-1 gap-0">
                                              <Image src={item.productImages[0]} className="rounded-md" width={200} height={200} objectFit="cover"/>
                                          </div>
                                          <div className="col-span-2 pl-2">
                                              <div className="flex flex-row justify-between h-full">
                                                  <div className="flex items-center">
                                                      <div className="flex flex-col items-start">
                                                          <p className="text-gray-800  text-lg font-bold">{item.productName}</p>
                                                          <div className="flex flex-row w-full justify-left">
                                                              <p className="text-gray-400 text-sm">by </p>
                                                              <p className="text-gray-400 text-sm">&nbsp;{item.productCompany}</p>
                                                          </div>
                                                          <div className="flex flex-row w-full justify-left pt-4">
                                                              <p className="text-gray-500 text-sm font-bold">&nbsp;{item.productPrice}<span className="text-blue-500 font-bold" >$</span></p>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  <div className="flex text-right items-start ">
                                                      <button onClick={(e)=>handleRemoveFromFavourites(e,item)} className={classNames(active?'visible':'invisible')}>
                                                          <SolidHeartIcon className="text-right pr-1 pt-1 h-7 w-7 text-red-400 rounded-sm hover:text-red-200"/>
                                                      </button>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                    )
                                  }
                                </Menu.Item>
                                )
                                :  
                                <Menu.Item>
                                      <div className="text-center">
                                          <p className="text-gray-400 text-xl py-20 border border-dashed rounded-md">Wishlist Empty</p>
                                      </div>
                                </Menu.Item>
                              }
                        </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div>
                <div className="flex ml-3 flex-col md:hidden">
                    <button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 md:mr-3" onClick={()=>setUserOpen(true)}> 
                      {user.image?<Image src={user.image} width={50} height={50} className="rounded-full"/>:<Image src="/user .png" width={50} height={50} className="rounded-full"/>}
                    </button>
                    <Transition.Root show={isUserOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-50 md:hidden" onClose={()=>setUserOpen(false)}>
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
                                            onClick={() => setUserOpen(false)}
                                        >
                                            <span className="sr-only">Close panel</span>
                                            <XIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="px-4 sm:px-6 bg-gray-800 py-2">
                                          <Dialog.Title className="text-3xl font-medium text-white">
                                          <div>
                                            {user.image?<Image src={user.image} width={100} height={100} className="rounded-full"/>:<Image src="/user .png" width={100} height={100} className="rounded-full"/>}
                                            <p className="text-lg text-white">{user.name || (user.firstName+ " " + user.lastName)}</p>
                                          </div>
                                          </Dialog.Title>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            <div className="flex flex-col items-start justify-between h-full">
                                                <div className="flex flex-col items-start text-lg gap-4 text-gray-400">
                                                    <div >
                                                      <Link
                                                        href="/private/ManageUser?panel=0"
                                                      >
                                                        <p className="flex items-center">
                                                          <UserIcon className="h-6 w-6 mr-1 text-blue-500" />Profile
                                                        </p>
                                                      </Link>
                                                    </div>
                                                    <div>
                                                      <Link
                                                        href="/private/ManageUser?panel=1"
                                                      >
                                                      <p className="flex items-center">
                                                          <TruckIcon className="h-6 w-6 mr-1 text-blue-500" />Orders
                                                        </p>
                                                      </Link>
                                                    </div>
                                                    <div>
                                                      <Link
                                                        href="/private/ManageUser?panel=2"
                                                      >
                                                        <p className="flex items-center">
                                                          <CogIcon className="h-6 w-6 mr-1 text-blue-500" />Settings
                                                        </p>
                                                      </Link>
                                                    </div>
                                                    <div>
                                                      <Link
                                                        href="/private/ManageUser?panel=3"
                                                      >
                                                        <p className="flex items-center">
                                                          <InformationCircleIcon className="h-6 w-6 mr-1 text-blue-500" />Help
                                                        </p>
                                                      </Link>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col p-5">
                                                   
                                                    <button onClick={()=>handleLogOut()} className="flex w-fit items-center justify-center mb-5 rounded-md py-2 text-gray-400  md:text-md lg:text-lg hover:text-white cursor-pointer hover:bg-gray-700 duration-200 delay-10">
                                                        <LogoutIcon className="h-6 w-6 mr-1" /> LogOut
                                                    </button>
                                                </div>
                                            </div>
                                       
                                        {/* /End replace */}
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
                <Menu as="div" className="z-10 ml-3 relative hidden md:flex">
                  <div className="flex items-center">
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 md:mr-3">
                      <span className="sr-only">Open user menu</span>
                        {user.image?<Image src={user.image} width={50} height={50} className="rounded-full"/>:<Image src="/user .png" width={50} height={50} className="rounded-full"/>}
                    </Menu.Button>
                    <span className="text-white text-md font-semibold hidden md:flex">{user.name || (user.firstName+ " " + user.lastName)}</span>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/private/ManageUser?panel=0"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/private/ManageUser?panel=1"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Orders
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/private/ManageUser?panel=2"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="/private/ManageUser?panel=3"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Help
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700') }
                            onClick={() => handleLogOut()}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
          </div>
        )
  }
  return (
    <div className="ml-3">
      <div className="flex gap-3">
        <button className="py-2 px-4 text-gray-300 rounded-md font-semibold hover:bg-gray-700 hover:text-white text-sm duration-300 delay-10 " onClick={()=>setIsLoginOpen(true)}>Sign In</button>
        <button className="py-2 px-4 text-gray-300 rounded-md font-semibold hover:bg-gray-700 hover:text-white text-sm duration-300 delay-10 " onClick={()=>setIsSignUpOpen(true)}>Sign Up</button>
      </div>
      <Transition appear show={isSignUpOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={()=>setIsSignUpOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="hidden fixed inset-0 bg-gray-700 bg-opacity-0 transition-opacity backdrop-brightness-50 sm:block" />
                    </Transition.Child>

                    <div className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex min-h-screen w-screen text-center sm:block md:px-2 lg:px-4">
                          {/* This element is to trick the browser into centering the modal contents. */}
                          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                              &#8203;
                          </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                  <Dialog.Panel className="flex text-base text-left transform transition shadow-2xl w-screen sm:w-fit sm:inline-block sm:max-w-xl md:max-w-2xl md:mx-4 sm:align-middle lg:max-w-7xl">
                                    <div className="flex flex-col px-5 py-16 bg-white rounded-md shadow-2xl w-screen sm:w-fit">
                                        <h1 className="text-3xl font-bold text-center">Sign Up with Viral</h1>
                                        <div className="flex flex-col mt-12 gap-5">
                                          <input type="text" className="focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 w-full sm:w-128 h-12 p-2 border-gray-200 border rounded-sm" placeholder="First Name" onChange={(e)=>setUserFirstName(e.target.value)}/>
                                          <input type="text" className="focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 w-full sm:w-128 h-12 p-2 border-gray-200 border rounded-sm" placeholder="Last Name" onChange={(e)=>setUserLastName(e.target.value)}/>
                                          <input type="email" className="focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 w-full sm:w-128 h-12 p-2 border-gray-200 border rounded-sm" placeholder="Email Address" onChange={(e)=>setUserEmail(e.target.value)}/>
                                          <input type="password" className="focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 w-full sm:w-128 h-12 p-2 border-gray-200 border rounded-sm " placeholder="Password" onChange={(e)=>setUserPassword(e.target.value)}/>
                                          <button className="w-full py-2 bg-blue-500 hover:bg-blue-400 duration-300 delay-10 text-white font-semibold text-xl rounded-sm mt-5"  onClick={()=>handleSignUp()}>Sign Up</button>
                                        </div>
                                        <h1 className="text-xl font-semibold text-gray-400 text-center my-4">OR</h1>
                                        <div className="flex flex-col gap-2">
                                          <button aria-label="Continue with google" className="focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 py-3.5 px-4 border rounded-sm border-gray-500 flex items-center justify-center w-full" onClick={() => signIn("google")}>
                                            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z" fill="#4285F4" />
                                                <path d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z" fill="#34A853" />
                                                <path d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z" fill="#FBBC05" />
                                                <path d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z" fill="#EB4335" />
                                            </svg>
                                            <span className="text-base font-medium ml-4 text-gray-700">Continue with Google</span>
                                          </button>
                                        </div>
                                        <div className="mt-10 text-center">
                                          <span>Already have an account ? &nbsp;</span>
                                          <button onClick={()=>{
                                            setUserFirstName("");
                                            setUserPassword("");
                                            setUserEmail("");
                                            setUserPassword("");
                                            setIsSignUpOpen(false);
                                            setIsLoginOpen(true);
                                          }} className="text-blue-500 hover:text-blue-400 pointer-cursor">
                                             Log in.
                                          </button>
                                        </div>
                                    </div>
                                  </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
      </Transition>
      <Transition appear show={isLoginOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={()=>setIsLoginOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="hidden fixed inset-0 bg-gray-700 bg-opacity-0 backdrop-brightness-50 transition-opacity sm:block" />
                    </Transition.Child>

                    <div className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex min-h-screen  w-screen text-center sm:block sm:px-2 lg:px-4" style={{ fontSize: 0 }}>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                  <Dialog.Panel className="flex text-base text-left transform transition shadow-2xl sm:inline-block sm:max-w-xl md:max-w-2xl md:mx-4 sm:align-middle lg:max-w-7xl">
                                    <div className="flex flex-col justify-center px-5 py-16 bg-white rounded-md shadow-2xl w-screen sm:w-fit">
                                        <h1 className="text-3xl font-bold text-center">Sign in to Viral</h1>
                                        <div className="flex flex-col mt-12 gap-5">
                                          <input type="email" className="focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 sm:w-128 w-full h-12 p-2 border-gray-200 border rounded-sm" placeholder="Email Address" onChange={(e)=>setUserEmail(e.target.value)}/>
                                          <input type="password" className="focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 sm:w-128 w-full h-12 p-2 border-gray-200 border rounded-sm " placeholder="Password"onChange={(e)=>setUserPassword(e.target.value)}/>
                                          <button className="w-full py-2 bg-blue-500 hover:bg-blue-400 duration-300 delay-10 text-white font-semibold text-xl rounded-sm mt-5" onClick={()=>handleLogIn()}>Log in</button>
                                        </div>
                                        <h1 className="text-xl font-semibold text-gray-400 text-center my-4">OR</h1>
                                        <div className="flex flex-col gap-2">
                                          <button aria-label="Continue with google" className="focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 py-3.5 px-4 border rounded-sm border-gray-500 flex items-center justify-center w-full" onClick={() => signIn("google")}>
                                            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.9892 10.1871C18.9892 9.36767 18.9246 8.76973 18.7847 8.14966H9.68848V11.848H15.0277C14.9201 12.767 14.3388 14.1512 13.047 15.0812L13.0289 15.205L15.905 17.4969L16.1042 17.5173C17.9342 15.7789 18.9892 13.221 18.9892 10.1871Z" fill="#4285F4" />
                                                <path d="M9.68813 19.9314C12.3039 19.9314 14.4999 19.0455 16.1039 17.5174L13.0467 15.0813C12.2286 15.6682 11.1306 16.0779 9.68813 16.0779C7.12612 16.0779 4.95165 14.3395 4.17651 11.9366L4.06289 11.9465L1.07231 14.3273L1.0332 14.4391C2.62638 17.6946 5.89889 19.9314 9.68813 19.9314Z" fill="#34A853" />
                                                <path d="M4.17667 11.9366C3.97215 11.3165 3.85378 10.6521 3.85378 9.96562C3.85378 9.27905 3.97215 8.6147 4.16591 7.99463L4.1605 7.86257L1.13246 5.44363L1.03339 5.49211C0.37677 6.84302 0 8.36005 0 9.96562C0 11.5712 0.37677 13.0881 1.03339 14.4391L4.17667 11.9366Z" fill="#FBBC05" />
                                                <path d="M9.68807 3.85336C11.5073 3.85336 12.7344 4.66168 13.4342 5.33718L16.1684 2.59107C14.4892 0.985496 12.3039 0 9.68807 0C5.89885 0 2.62637 2.23672 1.0332 5.49214L4.16573 7.99466C4.95162 5.59183 7.12608 3.85336 9.68807 3.85336Z" fill="#EB4335" />
                                            </svg>
                                            <span className="text-base font-medium ml-4 text-gray-700">Continue with Google</span>
                                          </button>
                                        </div>
                                        <div className="mt-10 text-center">
                                          New to Viral ? &nbsp;
                                          <button onClick={()=>{
                                            setUserEmail("");
                                            setUserPassword("");
                                            setIsLoginOpen(false);
                                            setIsSignUpOpen(true);
                                          }} className="text-blue-500 hover:text-blue-400 pointer-cursor">
                                             Create an account.
                                          </button>
                                        </div>
                                    </div>
                                  </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
      </Transition>
    </div>
  )
}

export async function getServerSideProps(context){

  const session = await getSession(context);
  console.log(session);
  return{
    props:{session}
  }

}