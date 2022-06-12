//swr data from db
import {displayProducts} from "../lib/fetchDataSWR";
import { useState,Fragment } from 'react'
import {Transition,Dialog,Listbox,Tab } from '@headlessui/react'
import Image from "next/image";
import {AlertSuccess} from "./Alert";
import {PlusIcon,CheckIcon,SelectorIcon,CogIcon,TrashIcon} from "@heroicons/react/solid"


const genders =[{name:"Male",value:"M",checked:false},{name:"Female",value:"F",checked:false},{name:"Other",value:"O",checked:false}]
const ageGroups =[{name:"Elders",value:"Elders",checked:false},{name:"Adults",value:"Adults",checked:false},{name:"Teens",value:"Teens",checked:false},{name:"Kids",value:"Kids",checked:false}]
const sizes=[
    { name: 'XXS',value: 'XXS', availability: true },
    { name: 'XS',value: 'XS', availability: true },
    { name: 'S',value: 'S', availability: true },
    { name: 'M',value: 'M', availability: true },
    { name: 'L',value: 'L', availability: true },
    { name: 'XL',value: 'XL', availability: true },
    { name: 'XXL',value: 'XXL', availability: true },
    { name: 'XXXL',value: 'XXXL', availability: false },
]
const categories = [
    {name:"Shoes",value:"Shoes"},
    {name:"Clothes",value:"Clothes"},
    {name:"Bags",value:"Bags"},
    {name:"Jewellery",value:"Jewellery"},
    {name:"Beauty",value:"Beauty"},
    {name:"Accessories",value:"Accessories"}
]
function classNames(...classes){
    return classes.filter(Boolean).join(' ')
}

