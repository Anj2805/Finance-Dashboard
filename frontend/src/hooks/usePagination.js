import { useCallback, useState } from 'react'

const usePagination = ({ initialPage = 1, initialPageSize = 10 } = {}) => {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [total, setTotal] = useState(0)

  const updateTotal = useCallback((value) => setTotal(value), [])
  const onPageChange = useCallback((value) => setPage(value), [])
  const onPageSizeChange = useCallback((value) => {
    setPageSize(value)
    setPage(1)
  }, [])

  const totalPages = total ? Math.ceil(total / pageSize) : 0

  return {
    page,
    pageSize,
    total,
    totalPages,
    setTotal: updateTotal,
    onPageChange,
    onPageSizeChange
  }
}

export default usePagination
