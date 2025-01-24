import React from 'react'
import { FaLocationArrow } from "react-icons/fa";


type Props = {
  id: string,
  name: string,
  description: string,
  image: string,
  location: string,
}

const MarketCard = (props: Props) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="text-lg border border-gray-300 rounded-lg">
          <a href={`/markets/${props.id}`}>
          <div className='w-full h-56 overflow-hidden flex justify-center items-center rounded-tl-md rounded-tr-md'>
          <img src={props.image} alt={props.name} className='hover:scale-125 transition-all duration-200 delay-100'/>
          </div>
          </a>
          <div className='flex w-full justify-between p-2'>
            <h2>{props.name}</h2>
            <p className='text-[12px] text-blue-950 font-medium flex items-center gap-1'><FaLocationArrow className='text-[12px]'/>
            {props.location}</p>
          </div>
          <p className='p-2'>{props.description}</p>
        </div>
        </div>
    </div>
  )
}

export default MarketCard