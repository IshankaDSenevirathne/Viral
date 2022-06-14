
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

async function createStripeProduct(req,res) {
  const {cart} = req.body;
  const redirectURLSuccess =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/private/Success'
      : 'https://viral-one.vercel.app/private/Success';
  const redirectURLFail =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://viral-one.vercel.app';
  
  const metaData= cart.map((item)=>({
    s:"M",c:"black"
  }))
  const transformedItems = cart.map((item)=>({
    name: item.name,
    images: [item.imageURL],
    amount: item.price*100,
    currency: 'usd',
    quantity: item.quantity,
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: transformedItems,
    mode: 'payment',
    billing_address_collection:"required",
    phone_number_collection: {
      enabled: true,
    },
    metadata:{orderData:JSON.stringify(metaData)},
    success_url: redirectURLSuccess + '?status=success&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: redirectURLFail + '?status=cancel',
  });
  res.json({ id:session.id });
}

export default createStripeProduct;