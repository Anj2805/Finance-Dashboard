import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import Filters from '../components/records/Filters'
import Pagination from '../components/records/Pagination'
import Modal from '../components/common/Modal'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { getRecords, deleteRecord } from '../services/recordsService'
import { formatCurrency, formatDate } from '../utils/format'
import usePagination from '../hooks/usePagination'

const RecordsPage = () => {
  const { showToast } = useUI()
  const { isAdmin } = useAuth()
  const [records, setRecords] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const { page, pageSize, totalPages, onPageChange, onPageSizeChange, setTotal } = usePagination({ initialPageSize: 10 })

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getRecords({
        ...filters,
        page,
        limit: pageSize
      })
      const payload = response.data?.data || response.data || {}
      setRecords(payload.records || [])
      setTotal(payload.pagination?.total || payload.total || 0)
    } catch (error) {
      showToast('Unable to load records', 'error')
    } finally {
      setLoading(false)
    }
  }, [filters, page, pageSize, setTotal, showToast])

  useEffect(() => {
    fetchRecords()
  }, [fetchRecords])

  const categories = useMemo(() => Array.from(new Set(records.map((record) => record.category))), [records])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteRecord(deleteId)
      showToast('Record deleted', 'success')
      setDeleteId(null)
      fetchRecords()
    } catch (error) {
      showToast('Unable to delete record', 'error')
    }
  }

  const columns = [
    { key: 'category', title: 'Category', dataIndex: 'category' },
    { key: 'type', title: 'Type', dataIndex: 'type' },
    { key: 'amount', title: 'Amount', dataIndex: 'amount', render: (value) => formatCurrency(value) },
    { key: 'date', title: 'Date', dataIndex: 'date', render: formatDate },
    { key: 'note', title: 'Notes', dataIndex: 'note' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Records</h1>
          <p className="text-sm text-slate-500">Explore and manage financial entries.</p>
        </div>
        {isAdmin && (
          <Button as={Link} to="/records/new">
            Add Record
          </Button>
        )}
      </div>

      <Filters
        filters={filters}
        onChange={(nextFilters) => {
          setFilters(nextFilters)
          onPageChange(1)
        }}
        categories={categories}
      />

      {loading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
          Loading records...
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={records}
            renderActions={
              isAdmin
                ? (record) => {
                    const recordId = record.id || record._id
                    return (
                      <div className="flex items-center justify-end gap-2">
                        <Button as={Link} to={`/records/${recordId}`} variant="secondary" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteId(recordId)}>
                          Delete
                        </Button>
                      </div>
                    )
                  }
                : undefined
            }
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} pageSize={pageSize} onPageSizeChange={onPageSizeChange} />
        </>
      )}

      <Modal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete record"
        description="Are you sure you want to delete this entry?"
        confirmText="Delete"
      />
    </div>
  )
}

export default RecordsPage
