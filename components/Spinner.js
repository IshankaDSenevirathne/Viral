export default function Spinner(){
    return(
        <div className="flex items-center justify-center gap-2 text-gray-500">
            <span className="h-10 w-10 block rounded-full border-4 border-t-blue-500 animate-spin"></span>
        </div>
    )
}