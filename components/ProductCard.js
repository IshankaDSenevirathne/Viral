import Image from "next/image"
import {useState,Fragment,useContext,useEffect} from "react"
import {Store} from "../lib/Store"
import {Dialog,Transition,RadioGroup } from '@headlessui/react'
import { AlertInfo } from "./Alert"
import cookie from "js-cookie";
import ReactStars from "react-rating-stars-component";
import { parseCookies } from 'nookies';

//hero icons
import {ShoppingBagIcon,BadgeCheckIcon,HeartIcon} from "@heroicons/react/outline"
import {HeartIcon as SolidHeartIcon} from "@heroicons/react/solid"

function classNames(...classes){
    return classes.filter(Boolean).join(' ')
}

export default function ProductCard({id,page,name,price,images,features,company,colors,sizes,favStatus,email,user,limits,layoutType,ratingDetails}) {
  const {state,dispatch} = useContext(Store);
  const [productFavStatus,setProductFavStatus]= useState(favStatus)
  const [isOpen,setIsOpen] = useState(false);
  const [imageSelected,setImageSelected] = useState(images[0].url)
  const [productColor,setProductColor]=useState(colors[0]);
  const [productSize,setProductSize]=useState(sizes[0]);
  const [productQuantity,setProductQuantity]=useState(1);
  const [loginAlertState,setLoginAlertState]=useState(false);

//   const [showImage,setShowImage] = useState(images)
    const cookies = parseCookies();
    const store_cookie = cookies?.cart
                ? JSON.parse(cookies.cart)
                : []
    useEffect(()=>{
        const newItem = state.cart.filter(({ id: id1 }) => !store_cookie.some(({ id: id2 }) => id2 === id1));
        let remainingItems;
        let updatedCart=[];
        if(newItem.length!=0){
            remainingItems = store_cookie.filter((item)=>item.id!=newItem.id);
            updatedCart=[...remainingItems,...newItem];
            cookie.set("cart",JSON.stringify(updatedCart));
            return;
        }if(state.cart.length!=0){
            let new_store_cookie = store_cookie
            for(const item of state.cart){
                const idx=new_store_cookie.findIndex((item_cookie)=>item_cookie.id==item.id)
                new_store_cookie[idx]=item
            }
            updatedCart=[...new_store_cookie]
            cookie.set("cart",JSON.stringify(updatedCart));
            return;
        }
    },[state])

  function handleAddToCart(){
    dispatch({type:"ADD_TO_CART",payload:{id,name,company,price,quantity:productQuantity,size:productSize,color:productColor,imageURL:images[0].url}});
    setIsOpen(false);
    return;
  }
  async function handleFavourite(){
    if(!user){
        setLoginAlertState(true);
        return;
    }
    const productImages = images.map((image)=>image.url)
    const res = await fetch('/api/manage-user/user-favourites',{
        body:JSON.stringify({
            emailAddress:email,
            productName:name,
            productPrice:price,
            productId:id,
            productImages,
            productCompany:company,
            productFeatures:features,
            productColors:colors,
            productSizes:sizes

        }),
        headers:{
            'Content-Type':'application/json',
        },
        method:'POST'
    });
    const {message} = await res.json();
    if(message=="favourited"){
        dispatch({type:"ADD_TO_FAVOURITES",payload:{ emailAddress:email,
            productName:name,
            productPrice:price,
            productId:id,
            productImages,
            productCompany:company,
            productFeatures:features,
            productColors:colors,
            productSizes:sizes}});
        setProductFavStatus(true);
    }
    if(message =="unfavourited"){
        dispatch({type:"REMOVE_FROM_FAVOURITES",payload:{ 
            productName:name,
           }});
        setProductFavStatus(false);
    }
    
  }
  return (
    <div>
        <div className="md:hidden">
            <div className={classNames(page=="new_trending"?"":"relative")}>
                <button onClick={handleFavourite} className="z-10 w-fit h-fit bg-white/30 backdrop-blur-sm absolute top-0 right-0">
                    {productFavStatus?
                        <SolidHeartIcon className="h-8 w-8 m-1 text-red-400 hover:text-white duration-300 delay-10" />
                            :
                        <HeartIcon className="h-8 w-8 m-1 text-white hover:text-red-400 duration-300 delay-10" />
                    }
                </button>
                <button onClick={()=>setIsOpen(true)}>
                    {layoutType=="fill"?
                    <Image src={images[1].url} layout="fill" objectFit="contain" className="w-full h-full"/>
                        :
                    <Image src={images[1].url} width={limits} height={limits} objectFit="contain" className="w-full h-full"/>
                    }
                </button>
                <div className={classNames(page=="new_trending"?" w-full delay-10 bg-white/30 backdrop-blur-sm absolute bottom-0 left-0 pt-2 pl-5 text-left text-black":"w-full bg-white/30 backdrop-blur-sm absolute bottom-0 mb-1.5 left-0 pt-2 pl-5 text-left text-black")}>
                    <p className="text-2xl font-bold">{name}</p>
                    <p className="text-xl font-bold">{price}<span className="text-blue-500">$</span></p>
                    {ratingDetails && <div className="flex items-center gap-2"><ReactStars 
                        size={20}
                        count= {5}
                        isHalf={true}
                        edit={false}
                        value= {ratingDetails.rating}
                        color="#9ca3af"
                        activeColor= "#3482F6"
                    /><p className="">({ratingDetails.reviewCount})</p></div>}
                </div>
            </div>
        </div>
        <div className="hidden md:block group">
            <div className={classNames(page=="new_trending"?"":"relative")}>
                <button onClick={handleFavourite} className="z-10 opacity-0 w-fit h-fit group-hover:opacity-100 group-hover:bg-white/30 delay-10 duration-300  group-hover:backdrop-blur-sm absolute top-0 right-0">
                    {productFavStatus?
                        <SolidHeartIcon className="h-8 w-8 m-1 text-red-400 hover:text-white duration-300 delay-10" />
                            :
                        <HeartIcon className="h-8 w-8 m-1 text-white hover:text-red-400 duration-300 delay-10" />
                    }
                </button>
                <button onClick={()=>setIsOpen(true)}>
                    {layoutType=="fill"?
                    <Image src={images[1].url} layout="fill" objectFit="cover" className="group-hover:scale-110 duration-200 delay-10"/>
                        :
                    <Image src={images[1].url} width={limits} height={limits} objectFit="cover" className="group-hover:scale-110 duration-200 delay-10"/>
                    }
                </button>
                <div className={classNames(page=="new_trending"?"opacity-0 w-full group-hover:opacity-100 delay-10 duration-300 group-hover:bg-white/30 group-hover:backdrop-blur-sm absolute bottom-0 left-0 pt-2 pl-5 text-left text-black":"opacity-0 w-full group-hover:opacity-100 delay-10 duration-300 group-hover:bg-white/30 group-hover:backdrop-blur-sm absolute bottom-0 mb-1.5 left-0 pt-2 pl-5 text-left text-black")}>
                    <p className="text-2xl font-bold">{name}</p>
                    <p className="text-xl font-bold">{price}<span className="text-blue-500">$</span></p>
                    {ratingDetails && <div className="flex items-center gap-2"><ReactStars 
                        size={20}
                        count= {5}
                        isHalf={true}
                        edit={false}
                        value= {ratingDetails.rating}
                        color="#9ca3af"
                        activeColor= "#3482F6"
                    /><p className="">({ratingDetails.reviewCount})</p></div>}
                </div>
            </div>
        </div>
        <div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={()=>setIsOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="hidden fixed inset-0 bg-gray-700 bg-opacity-50 transition-opacity md:block" />
                    </Transition.Child>

                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex min-h-screen  w-screen text-center lg:block lg:px-2 lg:px-4" style={{ fontSize: 0 }}>
                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden lg:inline-block lg:align-middle lg:h-screen" aria-hidden="true">
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
                                    <Dialog.Panel className="flex text-base text-left transform transition shadow-2xl lg:inline-block lg:align-middle lg:max-w-7xl">
                                        <div className="relative flex items-center rounded-xl bg-white overflow-hidden shadow-2xl w-screen lg:w-fit">
                                            <div className="lg:hidden pb-5">
                                                <div className="flex flex-col md:grid md:grid-cols-8">
                                                    <div className=" md:col-span-4">
                                                        <div className="md:px-5">
                                                            <Image src={imageSelected} height={2000} width={2000} objectFit="contain" className="rounded-t-md md:rounded-md"/>
                                                        </div>
                                                        <div className=" justify-center grid grid-cols-4 gap-0 pt-2 px-5">
                                                            <a onClick={()=>setImageSelected(images[0].url)} className="hover:scale-110 cursor-pointer z-0 hover:z-10 duration-300 delay-10">
                                                                <Image src={images[0].url} height={500} width={500} objectFit="cover" className="hover:rounded-md rounded-l-md"/>
                                                            </a>
                                                            <a onClick={()=>setImageSelected(images[1].url)} className="hover:scale-110 cursor-pointer z-0 hover:z-10 duration-300 delay-10">
                                                                <Image src={images[1].url} height={500} width={500} objectFit="cover" className="hover:rounded-md"/>
                                                            </a>
                                                            <a onClick={()=>setImageSelected(images[2].url)} className="hover:scale-110 cursor-pointer z-0 hover:z-10 duration-300 delay-10">
                                                                <Image src={images[2].url} height={500} width={500} objectFit="cover" className="hover:rounded-md"/>
                                                            </a> 
                                                            <a onClick={()=>setImageSelected(images[3].url)} className="hover:scale-110 cursor-pointer z-0 hover:z-10 duration-300 delay-10">
                                                                <Image src={images[3].url} height={500} width={500} objectFit="cover" className="hover:rounded-md rounded-r-md"/>
                                                            </a>
                                                        </div>
                                                    </div>
                                                <div className="flex flex-col justify-start pt-5 px-5 md:col-span-4 md:py-0">
                                                    <div className="grid grid-rows-8 gap-0">
                                                        <div className="row-span-3 ">
                                                            <Dialog.Title
                                                                as="h1"
                                                                className="text-2xl md:text-4xl font-bold  text-blue-500 " 
                                                            >
                                                                {name}
                                                            </Dialog.Title>
                                                            <h4 className="py-5 text-gray-400">
                                                                By : {company}
                                                            </h4>
                                                            <div>
                                                                <h4 className="text-xl text-gray-500 mb-2">
                                                                    Features
                                                                </h4>
                                                                <div className="text-sm text-gray-500 items-center grid grid-cols-2 grid-rows-3 gap-0 text-start">
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        Adjustable
                                                                    </p>
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        High Traction Shock Absorbing Outsoles
                                                                    </p>
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        Stable
                                                                    </p>
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        Lightweight 
                                                                    </p>
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        Durable
                                                                    </p>
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        Extra Padding and Cushioning
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row-span-4">
                                                        <div className="flex flex-col">
                                                            <h1 className="text-2xl md:text-3xl font-bold">
                                                                {price}<span className="text-blue-500">$</span>
                                                            </h1>
                                                            <div className="py-5">
                                                                <h1 className="text-xl text-gray-500">
                                                                    Color 
                                                                </h1>
                                                                <RadioGroup value={productColor} onChange={setProductColor} className="mt-4">
                                                                    <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                                                                        <div className="flex items-center space-x-3">
                                                                            {colors.map((color) => (
                                                                                <RadioGroup.Option
                                                                                key={color.name}
                                                                                value={color}
                                                                                className={({ active, checked }) =>
                                                                                    classNames(
                                                                                        "ring-gray-400",
                                                                                    active && checked ? 'ring ring-offset-1' : '',
                                                                                    !active && checked ? 'ring-2' : '',
                                                                                    '-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
                                                                                    )
                                                                                }
                                                                                >
                                                                                <RadioGroup.Label as="p" className="sr-only">
                                                                                    {color.name}
                                                                                </RadioGroup.Label>
                                                                                <span
                                                                                    aria-hidden="true"
                                                                                    className={classNames(
                                                                                    color.class,
                                                                                    'h-8 w-8 border border-black border-opacity-10 rounded-full'
                                                                                    )}
                                                                                />
                                                                                </RadioGroup.Option>
                                                                            ))}
                                                                        </div>
                                                                </RadioGroup>   
                                                            </div>
                                                            <div className="pb-5">
                                                                <h1 className="text-xl text-gray-500">
                                                                    Size 
                                                                </h1>
                                                                <RadioGroup value={productSize.size} onChange={setProductSize} className="mt-4">
                                                                    <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                                                                        <div className="grid grid-cols-4 gap-6">
                                                                            {sizes.map(({size,availability},index) => (
                                                                                <RadioGroup.Option
                                                                                key={index}
                                                                                value={size}
                                                                                disabled={!availability}
                                                                                className={({ active, }) =>
                                                                                    classNames(
                                                                                    availability
                                                                                        ? 'bg-white shadow-sm text-gray-900 cursor-pointer'
                                                                                        : 'bg-gray-50 text-gray-200 cursor-not-allowed',
                                                                                    active ? 'ring-2 ring-blue-500' : '',
                                                                                    'group relative border rounded-md  py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
                                                                                    )
                                                                                }
                                                                                >
                                                                                {({ active, checked }) => (
                                                                                    <>
                                                                                    <RadioGroup.Label as="p">{size}</RadioGroup.Label>
                                                                                    {availability ? (
                                                                                        <div
                                                                                        className={classNames(
                                                                                            active ? 'border' : 'border-4',
                                                                                            checked ? 'border-blue-500' : 'border-transparent',
                                                                                            'absolute rounded-md -inset-px  pointer-events-none'
                                                                                        )}
                                                                                        aria-hidden="true"
                                                                                        />
                                                                                    ) : (
                                                                                        <div
                                                                                        aria-hidden="true"
                                                                                        className="absolute -inset-px rounded-md border-2 border-gray-200 pointer-events-none"
                                                                                        >
                                                                                        <svg
                                                                                            className="absolute inset-0 w-full h-full text-gray-200 stroke-2"
                                                                                            viewBox="0 0 100 100"
                                                                                            preserveAspectRatio="none"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                                                        </svg>
                                                                                        </div>
                                                                                    )}
                                                                                    </>
                                                                                )}
                                                                                </RadioGroup.Option>
                                                                            ))}
                                                                        </div>
                                                                </RadioGroup>
                                                            </div>
                                                        </div>
                                                        <div className="pb-5">
                                                            <h1 className="text-xl text-gray-500">
                                                                Quantity 
                                                            </h1>
                                                            <div>
                                                                <input step="1" name="quantity" min="1" type="number" onChange={e=>setProductQuantity(e.currentTarget.value)} value={productQuantity} className="w-fit mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                    focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                    invalid:border-pink-500 invalid:text-pink-600
                                                                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                    "/>
                                                             </div>
                                                        </div>
                                                    </div>
                                                    <div className="row-span-1 flex-row text-center mt-5">
                                                        <button
                                                        type="button"
                                                        className="inline-flex m-1 px-5 justify-center rounded-md border border-transparent bg-blue-500  py-2 items-center text-md font-medium text-white hover:bg-blue-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                        onClick={handleAddToCart}
                                                        >
                                                            Add to bag
                                                            <ShoppingBagIcon className="mx-2 h-5 w-5 text-white"/>
                                                        </button>
                                                        <button
                                                        type="button"
                                                        className="inline-flex m-1 px-5 justify-center rounded-md border border-transparent bg-gray-200  py-2 text-md font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                        onClick={()=>setIsOpen(false)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                                </div>
                                            </div>
                                            <div className="hidden lg:grid grid grid-cols-2 gap-0">
                                                <div className="relative flex flex-col px-5">
                                                    <div className="duration-300 delay-10  pt-10">
                                                        <Image src={imageSelected} height={600} width={600} objectFit="contain" className="rounded-lg"/>
                                                    </div>
                                                    <div className=" justify-center grid grid-cols-4 gap-0 p-5">
                                                        <a onClick={()=>setImageSelected(images[0].url)} className="hover:scale-110 cursor-pointer opacity:20 z-0 hover:z-10 duration-300 delay-10">
                                                            <Image src={images[0].url} height={300} width={300} objectFit="cover"/>
                                                        </a>
                                                        <a onClick={()=>setImageSelected(images[1].url)} className="hover:scale-110 cursor-pointer opacity:20 z-0 hover:z-10 duration-300 delay-10">
                                                            <Image src={images[1].url} height={300} width={300} objectFit="cover" />
                                                        </a>
                                                        <a onClick={()=>setImageSelected(images[2].url)} className="hover:scale-110 cursor-pointer opacity:20 z-0 hover:z-10 duration-300 delay-10">
                                                            <Image src={images[2].url} height={300} width={300} objectFit="cover" />
                                                        </a> 
                                                        <a onClick={()=>setImageSelected(images[3].url)} className="hover:scale-110 cursor-pointer opacity:20 z-0 hover:z-10 duration-300 delay-10">
                                                            <Image src={images[3].url} height={300} width={300} objectFit="cover" />
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-start py-5">
                                                    <div className="grid grid-rows-8 gap-0">
                                                        <div className="row-span-3 py-5">
                                                            <Dialog.Title
                                                                as="h1"
                                                                className="text-4xl font-bold  text-blue-500 " 
                                                            >
                                                                {name}
                                                            </Dialog.Title>
                                                            <h4 className="py-5 text-gray-400">
                                                                By : {company}
                                                            </h4>
                                                            <div>
                                                                <h4 className="text-xl text-gray-500 mb-2">
                                                                    Features
                                                                </h4>
                                                                <div className="text-sm text-gray-500 items-center grid grid-cols-2 grid-rows-3 gap-0 text-start">
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        Adjustable
                                                                    </p>
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        High Traction Shock Absorbing Outsoles
                                                                    </p>
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        Stable
                                                                    </p>
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        Lightweight 
                                                                    </p>
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        Durable
                                                                    </p>
                                                                    <p className="flex flex-row">
                                                                        <BadgeCheckIcon className="text-green-500 h-5 w-5 mx-2" />
                                                                        Extra Padding and Cushioning
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row-span-4">
                                                        <div className="flex flex-col">
                                                            <h1 className="text-3xl font-bold">
                                                                {price}<span className="text-blue-500">$</span>
                                                            </h1>
                                                            <div className="py-5">
                                                                <h1 className="text-xl text-gray-500">
                                                                    Color 
                                                                </h1>
                                                                <RadioGroup value={productColor} onChange={setProductColor} className="mt-4">
                                                                    <RadioGroup.Label className="sr-only">Choose a color</RadioGroup.Label>
                                                                        <div className="flex items-center space-x-3">
                                                                            {colors.map((color) => (
                                                                                <RadioGroup.Option
                                                                                key={color.name}
                                                                                value={color}
                                                                                className={({ active, checked }) =>
                                                                                    classNames(
                                                                                        "ring-gray-400",
                                                                                    active && checked ? 'ring ring-offset-1' : '',
                                                                                    !active && checked ? 'ring-2' : '',
                                                                                    '-m-0.5 relative p-0.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none'
                                                                                    )
                                                                                }
                                                                                >
                                                                                <RadioGroup.Label as="p" className="sr-only">
                                                                                    {color.name}
                                                                                </RadioGroup.Label>
                                                                                <span
                                                                                    aria-hidden="true"
                                                                                    className={classNames(
                                                                                    color.class,
                                                                                    'h-8 w-8 border border-black border-opacity-10 rounded-full'
                                                                                    )}
                                                                                />
                                                                                </RadioGroup.Option>
                                                                            ))}
                                                                        </div>
                                                                </RadioGroup>   
                                                            </div>
                                                            <div className="pb-5">
                                                                <h1 className="text-xl text-gray-500">
                                                                    Size 
                                                                </h1>
                                                                <RadioGroup value={productSize.size} onChange={setProductSize} className="mt-4">
                                                                    <RadioGroup.Label className="sr-only">Choose a size</RadioGroup.Label>
                                                                        <div className="grid grid-cols-4 gap-6">
                                                                            {sizes.map(({size,availability},index) => (
                                                                                <RadioGroup.Option
                                                                                key={index}
                                                                                value={size}
                                                                                disabled={!availability}
                                                                                className={({ active, }) =>
                                                                                    classNames(
                                                                                    availability
                                                                                        ? 'bg-white shadow-sm text-gray-900 cursor-pointer'
                                                                                        : 'bg-gray-50 text-gray-200 cursor-not-allowed',
                                                                                    active ? 'ring-2 ring-blue-500' : '',
                                                                                    'group relative border rounded-md  py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1'
                                                                                    )
                                                                                }
                                                                                >
                                                                                {({ active, checked }) => (
                                                                                    <>
                                                                                    <RadioGroup.Label as="p">{size}</RadioGroup.Label>
                                                                                    {availability ? (
                                                                                        <div
                                                                                        className={classNames(
                                                                                            active ? 'border' : 'border-4',
                                                                                            checked ? 'border-blue-500' : 'border-transparent',
                                                                                            'absolute rounded-md -inset-px  pointer-events-none'
                                                                                        )}
                                                                                        aria-hidden="true"
                                                                                        />
                                                                                    ) : (
                                                                                        <div
                                                                                        aria-hidden="true"
                                                                                        className="absolute -inset-px rounded-md border-2 border-gray-200 pointer-events-none"
                                                                                        >
                                                                                        <svg
                                                                                            className="absolute inset-0 w-full h-full text-gray-200 stroke-2"
                                                                                            viewBox="0 0 100 100"
                                                                                            preserveAspectRatio="none"
                                                                                            stroke="currentColor"
                                                                                        >
                                                                                            <line x1={0} y1={100} x2={100} y2={0} vectorEffect="non-scaling-stroke" />
                                                                                        </svg>
                                                                                        </div>
                                                                                    )}
                                                                                    </>
                                                                                )}
                                                                                </RadioGroup.Option>
                                                                            ))}
                                                                        </div>
                                                                </RadioGroup>
                                                            </div>
                                                        </div>
                                                        <div className="pb-5">
                                                            <h1 className="text-xl text-gray-500">
                                                                Quantity 
                                                            </h1>
                                                            <div>
                                                                <input step="1" name="quantity" min="1" type="number" onChange={e=>setProductQuantity(e.currentTarget.value)} value={productQuantity} className="w-fit mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                    focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                    invalid:border-pink-500 invalid:text-pink-600
                                                                    focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                    "/>
                                                             </div>
                                                        </div>
                                                    </div>
                                                    <div className="row-span-1 flex-row text-center mt-5">
                                                        <button
                                                        type="button"
                                                        className="inline-flex m-1 px-5 justify-center rounded-md border border-transparent bg-blue-500  py-2 items-center text-md font-medium text-white hover:bg-blue-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                        onClick={handleAddToCart}
                                                        >
                                                            Add to bag
                                                            <ShoppingBagIcon className="mx-2 h-5 w-5 text-white"/>
                                                        </button>
                                                        <button
                                                        type="button"
                                                        className="inline-flex m-1 px-5 justify-center rounded-md border border-transparent bg-gray-200  py-2 text-md font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                        onClick={()=>setIsOpen(false)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
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
        {loginAlertState && <AlertInfo isOpen={loginAlertState} setIsOpen={setLoginAlertState}/>}
    </div>
  )
}

