// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// export default async(req,res)=>{
//     const {method} = req
//     if(method==='GET'){
//         const balance= await stripe.balance.retrieve()
//         const reportType = await stripe.reporting.reportTypes.retrieve('balance.summary.1')
//         if(balance.error){
//             res.status(400).json({success:false})
//             return
//         }
//         const data = {balance,reportRuns}
//         res.status(200).json({success:true,data:data});
//     }
// }

