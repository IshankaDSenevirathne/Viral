/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  images:{
    domains:['res.cloudinary.com','lh3.googleusercontent.com']
  },
  nextConfig:nextConfig,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env:{  
    STRIPE_PUBLIC_KEY : "pk_test_51KxW1JEo5iGGoetegazbVVAXP2Y5M0LpnHOgqEzIa7IVZd2wOGJlQGZsNf1INTekkVoj10PfIlIlWy8kjS1xDiKx00aAPcoWhB",
    STRIPE_SECRET_KEY:"sk_test_51KxW1JEo5iGGoeteVt25jzUJwwae5p2RwOFOkdvEamvOJV45Uoub4oU8w6r3TBdv25nvpzsCHgPOe1GMfXe7zMql00mKBQngNg",
    STRIPE_WEBHOOK_SECRET:"whsec_7e73f7c93058c3b58c10bb85623d24e211c13e6223319568f9dcbdd273c90853"
  }
}