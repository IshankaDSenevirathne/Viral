import Cors from 'micro-cors';
import Stripe from "stripe";
import { buffer } from 'micro';
import Order from '../../../schema/Order';
import dbConnect from'../../../lib/dbConnect';

dbConnect();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const webhookSecret= process.env.STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to construct the event.
export const config = {
    api: {
        bodyParser: false,
    },
}

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req,res) => {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']
    let event

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    } catch (err) {
      // On error, log and return the error message
      console.log(`❌ Error message: ${err.message}`)
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }

    if (event.type === 'checkout.session.completed') {
      console.log(`💰  Payment received!`);
      const {id,customer_details,amount_total}=event.data.object;
      const items = await stripe.checkout.sessions.listLineItems(id)
      const orderData=JSON.parse(event.data.object.metadata.orderData)
      const productData= items.data.map((item,index)=>({productName:item.description,productSize:orderData[index].s,productColor:orderData[index].c,productQuantity:item.quantity,productPrice:item.amount_total*0.01/item.quantity}))
      console.log(event.data.object)
      const order ={
        orderId:id,
        clientName:customer_details.name,
        homeAddress:{
                    city:customer_details.address.city,
                    country:customer_details.address.country,
                    line1:customer_details.address.line1,
                    line2:customer_details.address.line2,
                    postalcode:customer_details.address.postal_code,
                    state:customer_details.address.state,
                    },
        emailAddress:customer_details.email,
        phoneNumber:customer_details.phone,
        orderDetails:{
          products:productData,
          totalPrice:amount_total,
        },
        paymentStatus:"Payed",
        orderStatus:"Pending"
      };
      try{
        const data = await Order.create(order);
        console.log(data);
      }catch(error){
        res.status(400).json({success:false});
        console.log(error);
      }
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }
    res.status(200).send();
  }else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
// ...
export default cors(webhookHandler)