export function ShopData(){
    //for tabs
    const [categorySelected,setCategorySelected]= useState(categories[0].name)
    const {data:products,isLoading,error}= displayProducts({category:categorySelected})

    //for New/Edit Product modal
    const [isNewProductOpen,setNewProductOpen]=useState(false);
    const [isEditProductOpen,setEditProductOpen]=useState(false);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [imagesSelected, setImagesSelected]= useState([]);
    const [successAlertState, setSuccessAlertState] = useState(false);
    
    const [productState,setProductState]= useState({id:"",name:"",price:0,company:"",images:[],sizes:[],genders:[],ages:[],category:"",features:""});

    async function handleEdit(e){
        e.preventDefault();
        setLoadingStatus(true);
        const form = e.currentTarget;
        const sizes=Array.from(form.elements).filter(({ name }) => name === 'size').filter(({checked})=>checked).map(({value})=>{return({size:value,availability:true})});
        const genders=Array.from(form.elements).filter(({ name }) => name === 'gender').filter(({checked})=>checked).map(({value})=>value);
        const ages=Array.from(form.elements).filter(({ name }) => name === 'age').filter(({checked})=>checked).map(({value})=>value);
      
        console.log(sizes,genders,ages);
        if(imagesSelected.length<4 && imagesSelected.length !=0){
            setLoadingStatus(false);
            alert("please select 4 images")
            return;
        }else if(imagesSelected.length==4){
            const imageURLDATA = [];
            const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');
            const formData = new FormData();
            for ( const file of fileInput.files ) {
                formData.append('file', file);
                formData.append('upload_preset', 'ViralUploads');
                const data = await fetch('https://api.cloudinary.com/v1_1/ishankadsenevirathne/image/upload', {
                method: 'POST',
                body: formData
                }).then(r => r.json());
                imageURLDATA.push({url:data.url,publicID:data.public_id});
            }
            const res = await fetch("/api/manage-store/manage-products",{
                body:JSON.stringify({
                    id:productState.id,name:productState.name,company:productState.company,category:productState.category,genders,ages,features:productState.features,price:productState.price,colors:productState.colors,sizes,images:imageURLDATA
                }),
                method:'PUT'
            });
        }else{
            const res = await fetch('/api/manage-store/manage-products',{
                body:JSON.stringify({
                    id:productState.id,name:productState.name,company:productState.company,category:productState.category,genders,ages,features:productState.features,price:productState.price,colors:productState.colors,sizes
                }),
                method:'PUT'
            });
        }
        setLoadingStatus(false);
        setEditProductOpen(false);
        setProductState({id:"",name:"",price:0,company:"",images:[],sizes:[],genders:[],ages:[],category:"",features:""});
        setSelectedCategory(categories[0]);
        setImagesSelected([]);
    }
    async function handleSubmit(e){
        e.preventDefault();
        setLoadingStatus(true);
        const form = e.currentTarget;
        //produt data parameters
        const name=e.target.name.value;
        const company=e.target.company.value;
        const category=e.target.category.value;
        const genders = Array.from(form.elements).filter(({ name }) => name === 'gender').filter(({checked})=>checked).map(({value})=>value);
        const ages = Array.from(form.elements).filter(({ name }) => name === 'age').filter(({checked})=>checked).map(({value})=>value);
        const sizes = Array.from(form.elements).filter(({ name }) => name === 'size').filter(({checked})=>checked).map(({value})=>{return({size:value,availability:true})});
        const features=e.target.category.value;
        const price=e.target.price.value;
        const colors=[
            {name:"White",class:"bg-white"},
            {name:"Gray",class:"bg-gray-200"},
            {name:"Black",class:"bg-gray-900"},
            {name:"Blue",class:"bg-blue-500"},
            {name:"Green",class:"bg-green-500"},
        ];
        const imageURLDATA = [];
        const fileInput = Array.from(form.elements).find(({ name }) => name === 'file');
        // console.log(fileInput.files)
        if(fileInput.files.length!==4){
            setLoadingStatus(false);
            alert("please select 4 items")
            return;
        }
        const formData = new FormData();
        for ( const file of fileInput.files ) {
            formData.append('file', file);
            formData.append('upload_preset', 'ViralUploads');
  
            const data = await fetch('https://api.cloudinary.com/v1_1/ishankadsenevirathne/image/upload', {
            method: 'POST',
            body: formData
            }).then(r => r.json());
            imageURLDATA.push({url:data.url,publicID:data.public_id});
            }
        console.log(imageURLDATA);
        const res = await fetch('/api/manage-store/manage-products',{
            body:JSON.stringify({
                name,company,category,genders,ages,features,price,colors,sizes,images:imageURLDATA
            }),
            headers:{
                'Content-Type':'application/json',
            },
            method:'POST'
        });
        const result = await res.json();
        if(result.success){
            setSuccessAlertState(true);
        }
        setLoadingStatus(false);
        setNewProductOpen(false);
        setSelectedCategory(categories[0]);
        setImagesSelected([]);
    }
    async function handleDelete(id){
        const res = await fetch("/api/manage-store/manage-products",{
                body:JSON.stringify({id}),
                method:"DELETE"
            }
        );
    }
    
        return (
              <div className="w-full h-screen px-2 sm:px-0 className">
                  <div className="flex flex-col h-full w-full justify-between">
                      <div>
                          <Tab.Group onChange={(tab)=>{
                            setCategorySelected(categories[tab].name);
                          }}>
                              <Tab.List className="flex border-b">
                              {categories.map((category,index) => (
                                  <Tab
                                  key={index}
                                  className={({ selected }) =>
                                      classNames(
                                      'w-full  py-2.5 text-md font-medium leading-5',
                                      selected
                                          ? 'bg-blue-500 text-white focus:outline-none'
                                          : 'text-gray-700 hover:bg-gray-100 '
                                      )
                                  }
                                  >
                                  {category.name}
                                  </Tab>
                              ))}
                              </Tab.List>
                              <Tab.Panels className="mt-2">
                                 {categories.map((category)=>(
                                    isLoading ? 
                                      <Tab.Panel key={category.value}>Loading</Tab.Panel>
                                        :
                                      <Tab.Panel key={category.value} className='px-5'>
                                          <div className="grid grid-cols-6 gap-1">
                                            {products.data.map((product,index) => (
                                              <div key={index}>
                                                  <div className="bg-gray-100 flex flex-col w-full shadow-sm rounded-sm">
                                                    <Image src={product.images[0].url} width={150} height={150} objectFit="cover" className="rounded-t-sm"/>
                                                    <div className="pt-2 px-2">
                                                      <p className="text-md">
                                                        {product.name}
                                                      </p>
                                                      <p className="text-sm text-gray-400">
                                                        By {product.company}
                                                      </p>
                                                      <p className="text-sm ">
                                                        {product.price}<span className="text-blue-500 font-bold">$</span>
                                                      </p>
                                                      <div className="grid grid-cols-8 mt-1">
                                                        <div className="bg-red-500 w-full h-full">&nbsp;</div>
                                                        <div className="bg-blue-500 w-full h-full"></div>
                                                        <div className="bg-green-500 w-full h-full"></div>
                                                        <div className="bg-gray-800 w-full h-full"></div>
                                                        <div className="bg-white w-full h-full"></div>
                                                      </div>
                                                      <div className="grid grid-cols-5 text-gray-400 text-xs mt-1">
                                                        <p className="pr-1">XXS</p>
                                                        <p className="pr-1">XS</p>
                                                        <p className="pr-1">S</p>
                                                        <p className="pr-1">M</p>
                                                        <p className="pr-1">L</p>
                                                        <p className="pr-1">XL</p>
                                                        <p className="pr-1">XXL</p>
                                                        <p className="pr-1">XXXL</p>
                                                      </div>
                                                    </div>
                                                    <div className="flex justify-end mb-1 mr-1">
                                                      <button
                                                       onClick={()=>{
                                                            setProductState({id:product._id,name:product.name,price:product.price,company:product.company,images:product.images,sizes:product.sizes,genders:product.genders,ages:product.ages,category:product.category,features:product.features});
                                                            setEditProductOpen(true)
                                                        }}
                                                      >
                                                        <CogIcon className="text-gray-500 rounded-sm hover:text-blue-400 duration-100 delay-10 cursor-pointer h-5 w-5"/>
                                                      </button>
                                                      <button
                                                        onClickCapture={()=>handleDelete(product._id)}
                                                      >
                                                        <TrashIcon className="text-gray-500 rounded-sm hover:text-red-400 duration-100 delay-10 cursor-pointer h-5 w-5"/>
                                                      </button>
                                                    </div>
                                                  </div>
                                              </div>
                                            ))}
                                          </div>
                                      </Tab.Panel>
                                  ))}
                              </Tab.Panels>
                          </Tab.Group>
                      </div>
                      <div className="flex justify-end mr-2 mb-2">
                          <button
                              type="button"
                              onClick={()=>{setNewProductOpen(true)}}
                              className="inline-flex m-1 px-5 justify-center rounded-md border border-transparent bg-blue-500  py-2 items-center text-md font-medium text-white hover:bg-blue-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 duration-100 delay-10"
                          >
                                  <PlusIcon className="mr-1 h-5 w-5 text-white"/>
                                  New Product
                          </button>
                      </div>
                    </div>
                    <div>
                        <Transition appear show={isNewProductOpen} as={Fragment}>
                            <Dialog as="div" className="relative z-10" onClose={()=>setNewProductOpen(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="hidden fixed inset-0 bg-gray-700 bg-opacity-50 transition-opacity md:block" />
                                </Transition.Child>

                                <div className="fixed z-10 inset-0 overflow-y-auto">
                                    <div className="flex min-h-screen  w-screen text-center md:block md:px-2 lg:px-4" style={{ fontSize: 0 }}>
                                    {/* This element is to trick the browser into centering the modal contents. */}
                                    <span className="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">
                                        &#8203;
                                    </span>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                                <Dialog.Panel className="flex my-5 text-base text-left transform transition shadow-2xl md:inline-block md:max-w-2xl md:mx-4 md:align-middle lg:max-w-7xl">
                                                    <div className="w-full relative flex items-center rounded-xl bg-white overflow-hidden shadow-2xl">
                                                    <div className="grid grid-cols-3 rounded-lg shadow-xl">
                                                        <div className="flex rounded-l-lg items-center justify-center text-center bg-[url('/1.jpg')] bg-cover bg-right">
                                                        </div>
                                                        <div className="col-span-2 py-20 px-5">
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="flex flex-col items-start">
                                                                <div className="grid gap-6 w-full">
                                                                    <div>
                                                                        <h1 className="text-gray-500 py-5 text-4xl font-semibold">
                                                                            Add New Product
                                                                        </h1>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="name" className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Title</span>
                                                                        </label>
                                                                        <input id="name" name="name" type="text" placeholder="Name your product" className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                        focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                        invalid:border-pink-500 invalid:text-pink-600
                                                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                        "/>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="company" className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Brand</span>
                                                                        </label>
                                                                        <input type="text" name="company" placeholder="Brand name" className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                        focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                        invalid:border-pink-500 invalid:text-pink-600
                                                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                        "/>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="category" className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Category</span>
                                                                        </label>
                                                                        <Listbox id="category" name="category"  value={selectedCategory.name} onChange={setSelectedCategory}>
                                                                        <div className="relative mt-1">
                                                                            <Listbox.Button className="text-left relative w-full cursor-default mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm text-gray-400
                                                                            focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                            ">
                                                                            <span className="block truncate">{selectedCategory.name}</span>
                                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                                <SelectorIcon
                                                                                className="h-5 w-5 text-gray-400"
                                                                                aria-hidden="true"
                                                                                />
                                                                            </span>
                                                                            </Listbox.Button>
                                                                            <Transition
                                                                            as={Fragment}
                                                                            leave="transition ease-in duration-100"
                                                                            leaveFrom="opacity-100"
                                                                            leaveTo="opacity-0"
                                                                            >
                                                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                                {categories.map((person, personIdx) => (
                                                                                <Listbox.Option
                                                                                    key={personIdx}
                                                                                    className={({ active }) =>
                                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                                        active ? 'bg-gray-100 text-gray-500' : 'text-gray-500'
                                                                                    }`
                                                                                    }
                                                                                    value={person}
                                                                                >
                                                                                    {({ selected }) => (
                                                                                    <>
                                                                                        <span
                                                                                        className={`block truncate ${
                                                                                            selected ? 'font-medium' : 'font-normal'
                                                                                        }`}
                                                                                        >
                                                                                        {person.name}
                                                                                        </span>
                                                                                        {selected ? (
                                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                                                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                        </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                    )}
                                                                                </Listbox.Option>
                                                                                ))}
                                                                            </Listbox.Options>
                                                                            </Transition>
                                                                        </div>
                                                                        </Listbox>
                                                                    </div>
                                                                    <div>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Genders</span>
                                                                        </label>
                                                                        <div className="flex flex-row">
                                                                            {
                                                                                genders.map((option,optionIdx)=>(
                                                                                    <div key={option.value} className="flex mt-2 mr-5 items-center">
                                                                                        <input
                                                                                        id={`filter-mobile-${optionIdx}`}
                                                                                        name="gender"
                                                                                        defaultValue={option.value}
                                                                                        type="checkbox"
                                                                                        defaultChecked={option.checked}
                                                                                        className="h-5 w-5 border-gray-300 rounded text-blue-500 focus:ring-blue-500"
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`filter-mobile-${optionIdx}`}
                                                                                            className="ml-3 min-w-0 flex-1 text-gray-400"
                                                                                        >
                                                                                            {option.name}
                                                                                        </label>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Age groups</span>
                                                                        </label>
                                                                        <div className="flex flex-row">
                                                                            {
                                                                                ageGroups.map((option,optionIdx)=>(
                                                                                    <div key={option.value} className="flex mt-2 mr-5 items-center">
                                                                                        <input
                                                                                        id={`filter-mobile-${optionIdx}`}
                                                                                        name="age"
                                                                                        defaultValue={option.value}
                                                                                        type="checkbox"
                                                                                        defaultChecked={option.checked}
                                                                                        className="h-5 w-5 border-gray-300 rounded text-blue-500 focus:ring-blue-500"
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`filter-mobile-${optionIdx}`}
                                                                                            className="ml-3 min-w-0 flex-1 text-gray-400"
                                                                                        >
                                                                                            {option.name}
                                                                                        </label>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="features" className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Features</span>
                                                                        </label>
                                                                        <textarea name="features" type="text" placeholder="What is special about this product" className="w-full resize-none mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                        focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                        invalid:border-pink-500 invalid:text-pink-600
                                                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                        "/>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="price" className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Price</span>
                                                                        </label>
                                                                        <input step="0.01" name="price" type="number" placeholder="Product price" className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                        focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                        invalid:border-pink-500 invalid:text-pink-600
                                                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                        "/>
                                                                    </div>
                                                                    <div>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Colors</span>
                                                                        </label>
                                                                        <input type="text" placeholder="Name your product" className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                        focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                        invalid:border-pink-500 invalid:text-pink-600
                                                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                        "/>
                                                                    </div>
                                                                    <div>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Sizes</span>
                                                                        </label>
                                                                        <div className="flex flex-row">
                                                                            {
                                                                                sizes.map((option,optionIdx)=>(
                                                                                    <div key={option.value} className="flex mt-2 mr-5 items-center">
                                                                                        <input
                                                                                        id={`filter-mobile-${optionIdx}`}
                                                                                        name="size"
                                                                                        defaultValue={option.value}
                                                                                        type="checkbox"
                                                                                        defaultChecked={option.checked}
                                                                                        className="h-5 w-5 border-gray-300 rounded text-blue-500 focus:ring-blue-500"
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`filter-mobile-${optionIdx}`}
                                                                                            className="ml-3 min-w-0 flex-1 text-gray-400"
                                                                                        >
                                                                                            {option.name}
                                                                                        </label>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Images</span>
                                                                        </label>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-sm text-gray-400">(Add up to 4 images to display)</span>
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <label className="flex flex-row cursor-pointer w-fit px-2 py-1 rounded-sm items-center justify-start bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white">
                                                                                <PlusIcon className="h-4 w-4"/>
                                                                                <input
                                                                                    type="file"
                                                                                    name="file"
                                                                                    className="hidden"
                                                                                    
                                                                                    multiple
                                                                                    onChange={(e)=>{
                                                                                        const images = e.target.files;
                                                                                        setImagesSelected([]);
                                                                                        for(const image of images){
                                                                                            let reader = new FileReader();
                                                                                            reader.onload = function(onLoadEvent){
                                                                                                // console.log(onLoadEvent.target.result)
                                                                                                setImagesSelected((imagesSelected)=>[...imagesSelected,onLoadEvent.target.result]);
                                                                                            }
                                                                                            reader.readAsDataURL(image);
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                />
                                                                            </label>
                                                                        </div>
                                                                        <div className="mt-2">
                                                                            <div className="justify-left min-h-[400px] rounded-md bg-gray-100 grid grid-rows-2 grid-cols-2 gap-0 my-2">
                                                                                    {imagesSelected.length!=0 &&
                                                                                            imagesSelected.map((image,index)=><Image key={index} src={image} width={200} height={200} objectFit="cover" />) 
                                                                                    }
                                                                            </div>
                                                                            
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-5 py-3 w-full text-center">
                                                                    {loadingStatus?
                                                                        <button disabled type="button" className="w-40 disabled:opacity-50  m-1 px-5 justify-center rounded-md border border-transparent bg-blue-500  py-2 items-center text-md font-medium text-white">
                                                                            <svg role="status" className="inline w-5 h-5 text-white animate-spin mr-2" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                                                            </svg>
                                                                            Loading
                                                                        </button>
                                                                            :
                                                                    <button
                                                                        type="submit"
                                                                        className="inline-flex w-40 m-1 px-5 justify-center rounded-md border border-transparent bg-blue-500  py-2 items-center text-md font-medium text-white hover:bg-blue-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                    >
                                                                        Add to Store
                                                                    </button>
                                                                    }
                                                                    <button
                                                                        onClick={()=>setNewProductOpen(false)}
                                                                        className="w-40 inline-flex m-1 px-5 justify-center rounded-md border border-transparent bg-gray-200  py-2 text-md font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                        >
                                                                            Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                        <Transition appear show={isEditProductOpen} as={Fragment}>
                            <Dialog as="div" className="relative z-10" onClose={()=>{
                                setImagesSelected([]);
                                setEditProductOpen(false)
                                }
                            }>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="hidden fixed inset-0 bg-gray-700 bg-opacity-50 transition-opacity md:block" />
                                </Transition.Child>

                                <div className="fixed z-10 inset-0 overflow-y-auto">
                                    <div className="flex min-h-screen  w-screen text-center md:block md:px-2 lg:px-4" style={{ fontSize: 0 }}>
                                    {/* This element is to trick the browser into centering the modal contents. */}
                                    <span className="hidden md:inline-block md:align-middle md:h-screen" aria-hidden="true">
                                        &#8203;
                                    </span>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                                <Dialog.Panel className="flex my-5 text-base text-left transform transition shadow-2xl md:inline-block md:max-w-2xl md:mx-4 md:align-middle lg:max-w-7xl">
                                                    <div className="w-full relative flex items-center rounded-xl bg-white overflow-hidden shadow-2xl">
                                                    <div className="grid grid-cols-3 rounded-lg shadow-xl">
                                                        <div className="flex rounded-l-lg items-center justify-center text-center bg-[url('/1.jpg')] bg-cover bg-right">
                                                        </div>
                                                        <div className="col-span-2 py-20 px-5">
                                                        <form onSubmit={handleEdit}>
                                                            <div className="flex flex-col items-start">
                                                                <div className="grid gap-6 w-full">
                                                                    <div>
                                                                        <h1 className="text-gray-500 py-5 text-4xl font-semibold">
                                                                            Add New Product
                                                                        </h1>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="name" className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Title</span>
                                                                        </label>
                                                                        <input id="edit_name" name="name" type="text" placeholder="Name your product" value={productState.name}  onChange={(e)=>setProductState({...productState,name:e.target.value})} className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                        focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                        invalid:border-pink-500 invalid:text-pink-600
                                                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                        "/>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="company" className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Brand</span>
                                                                        </label>
                                                                        <input type="edit_text" name="company" placeholder="Brand name" value={productState.company} onChange={(e)=>setProductState({...productState,company:e.target.value})} className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                        focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                        invalid:border-pink-500 invalid:text-pink-600
                                                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                        "/>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="category" className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Category</span>
                                                                        </label>
                                                                        <Listbox id="category" name="category"  value={productState.category} onChange={setSelectedCategory}>
                                                                        <div className="relative mt-1">
                                                                            <Listbox.Button className="text-left relative w-full cursor-default mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm text-gray-400
                                                                            focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                            ">
                                                                            <span className="block truncate">{productState.category}</span>
                                                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                                                <SelectorIcon
                                                                                className="h-5 w-5 text-gray-400"
                                                                                aria-hidden="true"
                                                                                />
                                                                            </span>
                                                                            </Listbox.Button>
                                                                            <Transition
                                                                            as={Fragment}
                                                                            leave="transition ease-in duration-100"
                                                                            leaveFrom="opacity-100"
                                                                            leaveTo="opacity-0"
                                                                            >
                                                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                                {categories.map((person, personIdx) => (
                                                                                <Listbox.Option
                                                                                    key={personIdx}
                                                                                    className={({ active }) =>
                                                                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                                        active ? 'bg-gray-100 text-gray-500' : 'text-gray-500'
                                                                                    }`
                                                                                    }
                                                                                    value={person}
                                                                                >
                                                                                    {({ selected }) => (
                                                                                    <>
                                                                                        <span
                                                                                        className={`block truncate ${
                                                                                            selected ? 'font-medium' : 'font-normal'
                                                                                        }`}
                                                                                        >
                                                                                        {person.name}
                                                                                        </span>
                                                                                        {selected ? (
                                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                                                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                                        </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                    )}
                                                                                </Listbox.Option>
                                                                                ))}
                                                                            </Listbox.Options>
                                                                            </Transition>
                                                                        </div>
                                                                        </Listbox>
                                                                    </div>
                                                                    <div>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Genders</span>
                                                                        </label>
                                                                        <div className="flex flex-row">
                                                                            {
                                                                                genders.map((option,optionIdx)=>(
                                                                                    <div key={option.value} className="flex mt-2 mr-5 items-center">
                                                                                        <input
                                                                                        id={`filter-mobile-${optionIdx}`}
                                                                                        name="gender"
                                                                                        defaultValue={option.value}
                                                                                        type="checkbox"
                                                                                        defaultChecked={productState.genders.includes(option.value)}
                                                                                        className="h-5 w-5 border-gray-300 rounded text-blue-500 focus:ring-blue-500"
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`filter-mobile-${optionIdx}`}
                                                                                            className="ml-3 min-w-0 flex-1 text-gray-400"
                                                                                        >
                                                                                            {option.name}
                                                                                        </label>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Age groups</span>
                                                                        </label>
                                                                        <div className="flex flex-row">
                                                                            {
                                                                                ageGroups.map((option,optionIdx)=>(
                                                                                    <div key={option.value} className="flex mt-2 mr-5 items-center">
                                                                                        <input
                                                                                        id={`filter-mobile-${optionIdx}`}
                                                                                        name="age"
                                                                                        defaultValue={option.value}
                                                                                        type="checkbox"
                                                                                        defaultChecked={productState.ages.includes(option.value)}
                                                                                        className="h-5 w-5 border-gray-300 rounded text-blue-500 focus:ring-blue-500"
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`filter-mobile-${optionIdx}`}
                                                                                            className="ml-3 min-w-0 flex-1 text-gray-400"
                                                                                        >
                                                                                            {option.name}
                                                                                        </label>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="features" className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Features</span>
                                                                        </label>
                                                                        <textarea name="features" type="text" placeholder="What is special about this product" value={productState.features} onChange={(e)=>setProductState({...productState,features:e.target.value})} className="w-full resize-none mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                        focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                        invalid:border-pink-500 invalid:text-pink-600
                                                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                        "/>
                                                                    </div>
                                                                    <div>
                                                                        <label htmlFor="price" className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Price</span>
                                                                        </label>
                                                                        <input step="0.01" name="price" type="number" placeholder="Product price" value={productState.price} onChange={(e)=>setProductState({...productState,price:e.target.value})}  className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                        focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                        invalid:border-pink-500 invalid:text-pink-600
                                                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                        "/>
                                                                    </div>
                                                                    <div>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Colors</span>
                                                                        </label>
                                                                        <input type="text" placeholder="Name your product" className="w-full mt-2 px-3 py-2 bg-white border border-slate-300 rounded-md text-md shadow-sm placeholder-slate-400
                                                                        focus:outline-none focus:border-ble-500 focus:ring-1 focus:ring-blue-500
                                                                        invalid:border-pink-500 invalid:text-pink-600
                                                                        focus:invalid:border-pink-500 focus:invalid:ring-pink-500
                                                                        "/>
                                                                    </div>
                                                                    <div>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Sizes</span>
                                                                        </label>
                                                                        <div className="flex flex-row">
                                                                            {
                                                                                sizes.map((option,optionIdx)=>(
                                                                                    <div key={option.value} className="flex mt-2 mr-5 items-center">
                                                                                        <input
                                                                                        id={`filter-mobile-${optionIdx}`}
                                                                                        name="size"
                                                                                        defaultValue={option.value}
                                                                                        type="checkbox"
                                                                                        defaultChecked={productState.sizes.filter((sizeData)=>sizeData.size==option.value).length!=0?true:false}
                                                                                        className="h-5 w-5 border-gray-300 rounded text-blue-500 focus:ring-blue-500"
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`filter-mobile-${optionIdx}`}
                                                                                            className="ml-3 min-w-0 flex-1 text-gray-400"
                                                                                        >
                                                                                            {option.name}
                                                                                        </label>
                                                                                    </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-lg font-medium text-gray-700">Images</span>
                                                                        </label>
                                                                        <label className="flex flex-col w-full">
                                                                            <span className="text-sm text-gray-400">(Add up to 4 images to display)</span>
                                                                        </label>
                                                                        <div className="mt-2">
                                                                            <label className="flex flex-row cursor-pointer w-fit px-2 py-1 rounded-sm items-center justify-start bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white">
                                                                                <PlusIcon className="h-4 w-4"/>
                                                                                <input
                                                                                    type="file"
                                                                                    name="file"
                                                                                    className="hidden"
                                                                                    multiple
                                                                                    onChange={(e)=>{
                                                                                        const images = e.target.files;
                                                                                        setImagesSelected([]);
                                                                                        for(const image of images){
                                                                                            let reader = new FileReader();
                                                                                            reader.onload = function(onLoadEvent){
                                                                                                // console.log(onLoadEvent.target.result)
                                                                                                setImagesSelected((imagesSelected)=>[...imagesSelected,onLoadEvent.target.result]);
                                                                                            }
                                                                                            reader.readAsDataURL(image);
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                />
                                                                            </label>
                                                                        </div>
                                                                        <div className="mt-2">
                                                                            <div className="justify-left min-h-[400px] rounded-md bg-gray-100 grid grid-rows-2 grid-cols-2 gap-0 my-2">
                                                                                    {imagesSelected.length !=0 ?imagesSelected.map((image,index)=><Image key={index} src={image} width={200} height={200} objectFit="cover" />) 
                                                                                            :
                                                                                        productState.images.map((image,index)=><Image key={index} src={image.url} width={200} height={200} objectFit="cover" />) 
                                                                                    }
                                                                            </div>
                                                                            
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mt-5 py-3 w-full text-center">
                                                                    {loadingStatus?
                                                                        <button disabled type="button" className="w-40 disabled:opacity-50  m-1 px-5 justify-center rounded-md border border-transparent bg-blue-500  py-2 items-center text-md font-medium text-white">
                                                                            <svg role="status" className="inline w-5 h-5 text-white animate-spin mr-2" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                                                            </svg>
                                                                            Loading
                                                                        </button>
                                                                            :
                                                                    <button
                                                                        type="submit"
                                                                        className="inline-flex w-40 m-1 px-5 justify-center rounded-md border border-transparent bg-blue-500  py-2 items-center text-md font-medium text-white hover:bg-blue-400  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                    >
                                                                        Add to Store
                                                                    </button>
                                                                    }
                                                                    <button
                                                                        type="button"
                                                                        onClick={()=>{
                                                                                setImagesSelected([]);
                                                                                setEditProductOpen(false);
                                                                            }}
                                                                        className="w-40 inline-flex m-1 px-5 justify-center rounded-md border border-transparent bg-gray-200  py-2 text-md font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                        >
                                                                            Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                    </div>
                    {successAlertState && <AlertSuccess isOpen={successAlertState} setIsOpen={setSuccessAlertState} info={"Product has been succesfully added to the store!"}/>}
              </div>
          )
  }

