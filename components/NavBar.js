/* This example requires Tailwind CSS v2.0+ */
import { Disclosure, Menu, Transition } from '@headlessui/react'
import ShoppingCart from "./ShoppingCart";
import dynamic from 'next/dynamic'
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
            <div className="container mx-auto py-2  px-2 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-auto md:h-12"
                      src="/Logo.svg"
                      alt="Workflow"
                    />
                    <h1 className="text-white font-bold text-xl md:text-3xl">&nbsp;VIRAL</h1>
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
