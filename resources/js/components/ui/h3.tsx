import { cn } from '@/lib/utils'
import React, { HTMLProps } from 'react'
type H2Props = React.HTMLAttributes<HTMLHeadingElement> & {
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}
const H3 = ({
  children,
  style,
  className='text-lg md:text-xl lg:text-2xl font-bold text-heading-3',
  ...props
}:H2Props) => {
  return (
    <h3 {...props} className={cn(className)}>{children}</h3>
  )
}

export default H3