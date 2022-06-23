export function TopBanner(){
    return (
            <div className=" h-screen w-full grid grid-cols-8 gap-0 hidden md:grid">
                <div className="col-span-2 h-full w-full bg-pink-300">
                    <div className="w-full h-full px-10 pt-20 pb-20" >
                        <div className="border-8 border-white flex justify-center items-start w-full h-full" style={{"backgroundImage": "url('/banner1.jpg')","backgroundSize":"cover","backgroundPosition":"top"}}>
                            <div className=" text-3xl text-white font-bold">VIBRANT</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 h-full w-full bg-green-300">
                    <div className="w-full h-full px-10 pt-20 pb-20" >
                        <div className="border-8 border-white flex justify-center items-end w-full h-full" style={{"backgroundImage": "url('/banner2.jpg')","backgroundSize":"cover","backgroundPosition":"top"}}>
                            <div className=" text-3xl text-white font-bold mb-2">ELEVATED</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 h-full w-full bg-blue-300">
                    <div className="w-full h-full px-10 pt-20 pb-20" >
                        <div className="border-8 border-white flex justify-center items-start w-full h-full" style={{"backgroundImage": "url('/banner3.jpg')","backgroundSize":"cover","backgroundPosition":"top"}}>
                            <div className=" text-3xl text-white font-bold">TAILORED</div>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 h-full w-full bg-yellow-200">
                    <div className="w-full h-full px-10 pt-20 pb-20" >
                        <div className="border-8 border-white flex justify-center items-end w-full h-full" style={{"backgroundImage": "url('/banner4.jpg')","backgroundSize":"cover","backgroundPosition":"top"}}>
                            <div className=" text-3xl text-white font-bold mb-2">ELEGANT</div>
                        </div>
                    </div>
                </div>
            </div>
    )
}