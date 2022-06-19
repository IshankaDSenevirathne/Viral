import {Tab } from '@headlessui/react'
import {useState} from "react"
import {UserIcon,PhoneIcon,AtSymbolIcon,ReplyIcon} from "@heroicons/react/solid"
import {displayAdminOrdersData} from "../../lib/fetchDataSWR"

function classNames(...classes){
    return classes.filter(Boolean).join(' ')
}

const categories = [{name:"New Orders",value:"Pending"},{name:"Completed Orders",value:"Completed"},{name:"Refunded Orders",value:"Refunded"}];

export function OrdersData(){

    async function handleApprove(id){
        const res = await fetch("/api/manage-store/manage-orders",{
            body:JSON.stringify({
                id,
                orderStatus:"Shipping"
            }),
            method:'PUT'
        });
        console.log(res.json())
    }
    async function handleRefund(id){
        const res = await fetch("/api/manage-store/manage-orders",{
            body:JSON.stringify({
                id,
                orderStatus:"Refunded"
            }),
            method:'PUT'
        });
        console.log(res.json()) 
    }
    async function handleUndo(id){
        const res = await fetch("/api/manage-store/manage-orders",{
            body:JSON.stringify({
                id,
                orderStatus:"Pending"
            }),
            method:'PUT'
        });
        console.log(res.json()) 
    }
    const [categorySelected,setCategorySelected]= useState(categories[0])
    const {data:ordersData,isLoading,error} = displayAdminOrdersData({orderType:categorySelected.value});
    return (
        <div className="w-full h-screen z-1 px-2 sm:px-0 className">
            <div className="flex flex-col h-full w-full justify-between">
                <div>
                    <Tab.Group onChange={(tab)=>{
                    setCategorySelected(categories[tab].name);
                    }}>
                        <Tab.List className="flex border-b">
                        {categories.map((category,index) => (
                            <Tab
                            key={index}
                            className={({ selected }) =>
                                classNames(
                                'w-full  py-2.5 text-md font-medium leading-5',
                                selected
                                    ? 'bg-blue-500 text-white focus:outline-none'
                                    : 'text-gray-700 hover:bg-gray-100 '
                                )
                            }
                            >
                            {category.name}
                            </Tab>
                        ))}
                        </Tab.List>
                        <Tab.Panels className="">
                            {categories.map((category,index)=>(
                                isLoading ? 
                                <Tab.Panel key={index}>Loading please wait ...</Tab.Panel>
                                :
                                category.value =="Pending"?
                                    <Tab.Panel key={index} className='h-full'>
                                        <div className="flex flex-col">
                                            <div className="h-fit">
                                            <div className="bg-white p-8 rounded-md w-full">
                                                    <div>
                                                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                                            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                                                <table className="min-w-full leading-normal">
                                                                    <thead>
                                                                        <tr>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Order
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Date of Order
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Client Information
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Shipping Address
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Start Shipping
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className= " text-gray-500 text-sm font-semibold ">
                                                                        {ordersData.data.map((order,idx)=>(
                                                                            <tr key={idx}>
                                                                                <td className="border-b border-gray-200  p-5">
                                                                                    <div className="flex items-center">
                                                                                        <ul className="list-disc">
                                                                                            {order.orderDetails.products.map((product,index)=>(
                                                                                                <li key={index}>
                                                                                                    <span className="flex mb-1">
                                                                                                        <p className=" whitespace-no-wrap bg-blue-100 text-gray-800 rounded-md p-1 mr-1">
                                                                                                            {product.productName}  
                                                                                                        </p>
                                                                                                        <div className="grid grid-cols-4 border rounded-md border-gray-300 ">
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1 ">
                                                                                                                Type : &nbsp;Shoes 
                                                                                                            </p>
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1">
                                                                                                                Size : &nbsp;{product.productSize}  
                                                                                                            </p>
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1 ">
                                                                                                                Qty : &nbsp;{product.productQuantity} 
                                                                                                            </p>
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1">
                                                                                                                Color : &nbsp;{product.productColor}  
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </span>
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="py-5 border-b border-gray-200 bg-white ">
                                                                                    <p className="whitespace-no-wrap">
                                                                                        {order.createdAt.substring(0,10)}
                                                                                    </p>
                                                                                </td>
                                                                                <td className="py-5 border-b border-gray-200 bg-white ">
                                                                                    <div className="grid grid-rows-3 gap-1">
                                                                                        <p className="flex items-center whitespace-no-wrap">
                                                                                            <UserIcon className="h-4 w-4 text-blue-500"/> : &nbsp;{order.clientName}
                                                                                        </p>
                                                                                        <p className="flex items-center whitespace-no-wrap">
                                                                                            <AtSymbolIcon className="h-4 w-4 text-red-500"/> : &nbsp;{order.emailAddress}  
                                                                                        </p>
                                                                                        <p className="flex items-center whitespace-no-wrap">
                                                                                            <PhoneIcon className="h-4 w-4 text-green-500"/> : &nbsp;{order.phoneNumber}  
                                                                                        </p>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="border-b border-gray-200 bg-white ">
                                                                                    <span
                                                                                        className="relative inline-block py-1 leading-tight">
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.line1}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.line2}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.city}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.postalcode}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.state}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.country}  
                                                                                        </p>
                                                                                    </span>
                                                                                </td>
                                                                                <td className="border-b border-gray-200 bg-white ">
                                                                                    <div className= "flex flex-col p-2">
                                                                                        <button onClick={()=>handleApprove(order._id)} className=" font-semibold bg-gray-200 p-2 rounded-sm hover:shadow-md hover:bg-green-400 hover:text-white duration-300 delay-10">
                                                                                                Ship
                                                                                        </button>
                                                                                        <button onClick={()=>handleRefund(order._id)} className=" font-semibold bg-gray-200 rounded-sm hover:shadow-md mt-1 p-2 hover:bg-red-400 hover:text-white duration-300 delay-10">
                                                                                                Refund
                                                                                        </button>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                                <div
                                                                    className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                                                                    <span className=" xs: text-gray-900">
                                                                        Showing 1 to 4 of 50 Entries
                                                                    </span>
                                                                    <div className="inline-flex mt-2 xs:mt-0">
                                                                        <button
                                                                            className=" text-white transition duration-150 hover:bg-blue-500 bg-blue-600 font-semibold py-2 px-4 rounded-sm">
                                                                            Prev
                                                                        </button>
                                                                        &nbsp; &nbsp;
                                                                        <button
                                                                            className=" text-white transition duration-150 hover:bg-blue-500 bg-blue-600 font-semibold py-2 px-4 rounded-sm">
                                                                            Next
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Panel>
                                    :
                                category.value =="Completed"?
                                    <Tab.Panel key={index} className='h-full'>
                                        <div className="flex flex-col">
                                            <div className="h-fit">
                                            <div className="bg-white p-8 rounded-md w-full">
                                                    <div>
                                                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                                            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                                                <table className="min-w-full leading-normal">
                                                                    <thead>
                                                                        <tr>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Order
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Date of Order
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Client Information
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Shipping Address
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className= " text-gray-500 text-sm font-semibold ">
                                                                        {ordersData.data.map((order,idx)=>(
                                                                            <tr key={idx}>
                                                                                <td className="border-b border-gray-200  p-5">
                                                                                    <div className="flex items-center">
                                                                                        <ul className="list-disc">
                                                                                            {order.orderDetails.products.map((product,index)=>(
                                                                                                <li key={index}>
                                                                                                    <span className="flex mb-1">
                                                                                                        <p className=" whitespace-no-wrap bg-blue-100 text-gray-800 rounded-md p-1 mr-1">
                                                                                                            {product.productName}  
                                                                                                        </p>
                                                                                                        <div className="grid grid-cols-4 border rounded-md border-gray-300 ">
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1 ">
                                                                                                                Type : &nbsp;Shoes 
                                                                                                            </p>
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1">
                                                                                                                Size : &nbsp;{product.productSize}  
                                                                                                            </p>
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1 ">
                                                                                                                Qty : &nbsp;{product.productQuantity} 
                                                                                                            </p>
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1">
                                                                                                                Color : &nbsp;{product.productColor}  
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </span>
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="py-5 border-b border-gray-200 bg-white ">
                                                                                    <p className="whitespace-no-wrap">
                                                                                        {order.createdAt.substring(0,10)}
                                                                                    </p>
                                                                                </td>
                                                                                <td className="py-5 border-b border-gray-200 bg-white ">
                                                                                    <div className="grid grid-rows-3 gap-1">
                                                                                        <p className="flex items-center whitespace-no-wrap">
                                                                                            <UserIcon className="h-4 w-4 text-blue-500"/> : &nbsp;{order.clientName}
                                                                                        </p>
                                                                                        <p className="flex items-center whitespace-no-wrap">
                                                                                            <AtSymbolIcon className="h-4 w-4 text-red-500"/> : &nbsp;{order.emailAddress}  
                                                                                        </p>
                                                                                        <p className="flex items-center whitespace-no-wrap">
                                                                                            <PhoneIcon className="h-4 w-4 text-green-500"/> : &nbsp;{order.phoneNumber}  
                                                                                        </p>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="border-b border-gray-200 bg-white ">
                                                                                    <span
                                                                                        className="relative inline-block py-1 leading-tight">
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.line1}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.line2}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.city}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.postalcode}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.state}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.country}  
                                                                                        </p>
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                                <div
                                                                    className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                                                                    <span className=" xs: text-gray-900">
                                                                        Showing 1 to 4 of 50 Entries
                                                                    </span>
                                                                    <div className="inline-flex mt-2 xs:mt-0">
                                                                        <button
                                                                            className=" text-white transition duration-150 hover:bg-blue-500 bg-blue-600 font-semibold py-2 px-4 rounded-sm">
                                                                            Prev
                                                                        </button>
                                                                        &nbsp; &nbsp;
                                                                        <button
                                                                            className=" text-white transition duration-150 hover:bg-blue-500 bg-blue-600 font-semibold py-2 px-4 rounded-sm">
                                                                            Next
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Panel>
                                    :
                                    <Tab.Panel key={index} className='h-full'>
                                        <div className="flex flex-col">
                                            <div className="h-fit">
                                            <div className="bg-white p-8 rounded-md w-full">
                                                    <div>
                                                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                                            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                                                <table className="min-w-full leading-normal">
                                                                    <thead>
                                                                        <tr>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Order
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Date of Order
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Client Information
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Shipping Address
                                                                            </th>
                                                                            <th
                                                                                className="py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                                                Undo
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className= " text-gray-500 text-sm font-semibold ">
                                                                        {ordersData.data.map((order,idx)=>(
                                                                            <tr key={idx}>
                                                                                <td className="border-b border-gray-200  p-5">
                                                                                    <div className="flex items-center">
                                                                                        <ul className="list-disc">
                                                                                            {order.orderDetails.products.map((product,index)=>(
                                                                                                <li key={index}>
                                                                                                    <span className="flex mb-1">
                                                                                                        <p className=" whitespace-no-wrap bg-blue-100 text-gray-800 rounded-md p-1 mr-1">
                                                                                                            {product.productName}  
                                                                                                        </p>
                                                                                                        <div className="grid grid-cols-4 border rounded-md border-gray-300 ">
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1 ">
                                                                                                                Type : &nbsp;Shoes 
                                                                                                            </p>
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1">
                                                                                                                Size : &nbsp;{product.productSize}  
                                                                                                            </p>
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1 ">
                                                                                                                Qty : &nbsp;{product.productQuantity} 
                                                                                                            </p>
                                                                                                            <p className=" whitespace-no-wrap p-1 mr-1">
                                                                                                                Color : &nbsp;{product.productColor}  
                                                                                                            </p>
                                                                                                        </div>
                                                                                                    </span>
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="py-5 border-b border-gray-200 bg-white ">
                                                                                    <p className="whitespace-no-wrap">
                                                                                        {order.createdAt.substring(0,10)}
                                                                                    </p>
                                                                                </td>
                                                                                <td className="py-5 border-b border-gray-200 bg-white ">
                                                                                    <div className="grid grid-rows-3 gap-1">
                                                                                        <p className="flex items-center whitespace-no-wrap">
                                                                                            <UserIcon className="h-4 w-4 text-blue-500"/> : &nbsp;{order.clientName}
                                                                                        </p>
                                                                                        <p className="flex items-center whitespace-no-wrap">
                                                                                            <AtSymbolIcon className="h-4 w-4 text-red-500"/> : &nbsp;{order.emailAddress}  
                                                                                        </p>
                                                                                        <p className="flex items-center whitespace-no-wrap">
                                                                                            <PhoneIcon className="h-4 w-4 text-green-500"/> : &nbsp;{order.phoneNumber}  
                                                                                        </p>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="border-b border-gray-200 bg-white ">
                                                                                    <span
                                                                                        className="relative inline-block py-1 leading-tight">
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.line1}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.line2}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.city}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.postalcode}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.state}  
                                                                                        </p>
                                                                                        <p className=" whitespace-no-wrap">
                                                                                            {order.homeAddress.country}  
                                                                                        </p>
                                                                                    </span>
                                                                                </td>
                                                                                <td className="border-b border-gray-200 bg-white ">
                                                                                    <button onClick={()=>handleUndo(order._id)} className="font-semibold bg-gray-200 p-2 rounded-sm hover:shadow-md hover:bg-yellow-300 hover:text-white duration-200 delay-10">
                                                                                            <ReplyIcon className= "h-4 w-4"/>
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                                <div
                                                                    className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                                                                    <span className=" xs: text-gray-900">
                                                                        Showing 1 to 4 of 50 Entries
                                                                    </span>
                                                                    <div className="inline-flex mt-2 xs:mt-0">
                                                                        <button
                                                                            className=" text-white transition duration-150 hover:bg-blue-500 bg-blue-600 font-semibold py-2 px-4 rounded-sm">
                                                                            Prev
                                                                        </button>
                                                                        &nbsp; &nbsp;
                                                                        <button
                                                                            className=" text-white transition duration-150 hover:bg-blue-500 bg-blue-600 font-semibold py-2 px-4 rounded-sm">
                                                                            Next
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>

        </div>
    )
}