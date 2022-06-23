import {useEffect, useState} from "react"
import {Tab } from '@headlessui/react'
import Image from "next/image"
import Footer from "../Footer"
import NewTrending from "./NewTrending"
import ViewProducts from "../ViewProducts"
import Hero from "./Hero";
import {TopBanner} from "./Banners"

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
            <Hero />
            <div  className="pt-0">
                <TopBanner/>
            </div>
            <div className="w-full mt-20 text-gray-800 font-semibold">
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