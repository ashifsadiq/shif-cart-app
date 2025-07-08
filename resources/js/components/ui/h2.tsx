import { cn } from '@/lib/utils'
import React, { HTMLProps } from 'react'
type H2Props = React.HTMLAttributes<HTMLHeadingElement> & {
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}
const H2 = ({
  children,
  style,
  className='text-xl md:text-xl lg:text-2xl font-semibold',
  ...props
}:H2Props) => {
  return (
    <h2 {...props} className={cn(className)}>{children}</h2>
  )
}

export default H2