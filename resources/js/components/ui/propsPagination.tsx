import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { router } from '@inertiajs/react'

const PropsPagination = ({ meta }) => {
  return (
    <Pagination>
      {meta.links.map((link) => (
        <PaginationItem key={link.url}>
          <PaginationLink href='#' onClick={()=> router.get(link.url,{
            // preserveState: true,
            // preserveScroll: true,
            // only: ['products'],
          })} active={link.active} dangerouslySetInnerHTML={{__html: link.label }}/>
        </PaginationItem>
      ))}
    </Pagination>
  )
}

export default PropsPagination