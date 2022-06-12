import {useState,Fragment} from "react";
import {Menu, Transition,Dialog } from '@headlessui/react'
import ReactStars from "react-rating-stars-component";


export default function Review({user,isOpen,setIsOpen,setProduct,product,orderId}){
    const [rating,setRating]=useState(3);
    const [review,setReview]=useState("");
    const ratingConfig = {
        size: 32,
        count: 5,
        isHalf: true,
        value: 3,
        color: "#9ca3af",
        activeColor: "#3482F6",
    };

    async function handleReview(){
        console.log(rating);
        console.log(product);
        const res = await fetch('/api/manage-store/product-review',{
            body:JSON.stringify({
                productId:product.productId,
                productName:product.productName,
                userEmail:user.email,
                userName:user.name,
                orderId,
                rating,
                review
            }),
            method:'PUT'
        });
    }

    return(
        <div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={()=>{
                    setProduct("")
                    setIsOpen(false)
                    }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="hidden fixed inset-0 bg-gray-700 bg-opacity-0 transition-opacity backdrop-brightness-50 md:block" />
                    </Transition.Child>

                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex min-h-screen  w-screen text-center md:block md:px-2 lg:px-4" style={{ fontSize: 0 }}>
                          {/* This element is to trick the browser into centering the modal contents. */}
                          <span className="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">
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
                                  <Dialog.Panel className="flex text-base text-left transform transition shadow-2xl md:inline-block md:max-w-2xl md:mx-4 md:align-middle lg:max-w-7xl">
                                    <div className="flex flex-col px-5 py-16 bg-white rounded-md shadow-2xl">
                                        <h1 className="text-2xl font-bold text-center">{product.productName}</h1>
                                        <div className="flex flex-col mt-12 gap-5">
                                          <div className="flex justify-center items-center h-10">
                                            <ReactStars {...ratingConfig} onChange={(newValue)=>setRating(newValue)}/>
                                          </div>
                                          <h1 className="text-xl text-left">Tell us what you think !</h1>
                                          <textarea name="review" type="text" placeholder="Your words..." className="w-full resize-none focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500 w-96 h-36 p-2 border-gray-200 border rounded-sm"
                                            onChange={(e)=>setReview(e.target.value)}
                                          />
                                          <div className="flex gap-1">
                                            <button className="w-full py-2 bg-blue-500 hover:bg-blue-400 duration-300 delay-10 text-white font-semibold text-md rounded-md mt-5"  onClick={handleReview}>Submit</button>
                                            <button className="w-full py-2 border border-gray-200 bg-gray-100 hover:bg-white duration-300 delay-10 text-gray-800 font-semibold text-mdd rounded-md mt-5"  onClick={()=>{setProduct("");setIsOpen(false);}}>Maybe Later</button>
                                          </div>
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