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
            <div>
                <div className="mt-5">
                    <div className="w-full">
                        {isLoadingOrders || error
                            ?
                            <Spinner className="w-full"/>
                                :
                            <div>
                                {ordersData.data.map((order,index)=>(
                                <div className="bg-white p-5 rounded-md shadow-md m-2" key={index}>
                                    <div className="grid grid-cols-6 gap-1">
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
                                                    <p className="text-md text-gray-800">
                                                    {product.productName}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                    By {product.productSize}
                                                    </p>
                                                    <div className="flex py-2 items-center gap-2">
                                                        <div className="bg-red-500 rounded-2xl w-4 h-4"></div>
                                                        <p className="text-sm text-gray-800 ">M</p>
                                                        <p className="text-sm text-gray-800">
                                                            {product.productPrice}<span className="text-blue-500 font-bold">$</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ))}
                                </div>
                                <div className="my-5">
                                    <div className="flex flex-col w-full">
                                        <div className="grid grid-cols-10 text-center">
                                            <span className="bg-gray-800 p-1 mr-2 rounded-md">
                                                {<p className="text-gray-400 flex items-center justify-center font-bold text-sm ">{order.createdAt.substring(0,10)}</p>}
                                                {<p className="font-bold text-2xl text-white">{parseFloat(order.orderDetails.totalPrice*0.01).toFixed(2)}<span className="text-blue-500">$</span></p>}
                                            </span>
                                            <span className="bg-gray-800 p-1 rounded-md">{order.orderStatus=="Pending"?<span className="flex flex-col items-center justify-center"><p className="text-gray-400 flex items-center justify-start font-bold text-sm ">Getting Wrapped</p><GiftIcon className="h-8 w-8 text-yellow-500 " /></span>:<span className="flex flex-col items-center justify-center"><p className="text-gray-400 flex items-center justify-start font-bold text-sm ">Delivered</p><TruckIcon className="h-8 w-8 text-green-500 " /></span>}</span>
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
            {isOpen && product && orderId && <Review isOpen={isOpen} user={user} setIsOpen={setIsOpen} setProduct={setProduct} product={productSelected} orderId={orderId}/>}   
        </div>
    )
}