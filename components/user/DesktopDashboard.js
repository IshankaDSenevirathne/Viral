
import {getUserOrdersData,getSavedOrdersData,getFavouriteItemData} from "../../lib/fetchDataSWR"
import {TruckIcon,TrashIcon,GiftIcon,ShoppingBagIcon,CreditCardIcon, CogIcon} from '@heroicons/react/outline'
import { useEffect,useState,useContext } from "react";
import {Store} from "../../lib/Store";
import Spinner from "../../components/Spinner"
import Image from "next/image"
import { loadStripe } from '@stripe/stripe-js';
import cookie from "js-cookie"
import axios from "axios";
import ProductCard from "../ProductCard";


export default function DesktopDashboard({user,cart}){
    const [totalPrice,setTotalPrice]=useState(0);
    const [savedOrders,setSavedOrders]=useState("");
    const {state,dispatch} = useContext(Store);
    const {data:ordersData,isLoading:isLoadingOrders,error} = getUserOrdersData({userEmail:user.email});
    const {data:savedUserOrders,isLoading:isLoadingSavedOrders,errorSavedOrders} = getSavedOrdersData({userEmail:user.email});
    const {data:favourites,isLoading:isLoadingfavourites,errorfavourites} = getFavouriteItemData({userEmail:user.email});
    const [liveCart,setLiveCart]= useState([])
    const publishableKey = process.env.STRIPE_PUBLIC_KEY;
    const stripePromise = loadStripe(publishableKey);

    const createCheckOutSession = async (cart) => {
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
    useEffect(()=>{
        if(savedUserOrders){
            setSavedOrders(savedUserOrders.data)
        }
    },[savedUserOrders,setSavedOrders])
    useEffect(()=>{
        let orderPrice=0;
        if(cart.length==0 && state.cart.length==0){
            orderPrice=0;
            setLiveCart([]);
            return
        }
        if(cart.length!=0 && state.cart.length==0){
            for(const product of cart){
                orderPrice+=product.price*product.quantity;
            }
            setLiveCart(cart)
        }
        else if(cart.length==0 && state.cart.length!=0){
            for(const product of state.cart){
                orderPrice+=product.price*product.quantity;
            }
            setLiveCart(state.cart)
        }else{
            const newItem = state.cart.filter(({ id: id1 }) => !cart.some(({ id: id2 }) => id2 === id1));
            let remainingItems;
            let updatedCart=[];
            if(newItem.length!=0){
                remainingItems = store_cookie.filter((item)=>item.id!=newItem.id);
                updatedCart=[...remainingItems,...newItem];
                for(const product of updatedCart){
                    orderPrice+=product.price*product.quantity;
                }
            }if(state.cart.length!=0){
                let new_store_cookie = store_cookie
                for(const item of state.cart){
                    const idx=new_store_cookie.findIndex((item_cookie)=>item_cookie.id==item.id)
                    new_store_cookie[idx]=item
                }
                updatedCart=[...new_store_cookie]
                for(const product of updatedCart){
                    orderPrice+=product.price*product.quantity;
                }
            }
        }
        setTotalPrice(orderPrice);
    },[state,cart,setTotalPrice])
    useEffect(()=>{
        if(state.cart.length==0 || !liveCart){
            return;
        }
        const newItem = state.cart.filter(({ id: id1 }) => !liveCart.some(({ id: id2 }) => id2 === id1));
        let updatedCart=[];
        let orderPrice=0;

        if(newItem.length!=0){
            setLiveCart([...liveCart,...newItem]);
            return;
        }else{
            let unAltered=[];
            for(const item of state.cart){
                const unMatched = liveCart.filter((liveItem)=>liveItem.id!=item.id)
                console.log(unMatched)
                for(const item2 of unMatched){
                    if(unAltered.filter((dupItem)=>dupItem.id==item2.id).length==0 && state.cart.filter((item)=>item.id==item2.id).length==0){
                        unAltered.push(item2)
                    }
                }
            }
            console.log(unAltered)
            updatedCart=[...state.cart,...unAltered]
            setLiveCart(updatedCart);
            for(const product of updatedCart){
                orderPrice+=product.price*product.quantity;
            }
            setTotalPrice(orderPrice);
            return
        }
    },[state,setLiveCart])
    async function handleSaveOrder(order){

        if(user){
            const emailAddress = user.email;
            let orderPrice = 0;
            for(const product of order){
                orderPrice+=product.price*product.quantity;
            }
            const products = order.map((product)=>(
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
    async function handleOrderDelete(order){
        const res = await fetch("/api/manage-user/save-order",{
            body:JSON.stringify({
                orderId:order._id
            }),
            method:'DELETE'
        })
        if(res.status==201){
            const remainingSavedOrders = savedOrders.filter((savedOrder)=>savedOrder._Id!=order._id)
            setSavedOrders(remainingSavedOrders);
        }
    }
    function handleEmptyCart(){
        dispatch({type:"EMPTY_CART"});
        cookie.set("cart",JSON.stringify([]));
        setLiveCart([]);
        setTotalPrice(0);
    }
    return(     <div>
                    <div className="bg-white md:h-32 lg:h-36 border-b border-gray-200 flex justify-start items-center p-5">
                        <div className="bg-white md:h-32 lg:h-36 border-b border-gray-200 flex justify-start items-center p-5 w-full">
                            <p className="text-gray-800 container mx-auto font-bold md:text-2xl lg:text-4xl">Welcome, <span className="text-blue-500">{user.name || (user.firstName+ " " + user.lastName)}</span></p>
                            <div className="mr-5">
                                {user.image?<Image src={user.image} width={100} height={100} className="rounded-full"/>:<Image src="/user .png" width={100} height={100} className="rounded-full"/>}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-5 my-10 rounded-md shadow-md">
                        <h1 className="text-gray-800 text-3xl font-bold mb-5">Whishlist</h1>
                        <div className="">
                            {isLoadingfavourites ? <Spinner/>:""}
                            <div className="grid grid-cols-5 gap-0">
                                {favourites && favourites.data.length!=0 &&
                                    favourites.data.map((product,index) => (
                                        <ProductCard key={index} favStatus={true} className="w-full"  id={product.productId} limits={1000} user={user?1:0} name={product.productName} email={user.email} company={product.productCompany} images={product.productImages.map((image)=>({url:image}))} price={product.productPrice}  features={product.productFeatures} colors={product.productColors} sizes={product.productSizes}/>)
                                        )
                                }
                            </div>
                            {!isLoadingfavourites && favourites.data.length==0 &&
                                <div>
                                    You have no items on your wishlist!
                                </div>
                            }
                        </div>
                    </div>
                    <div className="hidden md:block px-2 w-full ">
                        <div className="w-full bg-gray-100 rounded-md my-2 md:min-h-screen lg:min-h-fit">
                            <div  className="pt-5 shadow-md md:min-h-screen lg:min-h-fit rounded-md bg-white">
                                {(liveCart && liveCart.length!=0)?
                                    <div  className="h-fit flex flex-col">
                                        <div className="">
                                            <h1 className="text-gray-800 text-center md:text-xl lg:text-3xl font-bold ">Your Shopping Cart</h1>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className=" rounded-md p-2 ">
                                                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2">
                                                    {liveCart.map((product,index) => (
                                                        <div key={index}>
                                                            <div className="group bg-gray-100 w-full shadow-sm rounded-md hover:shadow-sm hover:shadow-gray-400 duration-300 delay-10">
                                                                <div className="relative">
                                                                    <Image src={product.imageURL} width={400} height={400} objectFit="cover" className="rounded-t-md"/>
                                                                    <div className="opacity-0 flex group-hover:opacity-100 duration-300 delay-10 absolute bottom-0 right-0 bg-white/30 backdrop-blur-sm  p-1 mb-1.5">
                                                                        <button  onClick={()=>{
                                                                            setProduct(product);
                                                                            setOrderId(order.orderId);
                                                                            setIsOpen(true);
                                                                        }}><TrashIcon className="h-5 w-5 text-red-500"/></button>
                                                                        <button  onClick={()=>{
                                                                            setProduct(product);
                                                                            setOrderId(order.orderId);
                                                                            setIsOpen(true);
                                                                        }}><CogIcon className="h-5 w-5 text-blue-500"/></button>
                                                                    </div>
                                                                </div>
                                                                <div className="pt-2 px-2">
                                                                    <p className="md:text-sm lg:text-md text-gray-800">
                                                                        {product.name}
                                                                    </p>
                                                                    <p className="md:text-xs lg:text-sm text-gray-400">
                                                                        By {product.company}
                                                                    </p>
                                                                    <div className="flex py-2 items-center gap-2">
                                                                        <div className="bg-red-500 rounded-2xl md:w-2 md:h-2 lg:w-4 lg:h-4"></div>
                                                                        <p className="md:text-xs lg:text-sm text-gray-800 ">M</p>
                                                                        <p className="md:text-xs lg:text-sm text-gray-800">
                                                                            {product.price}<span className="text-blue-500 font-bold">$</span>
                                                                        </p>
                                                                        <p className="md:text-xs lg:text-sm text-gray-800">
                                                                            x{product.quantity}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mt-5 border-t p-5 grow-0 rounded-b-md">
                                                <div className="w-full">
                                                    <div className="flex items-center justify-between text-center">
                                                        <p className="font-bold md:text-2xl lg:text-4xl text-gray-800">{parseFloat(totalPrice).toFixed(2)}<span className="text-blue-500 font-bold">$</span></p>
                                                        <div className="md:grid lg:flex">
                                                            <button
                                                                onClick={handleEmptyCart}
                                                                type="button"
                                                                className="inline-flex m-1 px-5 justify-center rounded-md border border-gray-200 bg-gray-100  py-2 items-center md:text-sm lg:text-md font-medium text-gray-800 hover:bg-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300 delay-10"
                                                                >
                                                                <TrashIcon className="mx-2 h-5 w-5 text-gray-800"/>
                                                                Empty Cart
                                                            </button>
                                                           
                                                            <button
                                                                onClick={()=>handleSaveOrder(liveCart)}
                                                                type="button"
                                                                className="inline-flex m-1 px-5 justify-center rounded-md bg-blue-500  py-2 items-center md:text-sm lg:text-md font-medium text-white hover:bg-blue-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300 delay-10"
                                                                >
                                                                <ShoppingBagIcon className="mx-2 h-5 w-5 text-white"/>
                                                                Save Order
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="inline-flex m-1 px-5 justify-center rounded-md border border-transparent bg-green-500  py-2 items-center md:text-sm lg:text-md font-medium text-white hover:bg-green-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300 delay-10"
                                                                onClick={()=>createCheckOutSession(liveCart)}
                                                                >
                                                                <CreditCardIcon className="mx-2 h-5 w-5 text-white"/>
                                                                Checkout
                                                            </button>
                                                        </div>
                                                    </div>  
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="w-full h-full container rounded-md mx-auto bg-white shadow-md">
                                        <h1 className="font-semibold flex items-center justify-center w-full h-full text-gray-300 text-3xl">You Shopping cart is currently empty!</h1>
                                    </div>
                                }
                            </div>
                        </div>
                        <div  className="bg-white p-5 rounded-md shadow-md">
                            <h1 className="text-gray-800 md:text-xl lg:text-3xl font-bold mb-5">Latest Order</h1>
                            <div className="mt-5">
                                <div className="w-full">
                                    {isLoadingOrders || error
                                        ?
                                        <Spinner className="w-full"/>
                                            :
                                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-1">
                                            {ordersData.data.length!=0 && ordersData.data[ordersData.data.length-1].orderDetails.products.map((product,index) => (
                                            <div key={index}>
                                                <div className="bg-gray-100 flex flex-col w-full shadow-sm rounded-md">
                                                <Image src={product.productImage.url} width={400} height={400} objectFit="cover" className="rounded-t-md"/>
                                                <div className="pt-2 px-2">
                                                    <p className="md:text-sm lg:text-md text-gray-800">
                                                    {product.productName}
                                                    </p>
                                                    <p className="md:text-xs lg:text-sm text-gray-400">
                                                    By {product.productSize}
                                                    </p>
                                                    <div className="flex py-2 items-center gap-2">
                                                        <div className="bg-red-500 rounded-2xl md:w-2 md:h-2 lg:w-4 lg:h-4"></div>
                                                        <p className="md:text-xs lg:text-sm text-gray-800 ">M</p>
                                                        <p className="md:text-xs lg:text-sm text-gray-800">
                                                            {product.productPrice}<span className="text-blue-500 font-bold">$</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                    }
                                </div>
                            </div>
                            <div className="mt-5">
                                <div className="flex flex-col w-full">
                                    <div className="grid grid-cols-8 text-center items-center gap-2">
                                        <span className="bg-gray-800 p-2 mr-2 rounded-md col-span-2 w-full h-full">
                                            {ordersData && ordersData.data.length!=0 && <p className="text-gray-400 flex items-center justify-center font-bold md:text-xs lg:text-sm ">{ordersData.data[ordersData.data.length-1].createdAt.substring(0,10)}</p>}
                                            {ordersData && ordersData.data.length!=0 && <p className="font-bold md:text-xl lg:text-2xl text-white">{parseFloat(ordersData.data[ordersData.data.length-1].orderDetails.totalPrice*0.01).toFixed(2)}<span className="text-blue-500">$</span></p>}
                                        </span>
                                        <span className="bg-gray-800 p-2 rounded-md col-span-2 w-full h-full">{ordersData && ordersData.data.length!=0 && ordersData.data[ordersData.data.length-1].orderStatus=="Pending"?<span className="flex flex-col items-center justify-center"><p className="text-gray-400 flex items-center justify-start font-bold md:text-xs lg:text-sm ">Getting Wrapped</p><GiftIcon className="h-10 w-10 text-yellow-500 " /></span>:<span className="flex flex-col items-center justify-center"><p className="text-gray-400 flex items-center justify-start font-bold md:text-xs lg:text-sm ">Shipped</p><TruckIcon className="md:h-8 md:w-8 lg:h-10 lg:w-10 text-green-500 " /></span>}</span>
                                    </div>  
                                </div>
                            </div>
                        </div>
                        <div className=" rounded-md shadow-md bg-white my-5">
                                <h1 className="text-blue-500 bg-gray-800 rounded-t-md text-center p-5 md:text-xl lg:text-3xl font-bold ">Saved Orders</h1>
                                <div className="">
                                    {isLoadingSavedOrders || errorSavedOrders?
                                        <Spinner className="w-full"/>
                                            :
                                        <div  className="grid md:grid-cols-2 lg:grid-cols-4 overflow-y-auto scrollbar max-h-152">
                                        {savedOrders && savedOrders.map((order,idx)=>(
                                            <div key={idx}>
                                            <div  className="bg-gray-100 m-2 text-gray-800 flex flex-col justify-between p-5 rounded-md">
                                                <div>
                                                    
                                                    <div className="p-5 border-b border-gray-600">
                                                        {order.orderDetails.products.map((product,idx)=>
                                                            <div key={idx}>
                                                                <div>
                                                                    <div className="text-gray-800">
                                                                        <ul className="list-disc pl-5 ">
                                                                            <li>
                                                                                <span className="flex flex-col mb-1 ">
                                                                                    <p className="  p-1 mr-1 md:text-sm lg:text-md font-semibold">
                                                                                        {product.productName}  
                                                                                    </p>
                                                                                    <div className="flex p-2 gap-2 md:text-xs lg:text-sm bg-white rounded-md items-center">
                                                                                        <div className="bg-red-500 rounded-2xl md:w-2 md:h-2 lg:w-3 lg:h-3"></div>
                                                                                        <p className="">
                                                                                            &nbsp;{product.productSize}  
                                                                                        </p>
                                                                                        <p className="">
                                                                                            &nbsp;x{product.productQuantity} 
                                                                                        </p>
                                                                                    </div>
                                                                                </span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='flex flex-col w-full px-5 pt-5 text-right'>
                                                    <p className="font-bold text-gray-800 md:text-xl lg:text-3xl">{order.orderDetails.totalPrice}<span className="text-blue-500">$</span></p>
                                                    <p className="text-gray-400 text-xs">{order.createdAt.substring(0,10)}</p>
                                                </div>
                                                <div className="grid grid-cols-6 mt-5">
                                                    <div className="col-span-2"></div>
                                                    <button onClick={()=>createCheckOutSession(order.orderDetails.products.map((item)=>({name:item.productName,imageURL:item.productImage,price:item.productPrice,quantity:item.productQuantity})))} className="inline-flex m-1 justify-center rounded-md border border-gray-200 bg-white  py-2 items-center text-md font-medium text-gray-400  hover:text-green-500 hover:border-green-500  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300 delay-10"
                                                        >
                                                        <CreditCardIcon className="h-5 w-5 "/>
                                                    </button>
                                                    <button onClick={()=>handleOrderDelete(order)} className="inline-flex m-1 justify-center rounded-md border border-gray-200 bg-white  py-2 items-center text-md font-medium text-gray-400  hover:text-red-400 hover:border-red-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300 delay-10"
                                                        >
                                                        <TrashIcon className=" h-5 w-5"/>
                                                    </button>
                                                </div>
                                            </div>
                                            </div>
                                        ))}
                                    </div>
                                    }
                                </div>
                            </div>
                    </div>
                </div>

    )
}
