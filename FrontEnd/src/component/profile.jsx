import React from 'react'
import Profileedit from './Profileedit'
import { useSelector } from 'react-redux'

const profile = () => {
  const user = useSelector((state)=>state.user)
  console.log(user);
  
  return (
   user&&( <div className='min-h-screen  '>
      <Profileedit user={user.data}/>
    </div>)
  )
}

export default profile
