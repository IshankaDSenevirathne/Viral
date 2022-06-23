import Image from "next/image"
import {ShoppingCartIcon} from "@heroicons/react/outline";

export default function Hero(){
    return(
        <div className="relative w-full h-screen" style={{"backgroundImage": "url('/banner.jpg')","backgroundSize":"cover","backgroundPosition":"top"}}>
            <video className="z-10 w-full h-full object-cover hidden md:block" autoPlay muted loop>
                <source src="https://assets.mixkit.co/videos/preview/mixkit-air-moving-a-girls-hair-on-the-roof-of-a-36468-large.mp4" type="video/mp4"/>
            </video>
            <div className="z-20 absolute top-0 left-0 hidden bg-black/30 lg:grid lg:grid-cols-8 w-full h-full">
                <div className="md:col-span-5" >
                </div>
                <div className="col-span-3 lg:col-span-2 bg-black bg-opacity-20 text-white w-full h-full" >
                    <div className="grid grid-rows-8 w-full h-full">
                        <div className="row-span-4 bg-gray-800 w-full h-full" style={{"background":"linear-gradient(-60deg,#3b82f6 50%,#1f2937 50%)"}}></div>
                        <div className="row-span-2 w-full h-full md:p-2 xl:p-10 ">
                            <div className="border-8 border-r-0 border-b-0 p-2 ">
                                <h1 className="md:text-5xl lg:text-7xl text-left font-bold">MAKE</h1>
                                <h1 className="md:text-5xl lg:text-7xl text-center font-bold">YOUR</h1>
                                <h1 className="md:text-5xl lg:text-7xl text-left font-bold">OWN</h1>
                                <h1 className="md:text-5xl lg:text-7xl text-right font-bold">STYLE</h1>
                            </div>
                            <div className="mt-20 flex justify-end">
                                <button className="px-5 py-5 text-white font-bold md:text-xl lg:text-2xl border-b-4 border-b-white border-r-white text-blue-500 hover:bg-transparent hover:text-white border-r-4 hover:border-blue-500 duration-300 delay-10  flex justify-center items-center">START SHOPPING <ShoppingCartIcon className="ml-3 h-8 w-8" aria-hidden="true" /></button>
                            </div>
                        </div>
                        <div className="row-span-2 w-full h-full bg-white" style={{"background":"linear-gradient(-60deg,#ffffff 50%,#3b82f6 50%)"}}></div>
                    </div>
                </div>
            </div>
            <div className="z-20 absolute top-0 left-0 lg:hidden flex flex-col justify-end items-center w-full h-full">
                <div className="bg-black bg-opacity-20 text-white w-full h-fit" >
                    <div className="grid grid-cols-2 w-full h-full">
                        <div className="p-5">
                            <h1 className="text-4xl md:text-7xl text-right font-bold">MAKE</h1>
                            <h1 className="text-4xl md:text-7xl text-right font-bold">YOUR</h1>
                            <h1 className="text-4xl md:text-7xl text-right font-bold">OWN</h1>
                            <h1 className="text-4xl md:text-7xl text-right font-bold">STYLE</h1>
                        </div>
                        <div className="w-full h-full flex flex-col justify-end items-center p-5 ">
                            <button className="hidden sm:flex text-white font-bold text-2xl md:text-3xl text-blue-500 border-4 border-white p-2 hover:bg-transparent hover:text-white hover:border-blue-500 duration-300 delay-10 flex justify-center items-center">START SHOPPING <ShoppingCartIcon className="ml-1 md:ml-3 h-8 w-8" aria-hidden="true" /></button>
                            <button className="sm:hidden flex justify-center items-center text-blue-500 text-2xl font-bold border-2 p-2 border-white">START<ShoppingCartIcon className="ml-1 md:ml-3 h-8 w-8" aria-hidden="true" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}