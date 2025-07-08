import { cn } from '@/lib/utils'
import React from 'react'

type H1Props = React.HTMLAttributes<HTMLHeadingElement> & {
  children?: React.ReactNode
  style?: React.CSSProperties
  className?: string
}

const H1 = ({
  children,
  style,
  className = 'text-xl md:text-3xl lg:text-4xl font-semibold',
  ...props
}: H1Props) => {
  return (
    <h1 {...props} style={style} className={cn(className)}>
      {children}
    </h1>
  )
}

export default H1