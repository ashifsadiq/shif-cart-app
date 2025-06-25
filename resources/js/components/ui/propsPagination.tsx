import React from 'react'
import { Link, router } from '@inertiajs/react'

const PropsPagination = ({links}) => {
  // return JSON.stringify(links)
  if(links.length >3)
  return ( <div className="flex gap-x-2">
    {links.map((link, index)=><Link
      href={link.url} 
      dangerouslySetInnerHTML={{__html: link.label}} 
      className={`rounded border px-2 py-1 text-sm font-medium ${link.active ? 'bg-muted-foreground text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
     />)}
  </div>
  )
}

export default PropsPagination