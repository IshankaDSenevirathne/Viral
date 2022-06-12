export default function Motto(){
    return (
        <div className="w-screen h-fit px-5">
            <div className="container mx-auto flex flex-col md:grid md:grid-cols-6">
                <div className="col-span-2 pr-5 border-r-4 flex flex-col justify-end items-end py-5 border-blue-500 font-sans text-gray-800 font-bold text-4xl md:text-5xl">
                    <div >You'r</div>
                    <div >Desire</div>
                    <div >Tailored</div>
                    <div >To</div>
                    <div >Perfection</div>
                </div>
                <div className="col-span-4 flex flex-col justify-around items-start py-5">
                    <p className="pl-5 text-gray-800 font-semibold text-xl md:text-2xl">Cupcake ipsum dolor sit amet lemon drops pastry cotton candy. Sweet carrot cake macaroon bonbon croissant fruitcake jujubes macaroon oat cake. Soufflé bonbon caramels jelly beans. Tiramisu sweet roll cheesecake pie carrot cake.</p>
                    <button className="m-5 px-5 py-2 text-xl font-semibold text-blue-500 lg:text-gray-500 border-blue-500 lg:border-gray-500 duration-300 delay-10 hover:text-blue-500 border-2 hover:border-blue-500 ">Read more</button>
                </div>
            </div>
        </div>
    )
}