import {useReducer,createContext} from "react";

export const Store = createContext();

let initialState = {
    cart:[],
    favourites:[],
};
function reducer(state,action){
    switch(action.type){
        case "ADD_TO_CART" :{
            const newItem = action.payload;
            const existItem = state.cart.find((item)=>item.id === newItem.id);
            const cartItems = existItem? state.cart.map((item)=>item.id===existItem.id?newItem:item):[...state.cart,newItem];
            const updatedCart= {favourites:state.favourites,cart:cartItems};
            return updatedCart;
        }
        case "REMOVE_FROM_CART":{
            const {removeItemId} = action.payload
            const unRemovedCartItems = state.cart.filter((item)=>item.id===removeItemId);
            const cartEmpty = unRemovedCartItems.length!=0?false:true;
            const updatedCart = {favourites:state.favourites,cart:unRemovedCartItems};
            return updatedCart;
        }
        case "ADD_TO_FAVOURITES" :{
            const newItems = action.payload;
            let updatedFavourites;
            if(newItems.length>1){
                const latestItems = newItems.filter(({ productId: id1 }) => !state.favourites.some(({ productId: id2 }) => id2 === id1));
                updatedFavourites= {cart:state.cart,favourites:[...state.favourites,...latestItems]};
                return updatedFavourites;
            }
            else{
                const existItem = state.favourites.find((item)=>item.productName === newItems.productName);
                if(existItem){
                    return;
                }
                updatedFavourites= {cart:state.cart,favourites:[...state.favourites,newItems]};
                return updatedFavourites;
            }
        }
        case "REMOVE_FROM_FAVOURITES" :{
            const removeItem = action.payload;
            const updatedFavourites= {cart:state.cart,favourites:state.favourites.filter((item)=>item.productName!=removeItem.productName)};
            console.log(updatedFavourites); 
            return updatedFavourites;
        }
        case "EMPTY_CART":{
            const emptyCart = {favourites:state.favourites,cart:[]}
            console.log(emptyCart)
            return emptyCart;
        }
        default:
            return state;
    }
}

export function StoreProvider({children}){
    const [state,dispatch]=useReducer(reducer,initialState);
    const value = {state,dispatch};
    return <Store.Provider value={value}>{children}</Store.Provider>
}