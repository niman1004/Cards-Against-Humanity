import React from 'react'

function BlackCard({blackCard}) {
  return (
    <div className='bg-black w-[200px] h-[275px]  text-white flex-row rounded-lg shadow-sm shadow-white '>
      <div className='font-bold pl-2 pt-10 text-md' >{blackCard || "None"}</div>
      
    </div>
  )
}

export default BlackCard
