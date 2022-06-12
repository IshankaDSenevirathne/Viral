import {getAccountBalance} from "../lib/fetchDataSWR";
import {useEffect} from "react";
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export function Dashboard(){
    const {data,isLoading,error}= getAccountBalance();
    useEffect(()=>{
        console.log(data);
    },[data])
    return (
        <div className="p-5 bg-gray-200">
            <div className="grid grid-cols-2">
                <div >
                    {isLoading ? <p>data is loading</p>:<p>data has been loaded</p>}
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}











/////////////////////////////////////////////////////////////////////
export function SettingsData(){
    return (
        <div>
            This is Settings
        </div>
    )
}