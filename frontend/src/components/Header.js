import React from 'react'
import { HiOutlineSearch, HiOutlineChat, HiOutlineBell} from 'react-icons/hi'

const Header = () => {
  return (
    <div className='bg-white h-16 px-4 flex justify-between items-center border-b border-gray-200' >
        <div className='relative'>
            {/* <HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3'/>
            <input 
                type="text" 
                placeholder='Search...' 
                className='text-sm focus:outline-none active:outline-none h-10 w-[24rem] border border-gray-300 rounded-sm pl-11 pr-4'
            /> */}
          <div className="text-gray-600">
            <small><i>AI can make mistakes. Consider checking important information</i></small>
            <small>.   </small>
            <small><i>AI can make mistakes. Consider checking important information</i></small>
          </div>
        </div>
        <div  className='flex items-center gap-2 mr-2'>
            <HiOutlineChat fontSize={20} />
            <HiOutlineBell fontSize={20}/>
        </div>
    </div>
  )
}

export default Header