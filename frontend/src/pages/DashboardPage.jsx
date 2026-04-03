import { useEffect, useState } from 'react'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import TrendsChart from '../components/charts/TrendsChart'
import { getDashboardSummary, getDashboardTrends } from '../services/dashboardService'
import { formatCurrency, formatDate } from '../utils/format'
import { useUI } from '../context/UIContext'
import Button from '../components/common/Button'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DashboardPage = () => {
  const { showToast } = useUI()
  const { isAdmin } = useAuth()
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 })
  const [recent, setRecent] = useState([])
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, trendsRes] = await Promise.all([getDashboardSummary(), getDashboardTrends()])
        const summaryPayload = summaryRes.data?.data || summaryRes.data || {}
        const trendsPayload = trendsRes.data?.data || trendsRes.data || []
        setSummary({
          income: summaryPayload.totalIncome,
          expense: summaryPayload.totalExpense,
          balance: summaryPayload.netBalance
        })
        setRecent(summaryPayload.recentTransactions || [])
        setTrends(trendsPayload || [])
      } catch (error) {
        showToast('Unable to load dashboard data', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [showToast])

  const columns = [
    { key: 'name', title: 'Category', dataIndex: 'category' },
    { key: 'type', title: 'Type', dataIndex: 'type' },
    {
      key: 'amount',
      title: 'Amount',
      dataIndex: 'amount',
      render: (value) => <span className={value >= 0 ? 'text-green-600' : 'text-red-500'}>{formatCurrency(value)}</span>
    },
    { key: 'date', title: 'Date', dataIndex: 'date', render: formatDate }
  ]

  if (loading) {
    return <div className="py-10 text-center text-slate-500">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Overview</h1>
          <p className="text-sm text-slate-500">Monitor your finances and recent activity.</p>
        </div>
        {isAdmin && (
          <Button as={Link} to="/records/new">
            Add Record
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Total Income" value={formatCurrency(summary.income)} />
        <Card title="Total Expense" value={formatCurrency(summary.expense)} />
        <Card title="Net Balance" value={formatCurrency(summary.balance)} />
      </div>

      <TrendsChart data={trends} />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Link to="/records" className="text-sm text-blue-600">
            View all
          </Link>
        </div>
        <Table columns={columns} data={recent} />
      </div>
    </div>
  )
}

export default DashboardPage
