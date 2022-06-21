/* This example requires Tailwind CSS v2.0+ */
import { Disclosure, Menu, Transition } from '@headlessui/react'
import ShoppingCart from "./ShoppingCart";
import dynamic from 'next/dynamic'
import Image from "next/image"
// import UserLogin  from './user/UserLogin';
const UserLogin = dynamic(
  () => import('./user/UserLogin'),
  { ssr: false }
)

export default function NavBar() {

  return (
    <Disclosure as="nav" className="bg-gray-800 bg-opacity-100 backdrop-blur-sm fixed top-0 z-50">
      {({ open }) => (
        <div className="w-screen">
            <div className="container mx-auto py-1  px-2 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Image
                      src="/viral.svg"
                      alt="Workflow"
                      height={80}
                      width={200}
                    />
                  </div>
                  <div className="flex items-center">
                    <ShoppingCart />
                    <UserLogin/>
                  </div>
                </div>
            </div>
        </div>
      )}
    </Disclosure>
  )
}
