import React, {useEffect, useState} from 'react'
import assets,{imagesDummyData} from "../assets/assets"
import {useContext} from 'react'
import {ChatContext} from '../../context/ChatContext'
import {AuthContext} from '../../context/AuthContext'

const RightSidebar = () => {

    const {selectedUser, messages} = useContext(ChatContext)
    const {logout, onlineUser} = useContext(AuthContext)
    const [msgImages, setMsgImages] = useState([])

    //Get all the images from the messages and set them to state
    useEffect(()=>{
        setMsgImages(
            messages.filter(msg => msg.image).map(msg => msg.image)
        )
    },[messages])

    return selectedUser && (
        <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}>
            <div className='pt-10 flex flex-col items-center text-xs font-light gap-2 mx-auto'>
                <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 rounded-full aspect-[1/1] object-cover' />
                <h1 className='px-10 font-medium text-xl flex items-center mx-auto gap-2 '>
                    {onlineUser.includes(selectedUser._id) && <p className='h-2 w-2 rounded-full bg-green-500'></p>}
                    {selectedUser.fullName}</h1>
                <p className='px-10 mx-auto'>{selectedUser.bio}</p>
            </div>
            <hr className='border-[#ffffff50] my-4' />
            <div className='px-5 text-xs'>
                <p>Media</p>
                <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
                    {msgImages.map((url,index) => (
                        <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded'>
                            <img src={url} alt="" className='rounded-md h-full object-cover' />
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={()=> logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>Logout</button>
        </div>
    )
}

export default RightSidebar