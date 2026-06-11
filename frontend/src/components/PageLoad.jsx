import React from 'react';
import {LoaderIcon} from "lucide-react";

function PageLoad() {
  return (
    <div className='flex flex-col justify-center items-center p-4 min-h-screen'>
      <LoaderIcon className='size-10 animate-spin'></LoaderIcon>
    </div>
  )
}

export default PageLoad
