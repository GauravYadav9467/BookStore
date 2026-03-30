import { useState } from 'react'

import './App.css'

function App() {
  return (
    <>
    <div className="body">
      <div className='nav flex place-content-around bg-gray-200 pt-8 items-center align-middle h-16'>
        <div className="sName text-4xl pl-5">
          <h2>BookStore</h2>
        </div>
        <div className="relative w-72 ">
          <input type="text" placeholder="Search..." className="w-full p-2 pr-12 border rounded"/>
          <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded">Go</button>
        </div>
        <div className="utils flex gap-8 pr-5">
          <button className="mr-4">Profile</button>
          <button>Wishlist</button>
          <button>Cart</button>
        </div>
      </div>
      <div className="content">
        <p>Welcome to the BookStore!</p>
      </div>
      <div className="grid grid-cols-4 gap-9 bg-linear-to-b from-[#0f1f3b] to-[#0a1528] px-11.5 py-8.5 text-[#e9eefc] max-[980px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:p-6">
        <div className="text-[#e9eefc]">
          <h3 className="mb-2.5 text-[26px] font-bold text-white">BookStore</h3>
          <p className="mb-3.5 max-w-70 text-sm leading-normal text-[#c6d2ec]">
            Your one-stop destination for all kinds of books. From fiction to
            non-fiction, we have it all.
          </p>
          <div className="mt-2.5 flex gap-3">
            <a href="#" aria-label="Facebook" className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2f4269] text-[13px] text-[#d8e2f8] no-underline">f</a>
            <a href="#" aria-label="Twitter" className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2f4269] text-[13px] text-[#d8e2f8] no-underline">t</a>
            <a href="#" aria-label="Instagram" className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2f4269] text-[13px] text-[#d8e2f8] no-underline">i</a>
            <a href="#" aria-label="YouTube" className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2f4269] text-[13px] text-[#d8e2f8] no-underline">y</a>
          </div>
        </div>

        <div className="text-[#e9eefc]">
          <h3 className="mb-3 text-[26px] font-bold text-white">Quick Links</h3>
          <ul className="m-0 list-none space-y-1.75 p-0">
            <li><a href="#" className="text-[15px] text-[#c6d2ec] no-underline transition-colors duration-200 hover:text-white">All Books</a></li>
            <li><a href="#" className="text-[15px] text-[#c6d2ec] no-underline transition-colors duration-200 hover:text-white">Bestsellers</a></li>
            <li><a href="#" className="text-[15px] text-[#c6d2ec] no-underline transition-colors duration-200 hover:text-white">New Arrivals</a></li>
            <li><a href="#" className="text-[15px] text-[#c6d2ec] no-underline transition-colors duration-200 hover:text-white">Deals &amp; Offers</a></li>
          </ul>
        </div>

        <div className="text-[#e9eefc]">
          <h3 className="mb-3 text-[26px] font-bold text-white">Customer Service</h3>
          <ul className="m-0 list-none space-y-1.75 p-0">
            <li><a href="#" className="text-[15px] text-[#c6d2ec] no-underline transition-colors duration-200 hover:text-white">Help Center</a></li>
            <li><a href="#" className="text-[15px] text-[#c6d2ec] no-underline transition-colors duration-200 hover:text-white">Track Order</a></li>
            <li><a href="#" className="text-[15px] text-[#c6d2ec] no-underline transition-colors duration-200 hover:text-white">Returns &amp; Refunds</a></li>
            <li><a href="#" className="text-[15px] text-[#c6d2ec] no-underline transition-colors duration-200 hover:text-white">Shipping Info</a></li>
          </ul>
        </div>

        <div className="text-[#e9eefc]">
          <h3 className="mb-3 text-[26px] font-bold text-white">Newsletter</h3>
          <p className="mb-3.5 max-w-70 text-sm leading-normal text-[#c6d2ec]">
            Subscribe to get special offers and updates.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <input type="email" placeholder="Your email" className="h-9.5 flex-1 rounded-lg border border-[#2f4269] bg-[#0d1b35] px-[14px] text-sm text-[#e9eefc] outline-none placeholder:text-[#8ea1c7]" />
            <button aria-label="Subscribe" className="h-9.5 w-9.5 cursor-pointer rounded-lg border-0 bg-[#1f69ff] text-base text-white">✉</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
