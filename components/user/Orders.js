import {getUserOrdersData,} from "../../lib/fetchDataSWR"
import {TruckIcon,GiftIcon} from '@heroicons/react/outline'
import {StarIcon as OutlinedStarIcon} from '@heroicons/react/outline'
import {StarIcon} from '@heroicons/react/solid'
import Image from "next/image"
import Spinner from "../Spinner"
import Review from "./Review"
import {useState} from "react";

export default function Orders({user}){
    const [isOpen,setIsOpen]=useState(false)
    const [productSelected,setProduct]=useState("");
    const [orderId,setOrderId]=useState("");
    const {data:ordersData,isLoading:isLoadingOrders,error} = getUserOrdersData({userEmail:user.email});
    return(
        <div className="">
            <div className="md:hidden">
            <div className="">
                <div className="w-full">
                        {isLoadingOrders || error
                            ?
                            <Spinner className="w-full"/>
                                :
                            <div>
                                {ordersData.data.map((order,index)=>(
                                <div className="bg-white p-2 rounded-md shadow-md m-2" key={index}>
                                    <div className="flex flex-col">
                                        {order.orderDetails.products.map((product,index) => (
                                            <div className="shadow-sm border mb-2" key={index}>
                                                <div className="bg-gray-100 flex w-full h-full">
                                                    {order.orderStatus=="Approved"? 
                                                    <div className="">
                                                        <Image src={product.productImage.url} width={200} height={200} objectFit="cover"/>
                                                        
                                                    </div>
                                                        :
                                                        <div>
                                                        <Image src={product.productImage.url} width={200} height={200} objectFit="cover"/>
                                                    </div>
                                                    }
                                                <div className="pt-2 px-2 w-full flex flex-col justify-between">
                                                    <div>
                                                    <p className="text-sm font-bold text-gray-800">
                                                    {product.productName}
                                                    </p>
                                                    <p className="text-xs lg:text-sm text-gray-400">
                                                    By {product.productSize}
                                                    </p>
                                                    <div className="flex py-2 items-center gap-2">
                                                        <div className="bg-red-500 rounded-2xl w-2 h-2"></div>
                                                        <p className="text-xs lg:text-sm text-gray-800 ">M</p>
                                                        <p className="text-xs lg:text-sm text-gray-800">
                                                            {product.productPrice}<span className="text-blue-500 font-bold">$</span>
                                                        </p>
                                                        <p className="text-xs lg:text-sm text-gray-800 ">x{product.productQuantity}</p>
                                                    </div>
                                                    </div>
                                                    <div className="flex justify-end pb-2 pr-2">
                                                        {order.orderStatus=="Approved" && product.reviewDetails.review && product.reviewDetails.rating? 
                                                            <div className="flex border border-green-500 rounded-sm w-fit items-center text-xs p-1 text-green-500"><StarIcon className="h-5 w-5 text-green-500"/></div>
                                                                :
                                                            <button className="flex border border-blue-500 rounded-sm w-fit items-center text-xs p-1 text-green-500" onClick={()=>{
                                                                setProduct(product);
                                                                setOrderId(order.orderId);
                                                                setIsOpen(true);
                                                            }}><OutlinedStarIcon className="h-5 w-5 text-blue-500"/></button>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ))}
                                </div>
                                <div className="p-2">
                                        <div className="flex flex-col w-full">
                                            <div className="grid grid-cols-8 text-center items-center gap-2">
                                                <span className="border p-1 mr-2 rounded-md col-span-2 w-full h-full">
                                                    {ordersData && ordersData.data.length!=0 && <p className="text-gray-400 flex items-center justify-center text-xs ">{ordersData.data[ordersData.data.length-1].createdAt.substring(0,10)}</p>}
                                                    {ordersData && ordersData.data.length!=0 && <p className="text-gray-800 font-bold text-lg text-white">{parseFloat(ordersData.data[ordersData.data.length-1].orderDetails.totalPrice*0.01).toFixed(2)}<span className="text-blue-500">$</span></p>}
                                                </span>
                                                <span className="border p-1 rounded-md col-span-2 w-full h-full">{ordersData && ordersData.data.length!=0 && ordersData.data[ordersData.data.length-1].orderStatus=="Pending"?<span className="flex flex-col items-center justify-center"><p className="text-gray-400 flex items-center justify-start font-bold text-xs">Getting Wrapped</p><GiftIcon className="h-8 w-8 text-yellow-500 " /></span>:<span className="flex flex-col items-center justify-center"><p className="text-gray-400 flex items-center justify-start font-bold text-xs">Shipped</p><TruckIcon className="h-8 w-8  text-green-500 " /></span>}</span>
                                            </div>  
                                        </div>
                                    </div>
                                </div>
                                    )
                                )
                            }
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="hidden md:block">
                <div className="mt-5">
                    <div className="w-full">
                        {isLoadingOrders || error
                            ?
                            <Spinner className="w-full"/>
                                :
                            <div>
                                {ordersData.data.map((order,index)=>(
                                <div className="bg-white p-5 rounded-md shadow-md m-2" key={index}>
                                    <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1">
                                        {order.orderDetails.products.map((product,index) => (
                                            <div className="group hover:shadow-md hover:shadow-gray-200 duration-300 delay-10 rounded-md" key={index}>
                                                <div className="bg-gray-100 flex flex-col w-full shadow-sm rounded-md">
                                                    {order.orderStatus=="Approved"? 
                                                    <div className="relative">
                                                        <Image src={product.productImage.url} width={400} height={400} objectFit="cover" className="rounded-t-md"/>
                                                        {product.reviewDetails.review && product.reviewDetails.rating? 
                                                        <div className="opacity-0 flex group-hover:opacity-100 duration-300 delay-10 absolute bottom-0 right-0 bg-gray-800 p-1 mb-1.5"><StarIcon className="h-5 w-5 text-green-500 bg-gray-800"/></div>
                                                            :
                                                        <button className="opacity-0 flex group-hover:opacity-100 duration-300 delay-10 absolute bottom-0 right-0 bg-gray-800 p-1 mb-1.5" onClick={()=>{
                                                            setProduct(product);
                                                            setOrderId(order.orderId);
                                                            setIsOpen(true);
                                                        }}><OutlinedStarIcon className="h-5 w-5 text-blue-500"/></button>
                                                    }
                                                    </div>
                                                        :
                                                        <div>
                                                        <Image src={product.productImage.url} width={400} height={400} objectFit="cover" className="rounded-t-md"/>
                                                    </div>
                                                    }
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
                                    )
                                )
                            }
                            </div>
                        }
                    </div>
                    
                </div>
                
            </div>
            {ordersData && ordersData.data.length==0 && <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col w-fit h-fit items-center justify-center p-10 rounded-md border border-gray-200">
                    <h1 className="text-xl lg:text-3xl text-gray-400">You have not ordered anything yet!</h1>
                </div>
                </div>}
            {isOpen && product && orderId && <Review isOpen={isOpen} user={user} setIsOpen={setIsOpen} setProduct={setProduct} product={productSelected} orderId={orderId}/>}   
        </div>
    )
}