import Timer from "../../components/utils/Timer";

export default function StripeAccess(){
    return(
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="flex flex-col w-fit h-fit items-center justify-center p-10 rounded-md border border-red-500">
                <h1 className="text-4xl text-red-500">Payment gateway disabled in production mode</h1>
                <div className="flex justify-center mt-5">
                    <Timer />
                </div>
            </div>
        </div>
    )
}