import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        shipping_address_collection: {
          allowed_countries: ['US', 'CA'],
        },
        shipping_options: [
          // test shipping 
          { shipping_rate: 'shr_1LaQO0AvPfmKE3Z2SPHWmyT4' },
          { shipping_rate: 'shr_1LaQPbAvPfmKE3Z2624mYekj'}
          
          //live shipping
          // { shipping_rate: 'shr_1LaQO5AvPfmKE3Z2P6GUi3KP' },
          // { shipping_rate: 'shr_1LcLRaAvPfmKE3Z2hoPHUXeh'}

        ],
        line_items: req.body.map((item) => {
          const img = item.image[0].asset._ref;
          const newImage = img.replace('image-', 'https://cdn.sanity.io/images/vfxfwnaw/production/').replace('-webp', '.webp');

          return {
            price_data: { 
              currency: 'usd',
              product_data: { 
                name: item.name,
                images: [newImage],
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled:true,
              minimum: 1,
            },
            quantity: item.quantity
          }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

// const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     console.log(req.body.cartItems)
//     try {
//         const params = {        
//             submit_type:'pay',
//             mode: 'payment',
//             payment_method_types: ['card'],
//             billing_address_collection: 'auto',
//             shipping_options:[
//                 { shipping_rate: 'shr_1LaQO0AvPfmKE3Z2SPHWmyT4'},
//                 { shipping_rate: 'shr_1LaQPbAvPfmKE3Z2624mYekj'},
//             ],
//             line_items: [
//               {
//                 // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//                 price: '{{PRICE_ID}}',
//                 quantity: 1,
//               },
//             ],
//             mode: 'payment',
//             success_url: `${req.headers.origin}/?success=true`,
//             cancel_url: `${req.headers.origin}/?canceled=true`,
//             automatic_tax: {enabled: true},
//           }
//       // Create Checkout Sessions from body params.
//       const session = await stripe.checkout.sessions.create();
//       res.redirect(303, session.url);
//     } catch (err) {
//       res.status(err.statusCode || 500).json(err.message);
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// }