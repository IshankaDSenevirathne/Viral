import {useContext,Fragment,useState, useEffect,} from "react";
import {useSession} from "next-auth/react";
import Image from "next/image";
import {Store} from "../lib/Store";
import {Menu,Transition,Dialog} from "@headlessui/react";
import {ShoppingCartIcon,ArchiveIcon,ShoppingBagIcon} from "@heroicons/react/outline";
import {XIcon} from "@heroicons/react/outline";
import { parseCookies } from 'nookies';
import cookie from "js-cookie";


import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ShoppingCart(){
    const [cart,setCart]=useState([]);
    const [isCartOpen,setCartOpen] = useState(false);
    const {state,dispatch} = useContext(Store);
    const {cart:store_cart}=state;
    const publishableKey = `${process.env.STRIPE_PUBLIC_KEY}`;
    const stripePromise = loadStripe(publishableKey);
    const { data: session } = useSession();
    const cookies = parseCookies();
    const user = cookies?.user
                ? JSON.parse(cookies.user)
                : session?.user
                ? session?.user
                : ""
    const store_cookie = cookies?.cart
                ? JSON.parse(cookies.cart)
                : []
    useEffect(()=>{
        if(store_cookie.length!=0){
            const newItems = store_cookie.filter(({ id: id1 }) => !store_cart.some(({ id: id2 }) => id2 === id1));
            const updatedCart = [...store_cart,...newItems];
            setCart(updatedCart);
        }else{
            setCart(store_cart)
        }
    },[store_cart,setCart])
    const createCheckOutSession = async () => {
        const stripe = await stripePromise;
        
        const checkoutSession = await axios.post('/api/checkout-sessions/create-stripe-session', {
          cart
        });
        const result = await stripe.redirectToCheckout({
          sessionId: checkoutSession.data.id,
        });
        if (result.error) {
          alert(result.error.message);
          return;
        }
      };
    async function handleSaveOrder(){

        if(user){
            const emailAddress = user.email;
            let orderPrice = 0;
            for(const product of cart){
                orderPrice+=product.price*product.quantity;
            }
            const products = cart.map((product)=>(
                {
                    productName:product.name,
                    productSize:product.size.size,
                    productQuantity:product.quantity,
                    productPrice:product.price,
                    productImage:product.imageURL,
                    productCompany:product.company
                } 
            ))
            const orderDetails={
                totalPrice:orderPrice,
                products
                }
            const res = await fetch('/api/manage-user/save-order',{
                body:JSON.stringify({
                    emailAddress,orderDetails
                }),
                headers:{
                    'Content-Type':'application/json',
                },
                method:'POST'
            });
            }
        }
    function handleRemoveCartItem(e,item){
        e.preventDefault();
        const remainingCart = cart.filter((cartItem)=>cartItem.id!=item.id)
        setCart(remainingCart);
        dispatch({type:"REMOVE_FROM_CART",payload:{removeItemId:item.id}});    
        const cookieStore = store_cookie.filter((cookieItem)=>cookieItem.id!=item.id);
        cookie.set("cart",JSON.stringify(cookieStore));
    }
    return (
            <div>
                <div className="flex flex-col lg:hidden">
                    <button className="relative text-gray-300 border-white border hover:text-blue-500 rounded-full p-2 hover:border-blue-500 font-semibold hover:bg-white hover:text-white text-sm duration-300 delay-10 focus:outline-none" onClick={()=>setCartOpen(true)}> 
                        <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs">{cart.length}</div></button>
                            <Transition appear show={isCartOpen} as={Fragment}>
                                <Dialog as="div" className="relative z-50" onClose={()=>setCartOpen(false)}>
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="fixed inset-0 bg-gray-700 bg-opacity-0 transition-opacity backdrop-brightness-50 block" />
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
                                                        {cart.length!=0 &&
                                                            <div className="grid grid-cols-2 gap-1 mb-5 py-4 border-b ">
                                                                <div>
                                                                    <button onClick={createCheckOutSession} className="sticky bottom-0 left-0 w-full flex items-center justify-center rounded-sm text-white border border-green-400 font-bold hover:bg-green-400 bg-green-500 p-2 duration-300 delay-10">
                                                                        <ShoppingBagIcon className="h-5 w-5 "/> Checkout
                                                                    </button>
                                                                </div>
                                                                <div>
                                                                    <button onClick={handleSaveOrder} className="sticky bottom-0 left-0 px-5 w-full flex items-center justify-center rounded-sm text-gray-800 font-bold bg-gray-100 hover:bg-white border border-gray-200 p-2 duration-300 delay-10">
                                                                        <ArchiveIcon className="h-5 w-5 "/> Save Order
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        }

                                                        {cart.length!=0 ? cart.map((item,index)=>
                                                            <div key={index} value={item}>
                                                                <div className="block  border shadow-md rounded-md text-sm text-gray-700 grid grid-cols-3">
                                                                    <div className="col-span-1 gap-0">
                                                                        <Image src={item.imageURL} className="rounded-l-md" width={200} height={200} objectFit="cover"/>
                                                                    </div>
                                                                    <div className="col-span-2 pl-2">
                                                                        <div className="flex justify-between h-full">
                                                                            <div className="flex pt-1">
                                                                                <div className="flex flex-col items-start">
                                                                                    <p className="text-gray-800  text-md font-bold">{item.name}</p>
                                                                                    <div className="flex flex-row w-full justify-left">
                                                                                        <p className="text-gray-400 text-sm">by </p>
                                                                                        <p className="text-gray-400 text-sm">&nbsp;{item.company}</p>
                                                                                    </div>
                                                                                    <div className="flex flex-row w-full justify-left pt-4">
                                                                                        <p className="text-gray-500 text-sm font-bold">&nbsp;{item.price}<span className="text-blue-500 font-bold" >$</span>&nbsp;({item.quantity})</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex text-right items-start p-2">
                                                                                <button onClick={(e)=>handleRemoveCartItem(e,item)}>
                                                                                    <XIcon className="text-right h-5 w-5 text-white rounded-sm bg-red-500"/>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            ):  
                                                            <div className="w-full h-full">
                                                                <p className="text-gray-400 text-xl py-20 w-full h-full border-dashed border rounded-md flex flex-col items-center justify-center ">Cart Empty</p>
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
                <Menu as="div" className="z-10 ml-3 relative hidden lg:flex">
                    <div className="">
                    <Menu.Button className="relative text-gray-300 border-white border hover:text-blue-500 rounded-full p-2 hover:border-blue-500 font-semibold hover:bg-white hover:text-white text-sm duration-300 delay-10 focus:outline-none">
                        <span className="sr-only">Shopping Cart</span>
                        <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs">{cart.length}</div>
                    </Menu.Button>
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
                
                    <Menu.Items className="origin-top-right absolute right-0 rounded-md  w-128 shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {cart.length!=0 &&
                            <div className="grid grid-cols-2 gap-1 my-5 py-4 border-b px-5">
                                <div>
                                    <button onClick={createCheckOutSession} className="sticky bottom-0 left-0 px-5 w-full flex items-center justify-center rounded-sm text-white font-bold hover:bg-green-400 bg-green-500 p-2 duration-300 delay-10">
                                        <ShoppingBagIcon className="h-5 w-5 "/> Checkout
                                    </button>
                                </div>
                                <div>
                                    <button onClick={handleSaveOrder} className="sticky bottom-0 left-0 px-5 w-full flex items-center justify-center rounded-sm text-gray-800 font-bold bg-gray-100 hover:bg-white border border-gray-200 p-2 duration-300 delay-10">
                                        <ArchiveIcon className="h-5 w-5 "/> Save Order
                                    </button>
                                </div>
                            </div>
                        }
                        <div className="flex flex-col max-h-142 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-white scrollbar-thumb-rounded pl-1 pr-3">
                            {cart.length!=0 ? cart.map((item,index)=>
                                <Menu.Item key={index} value={item}>
                                    {({ active }) => (
                                    <div className={classNames(active ? 'bg-gray-100 rounded-md' : '', 'block  text-sm text-gray-700',"grid grid-cols-3")}>
                                        <div className="col-span-1 gap-0">
                                            <Image src={item.imageURL} className="rounded-md" width={200} height={200} objectFit="cover"/>
                                        </div>
                                        <div className="col-span-2 pl-2">
                                            <div className="flex flex-row justify-between h-full">
                                                <div className="flex items-center">
                                                    <div className="flex flex-col items-start">
                                                        <p className="text-gray-800  text-lg font-bold">{item.name}</p>
                                                        <div className="flex flex-row w-full justify-left">
                                                            <p className="text-gray-400 text-sm">by </p>
                                                            <p className="text-gray-400 text-sm">&nbsp;{item.company}</p>
                                                        </div>
                                                        <div className="flex flex-row w-full justify-left pt-4">
                                                            <p className="text-gray-500 text-sm font-bold">&nbsp;{item.price}<span className="text-blue-500 font-bold" >$</span>&nbsp;({item.quantity})</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex text-right items-start ">
                                                    <button onClick={(e)=>handleRemoveCartItem(e,item)} className={classNames(active?'visible':'invisible')}>
                                                        <XIcon className="text-right h-5 w-5 text-white rounded-sm bg-red-500"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )
                                }
                                </Menu.Item>
                            
                                ):  <Menu.Item>
                                        <div className="text-center py-2 pl-2">
                                            <p className="text-gray-400 text-xl py-20 border-dashed border rounded-md">Cart Empty</p>
                                        </div>
                                    </Menu.Item>
                            }
                        </div>
                    </Menu.Items>
                    </Transition>
                </Menu>
            </div>

    )
}