import { HStack, Button, Text } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <HStack justify="center" gap={2} mt={6}>
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <LuChevronLeft />
        Previous
      </Button>
      <Text fontSize="sm" color="fg.muted" px={2}>
        Page {page} of {totalPages}
      </Text>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <LuChevronRight />
      </Button>
    </HStack>
  )
}

export default Pagination
