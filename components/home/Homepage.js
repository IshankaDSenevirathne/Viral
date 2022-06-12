import {useEffect, useState} from "react"
import {Tab } from '@headlessui/react'
import Image from "next/image"
import Footer from "../Footer"
import NewTrending from "./NewTrending"
import ViewProducts from "../ViewProducts"

const categories = [
    {name:"Store Front",value:"New & Featured"},
    {name:"Shoes",value:"Shoes"},
    {name:"Clothes",value:"Clothes"},
    {name:"Bags",value:"Bags"},
    {name:"Jewellery",value:"Jewellery"},
    {name:"Beauty",value:"Beauty"},
    {name:"Accessories",value:"Accessories"}
]

function classNames(...classes){
    return classes.filter(Boolean).join(' ')
}

export default function Homepage(){

    return(
        <div className="absolute overflow-y-auto top-0 left-0 ">
            <div className=" h-screen w-screen grid grid-cols-8 gap-0 hidden xl:grid">
                <div className="col-span-2 h-full w-full bg-pink-300">
                    <div className="w-full h-full px-10 pt-20 pb-20" >
                        <div className="border-8 border-white flex justify-center items-start w-full h-full" style={{"backgroundImage": "url('/c_1.jpg')","backgroundSize":"cover","backgroundPosition":"top"}}>
                            <div className=" text-3xl text-white font-bold">VIBRANT</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 h-full w-full bg-green-300">
                    <div className="w-full h-full px-10 pt-20 pb-20" >
                        <div className="border-8 border-white flex justify-center items-end w-full h-full" style={{"backgroundImage": "url('/Hero.jpg')","backgroundSize":"cover","backgroundPosition":"top"}}>
                            <div className=" text-3xl text-white font-bold mb-2">ELEVATED</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 h-full w-full bg-blue-300">
                    <div className="w-full h-full px-10 pt-20 pb-20" >
                        <div className="border-8 border-white flex justify-center items-start w-full h-full" style={{"backgroundImage": "url('/Hero_sub_3.jpg')","backgroundSize":"cover","backgroundPosition":"top"}}>
                            <div className=" text-3xl text-white font-bold">TAILORED</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 h-full w-full bg-yellow-200">
                    <div className="w-full h-full px-10 pt-20 pb-20" >
                        <div className="border-8 border-white flex justify-center items-end w-full h-full" style={{"backgroundImage": "url('/Hero_sub_6.jpg')","backgroundSize":"cover","backgroundPosition":"top"}}>
                            <div className=" text-3xl text-white font-bold mb-2">ELEGANT</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-screen mt-20 text-gray-800 font-semibold">
                <Tab.Group defaultIndex={0}>
                    <Tab.List className="flex container mx-auto max-w-screen-lg">
                    {categories.map((category,index) => (
                        <Tab
                        key={index}
                        className={({ selected }) =>
                            classNames(
                            'w-full  py-3 mx-1 md:mx-2 text-md font-semibold leading-5',
                            selected
                                ? 'text-blue-500 border-b-4 border-blue-500 duration-150 text-lg delay-10 focus:outline-none'
                                : 'text-gray-800 border-b-4 border-white hover:bg-gray-100 '
                            )
                        }
                        >
                            <Image src={`/${category.name}.png`} height={36} width={36} objectFit="cover" />
                            <label className="hidden md:block">{category.name}</label>
                        </Tab>
                    ))}
                    </Tab.List>
                    <Tab.Panels className="mt-2">
                          {categories.map((category)=>
                            <Tab.Panel key={category.value} >
                               {category.name=="Store Front"?<NewTrending />:<ViewProducts category={category.name}/>}
                            </Tab.Panel>
                        )}
                    </Tab.Panels>
                </Tab.Group>
            </div>
            <div className="mt-20">
                <Footer />
            </div>
           
        </div>

    )
}