import dbConnect from'../../../lib/dbConnect';
import Favourites from "../../../schema/Favourites";
dbConnect();

export default async(req,res)=>{
    const {method} =req;
    console.log(method);
    switch(method){
        case 'GET':
            try{
                const emailAddress = req.query.user;
                const favourites = await Favourites.find({emailAddress});
                res.status(200).json({success:true,data:favourites});
            }
            catch(error){
                res.status(400).json({sucess:false});
            }
            break;
        case 'POST':
            try{
                const item = req.body;
                const itemExists = await Favourites.find({productId:item.productId,emailAddress:item.emailAddress})
                if(itemExists.length!=0){
                    const unFavourited = await Favourites.deleteOne({productId:item.productId});;
                    res.status(200).json({message:"unfavourited"});
                }else{
                    const favouriteItem = await Favourites.create(item);
                    res.status(200).json({message:"favourited"})
                }
            }catch(error){
                res.status(400).json({success:false});
                console.log(error);
            }
            break;
        case 'DELETE':{
            try{
                const item = req.body;
                const removedItem = await Favourites.findOneAndRemove({productId:item.productId,emailAddress:item.emailAddress});
                if(removedItem){
                    res.status(200).json({success:true,data:removedItem});
                }else{
                    res.status(200).json({message:"Item not found"});
                }
            }catch(error){
                res.status(400).json({success:false});
                console.log(error)
            }
        }
        default:
            res.status(400).json({success:false});
            break;
    }
}