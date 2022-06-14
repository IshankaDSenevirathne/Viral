import Image from "next/image"

export default function Footer(){
    return(
        <div>
            <div className="bg-gray-800 md:hidden">
                <div className="py-5 px-5">
                    <div className="flex border-b border-gray-700 pb-5">
                        <div className="text-sm text-gray-100 col-span-2 grid grid-rows-4">
                            <a>
                                Home
                            </a>
                            <a>
                                About
                            </a>
                            <a>
                                Shipping & Returns
                            </a>
                            <a>
                                Terms of Service
                            </a>
                            <a>
                                Privacy Policy
                            </a>
                        </div>
                    </div>
                    <div className="text-xs w-full flex py-2 justify-between text-gray-400">
                        <div className="flex flex-col justify-end items-center">
                            <Image src="/Logo.svg" width={70} height={70} objectFit="contain"/>
                        </div>
                        <div className="grid grid-rows-4">
                            <div className="flex flex-col justify-end row-span-1 overflow-hidden">
                                <div className="text-xs flex flex-col">
                                    <h1>
                                        Made with Love and Coffee
                                    </h1>
                                </div>
                            </div>
                            <div className="row-span-2"></div>
                            <div className="row-span-1 flex flex-col gap-2">
                                <svg 
                                    width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.50583 0 12.3035C0 17.7478 3.435 22.3463 8.205 23.9765C8.805 24.0842 9.03 23.715 9.03 23.3921C9.03 23.0999 9.015 22.131 9.015 21.1005C6 21.6696 5.22 20.347 4.98 19.6549C4.845 19.3012 4.26 18.2092 3.75 17.917C3.33 17.6863 2.73 17.1173 3.735 17.1019C4.68 17.0865 5.355 17.9939 5.58 18.363C6.66 20.2239 8.385 19.701 9.075 19.3781C9.18 18.5783 9.495 18.04 9.84 17.7325C7.17 17.4249 4.38 16.3637 4.38 11.6576C4.38 10.3196 4.845 9.21227 5.61 8.35102C5.49 8.04343 5.07 6.78232 5.73 5.09058C5.73 5.09058 6.735 4.76762 9.03 6.3517C9.99 6.07487 11.01 5.93645 12.03 5.93645C13.05 5.93645 14.07 6.07487 15.03 6.3517C17.325 4.75224 18.33 5.09058 18.33 5.09058C18.99 6.78232 18.57 8.04343 18.45 8.35102C19.215 9.21227 19.68 10.3042 19.68 11.6576C19.68 16.3791 16.875 17.4249 14.205 17.7325C14.64 18.1169 15.015 18.8552 15.015 20.0086C15.015 21.6542 15 22.9768 15 23.3921C15 23.715 15.225 24.0995 15.825 23.9765C18.2072 23.1519 20.2773 21.5822 21.7438 19.4882C23.2103 17.3942 23.9994 14.8814 24 12.3035C24 5.50583 18.63 0 12 0Z" fill="currentColor">
                                    </path>
                                </svg>
                                <h1>
                                Author : Ishanka D Senevirathne
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center bg-gray-900 py-2 w-full h-fit text-gray-400 text-xs">
                    <span>
                        &copy; {new Date().getFullYear()} VIRAL, Inc. All rights reserved.
                    </span>
                </div>
            </div>
            <div className="hidden md:flex md:flex-col ">
                <div className="bg-gray-800 w-screen  border-b-2 border-gray-600 ">
                    <div className=" container mx-auto h-fit">
                        <div className=" container mx-auto grid grid-cols-6 max-w-screen-xl text-white font-semibold h-64 pt-10 gap-2 ">
                            <div className="col-span-1 flex flex-col justify-center items-center">
                                <Image src="/Logo.svg" width={100} height={100} objectFit="contain"/>
                            </div>
                            <div className="col-span-2 grid grid-rows-5 text-sm">
                                <a>
                                    Home
                                </a>
                                <a>
                                    About
                                </a>
                                <a>
                                    Shipping & Returns
                                </a>
                                <a>
                                    Terms of Service
                                </a>
                                <a>
                                    Privacy Policy
                                </a>
                            </div>
                            <div className="col-span-2"></div>
                            <div className="col-span-1 w-full grid grid-rows-4 justify-around">
                                <div className="row-span-1 flex overflow-hidden">
                                    <div className="cursor-pointer hover:scale-110 duration-200 delay-10">
                                        <svg 
                                            width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.50583 0 12.3035C0 17.7478 3.435 22.3463 8.205 23.9765C8.805 24.0842 9.03 23.715 9.03 23.3921C9.03 23.0999 9.015 22.131 9.015 21.1005C6 21.6696 5.22 20.347 4.98 19.6549C4.845 19.3012 4.26 18.2092 3.75 17.917C3.33 17.6863 2.73 17.1173 3.735 17.1019C4.68 17.0865 5.355 17.9939 5.58 18.363C6.66 20.2239 8.385 19.701 9.075 19.3781C9.18 18.5783 9.495 18.04 9.84 17.7325C7.17 17.4249 4.38 16.3637 4.38 11.6576C4.38 10.3196 4.845 9.21227 5.61 8.35102C5.49 8.04343 5.07 6.78232 5.73 5.09058C5.73 5.09058 6.735 4.76762 9.03 6.3517C9.99 6.07487 11.01 5.93645 12.03 5.93645C13.05 5.93645 14.07 6.07487 15.03 6.3517C17.325 4.75224 18.33 5.09058 18.33 5.09058C18.99 6.78232 18.57 8.04343 18.45 8.35102C19.215 9.21227 19.68 10.3042 19.68 11.6576C19.68 16.3791 16.875 17.4249 14.205 17.7325C14.64 18.1169 15.015 18.8552 15.015 20.0086C15.015 21.6542 15 22.9768 15 23.3921C15 23.715 15.225 24.0995 15.825 23.9765C18.2072 23.1519 20.2773 21.5822 21.7438 19.4882C23.2103 17.3942 23.9994 14.8814 24 12.3035C24 5.50583 18.63 0 12 0Z" fill="currentColor">
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="row-span-2">
                                </div>
                                <div className="text-xs">
                                    Made with Love and Coffee
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900">
                    <div className="container mx-auto bg-gray-900 flex justify-between w-full h-fit py-5 text-gray-400 text-xs">
                        <span>
                            &copy; {new Date().getFullYear()} VIRAL, Inc. All rights reserved.
                        </span>
                        <span>
                            Created by Ishanka D Senevirathne
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}