import React from 'react'

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
        <div className="p-2 text-lg border border-gray-300 rounded-lg">
          <a href={`/markets/${props.id}`}>
          <div className='w-full h-56 overflow-hidden flex justify-center items-center rounded-lg'>
          <img src={props.image} alt={props.name} className='hover:scale-125 transition-all duration-200 delay-100'/>
          </div>
          </a>
          <h2>{props.name}</h2>
          <p>{props.description}</p>
          <p>{props.location}</p>
        </div>
        </div>
    </div>
  )
}

export default MarketCard