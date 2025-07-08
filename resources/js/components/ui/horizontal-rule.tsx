import { cn } from '@/lib/utils'
import React from 'react'

const HorizontalRule = ({
    className
}:{
    className?: React.CSSProperties
}) => {
  return (
    <hr className={cn("h-px my-4 muted-foreground",className)} />
  )
}

export default HorizontalRule