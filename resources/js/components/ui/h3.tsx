import { cn } from '@/lib/utils'
import React, { HTMLProps } from 'react'
type H1Props ={
    children?: React.ReactNode,
    style?: React.CSSProperties,
    className?: HTMLProps<HTMLElement>['className'];
    props?:any
}
const H3 = ({
  children,
  style,
  className='text-lg md:text-xl lg:text-2xl font-bold text-heading-3',
  ...props
}:H1Props) => {
  return (
    <h1 {...props} className={cn(className)}>{children}</h1>
  )
}

export default H3