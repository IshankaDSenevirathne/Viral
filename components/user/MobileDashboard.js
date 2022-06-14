import Image from "next/image"
    import {getUserOrdersData,getSavedOrdersData,getFavouriteItemData} from "../../lib/fetchDataSWR"
import {TruckIcon,TrashIcon,GiftIcon,ShoppingCartIcon,ShoppingBagIcon,CreditCardIcon, CogIcon} from '@heroicons/react/outline'
import { useEffect,useState,useContext } from "react";
import {Store} from "../../lib/Store";
import Spinner from "../../components/Spinner"
import { loadStripe } from '@stripe/stripe-js';
import cookie from "js-cookie"
import axios from "axios";
import ProductCard from "../ProductCard";

export default function MobileDashboard({user,cart}){
    const [totalPrice,setTotalPrice]=useState(0);
    const [savedOrders,setSavedOrders]=useState("");
    const {state,dispatch} = useContext(Store);
    const {data:ordersData,isLoading:isLoadingOrders,error} = getUserOrdersData({userEmail:user.email});
    const {data:savedUserOrders,isLoading:isLoadingSavedOrders,errorSavedOrders} = getSavedOrdersData({userEmail:user.email});
    const {data:favourites,isLoading:isLoadingfavourites,errorfavourites} = getFavouriteItemData({userEmail:user.email});
    const [liveCart,setLiveCart]= useState([])
    const publishableKey = `${process.env.STRIPE_PUBLIC_KEY}`;
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

    return(
        <div className="">
           
            <div className="m-2">
                <div className="w-full bg-gray-100 rounded-md ">
                    <div  className="shadow-sm rounded-md bg-white">
                        {(liveCart && liveCart.length!=0)?
                            <div  className="flex flex-col">
                                <div className="border-b">
                                    <p className="flex  items-center text-gray-800 text-left text-xl lg:text-3xl font-bold p-5"><ShoppingCartIcon  className="text-green-500 mr-3 w-8 h-8"/>Your Cart</p>
                                </div>
                                <div className="flex flex-col">
                                    <div className=" rounded-md p-2 ">
                                        <div className="flex flex-col gap-2">
                                            {liveCart.map((product,index) => (
                                                <div key={index}>
                                                    <div className="bg-gray-100 flex w-full h-full shadow-sm border">
                                                        <div className="bg-black">
                                                            <Image src={product.imageURL} width={200} height={200} objectFit="cover" className=""/>
                                                        </div>
                                                        <div className="py-1 px-2 w-full h-full flex flex-col justify-around">
                                                                <div>
                                                                    <div>
                                                                    <p className="text-sm font-bold text-gray-800">
                                                                        {product.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400">
                                                                        By {product.company}
                                                                    </p>
                                                                    <div className="flex py-2 items-center gap-2">
                                                                        <div className="bg-red-500 rounded-2xl h-2 w-2"></div>
                                                                        <p className="text-xs text-gray-800 ">M</p>
                                                                        <p className="text-xs text-gray-800">
                                                                            {product.price}<span className="text-blue-500 font-bold">$</span>
                                                                        </p>
                                                                        <p className="text-xs text-gray-800">
                                                                            x{product.quantity}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="mb-1.5 flex justify-end">
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
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="my-5 border-t grow-0 rounded-b-md">
                                        <div className="w-full">
                                            <div className="flex flex-col items-center justify-between text-center">
                                                <p className="font-bold text-lg text-gray-800 py-2">{parseFloat(totalPrice).toFixed(2)}<span className="text-blue-500 font-bold">$</span></p>
                                                <div className="flex">
                                                    <button
                                                        onClick={handleEmptyCart}
                                                        type="button"
                                                        className="inline-flex m-1 px-2 justify-center rounded-md border border-gray-200 bg-gray-100 font-semibold py-2 items-center text-sm  text-gray-800 hover:bg-white  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300 delay-10"
                                                        >
                                                        <TrashIcon className=" h-4 w-4 mr-1 text-gray-800"/>
                                                        Empty Cart
                                                    </button>
                                                    
                                                    <button
                                                        onClick={()=>handleSaveOrder(liveCart)}
                                                        type="button"
                                                        className="inline-flex m-1 px-2 justify-center rounded-md bg-blue-500  py-2 items-center text-sm font-semibold text-white hover:bg-blue-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300 delay-10"
                                                        >
                                                        <ShoppingBagIcon className=" h-4 w-4 mr-1 text-white"/>
                                                        Save Order
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="inline-flex m-1 px-2 justify-center rounded-md border border-transparent bg-green-500 font-semibold py-2 items-center text-sm  text-white hover:bg-green-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-300 delay-10"
                                                        onClick={()=>createCheckOutSession(liveCart)}
                                                        >
                                                        <CreditCardIcon className=" h-4 w-4 mr-1 text-white"/>
                                                        Checkout
                                                    </button>
                                                </div>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="w-full h-full container rounded-md mx-auto bg-white shadow-md px-10 py-5">
                                <h1 className="font-semibold flex items-center justify-center w-full h-full text-gray-300 text-xl">You Shopping cart is currently empty!</h1>
                                <div className='flex justify-start mt-5'>
                                    <button
                                        type="button"
                                        className="inline-flex px-5 justify-center rounded-md border border-transparent bg-blue-500  py-1 items-center text-sm font-medium text-white hover:bg-blue-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-100 delay-10"
                                    >
                                            <ShoppingCartIcon className="text-white h-5 w-5"/>
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="bg-white m-2 rounded-md shadow-md">
                <div className=" rounded-t-md border-b">
                    <h1 className="text-gray-800 text-left text-xl lg:text-3xl font-bold p-5">Favourites</h1>
                </div>
                <div className="p-2">
                    {isLoadingfavourites ? <Spinner/>:""}
                    <div className="grid grid-cols-2 gap-1">
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
            <div className="bg-white m-2 rounded-md shadow-md">
                <div className=" rounded-t-md border-b">
                    <h1 className="text-gray-800 text-left text-xl lg:text-3xl font-bold p-5">Latest Order</h1>
                </div>
                <div className="mt-5">
                        <div className="w-full">
                            {isLoadingOrders || error
                                ?
                                <Spinner className="w-full"/>
                                    :
                                    <div className="flex flex-col gap-1 p-2 w-full">
                                    {ordersData.data.length!=0 && ordersData.data[ordersData.data.length-1].orderDetails.products.map((product,index) => (
                                    <div key={index}>
                                        <div className="bg-gray-100 grid grid-cols-6 w-full justify-between shadow-sm rounded-md">
                                            <div className="pt-2 px-2 col-span-4 flex flex-col justify-center">
                                                <p className="text-sm font-bold text-gray-800">
                                                {product.productName}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                By {product.productSize}
                                                </p>
                                                <div className="flex py-2 items-center gap-2">
                                                    <div className="bg-red-500 rounded-2xl w-2 h-2"></div>
                                                    <p className="text-xs text-gray-800 ">M</p>
                                                    <p className="text-xs text-gray-800">
                                                        {product.productPrice}<span className="text-blue-500 font-bold">$</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <Image src={product.productImage.url} width={200} height={200} objectFit="cover" className="rounded-r-md"/>
                                            </div>
                                        </div>
                                </div>
                            ))}
                            </div>
                            }
                    </div>
                </div>
                <div className="p-2">
                    <div className="flex flex-col w-full">
                        <div className="grid grid-cols-8 text-center items-center gap-2">
                            <span className="bg-gray-800 p-1 mr-2 rounded-md col-span-2 w-full h-full">
                                {ordersData && ordersData.data.length!=0 && <p className="text-gray-400 flex items-center justify-center font-bold text-xs ">{ordersData.data[ordersData.data.length-1].createdAt.substring(0,10)}</p>}
                                {ordersData && ordersData.data.length!=0 && <p className="font-bold text-lg text-white">{parseFloat(ordersData.data[ordersData.data.length-1].orderDetails.totalPrice*0.01).toFixed(2)}<span className="text-blue-500">$</span></p>}
                            </span>
                            <span className="bg-gray-800 p-1 rounded-md col-span-2 w-full h-full">{ordersData && ordersData.data.length!=0 && ordersData.data[ordersData.data.length-1].orderStatus=="Pending"?<span className="flex flex-col items-center justify-center"><p className="text-gray-400 flex items-center justify-start font-bold text-xs">Getting Wrapped</p><GiftIcon className="h-8 w-8 text-yellow-500 " /></span>:<span className="flex flex-col items-center justify-center"><p className="text-gray-400 flex items-center justify-start font-bold text-xs">Shipped</p><TruckIcon className="h-8 w-8  text-green-500 " /></span>}</span>
                        </div>  
                    </div>
                </div>
            </div>
        </div>
    )
}