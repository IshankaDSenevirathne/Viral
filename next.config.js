/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  images:{
    domains:['res.cloudinary.com','lh3.googleusercontent.com']
  },
  nextConfig:nextConfig,
}