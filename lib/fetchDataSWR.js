import useSWR from "swr"

const fetcher = (...args) => fetch(...args).then(res => res.json());

function displayProducts({category}){

    const {data,error} = useSWR(()=>'/api/manage-store/manage-products?category='+category,fetcher);
    return {
                data,
                isLoading:!data && !error,
                error,
    }
} 

function displayAdminOrdersData({userEmail,orderType}){
    const {data,error}=useSWR(()=>'/api/manage-store/manage-orders?orders='+orderType+'&user='+userEmail,fetcher);
    return {
        data,
        isLoading:!data & !error,
        error
    }

}
function getUserOrdersData({userEmail}){
    const {data,error}=useSWR(()=>'/api/manage-user/manage-orders-user?user='+userEmail,fetcher);
    return {
        data,
        isLoading:!data & !error,
        error
    }

}
function getSavedOrdersData({userEmail}){
    const {data,error}=useSWR(()=>'/api/manage-user/save-order?user='+userEmail,fetcher);
    return {
        data,
        isLoading:!data & !error,
        error
    }

}
function getFavouriteItemData({userEmail}){
    const {data,error}=useSWR(()=>'/api/manage-user/user-favourites?user='+userEmail,fetcher);
    return {
        data,
        isLoading:!data & !error,
        error
    }

}
function getTrendingItemData(){
    const {data,error}=useSWR('/api/manage-store/product-review',fetcher);
    return {
        data,
        isLoading:!data & !error,
        error
    }

}
function getLatestItems(){
    const {data,error}=useSWR(()=>"/api/manage-store/latest-products",fetcher);
    return{
        data,
        isLoading:!data & !error,
        error
    }
}

function orderDetails(session_id){
    const {data,error} = useSWR(() => `/api/checkout-sessions/${session_id}`,fetcher);
    return {
                data,
                isLoading:!data && !error,
                error,
    }
} 

function getAccountBalance(){
    const {data,error} = useSWR('/api/viral-account-transaction-data/balance',fetcher);
    return {
        data,
        isLoading:!data && !error,
        error
    }
}

export {displayProducts,displayAdminOrdersData,getUserOrdersData,orderDetails,getAccountBalance,getSavedOrdersData,getFavouriteItemData,getLatestItems,getTrendingItemData};