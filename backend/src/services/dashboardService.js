import Record from '../models/Record.js'

const baseMatchStage = { $match: { isDeleted: false } }

export const getSummary = async () => {
  const [aggregates, recentTransactions] = await Promise.all([
    Record.aggregate([
      baseMatchStage,
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]),
    Record.find({ isDeleted: false }).sort({ date: -1 }).limit(5)
  ])

  const totals = aggregates.reduce(
    (acc, item) => {
      if (item._id === 'income') acc.totalIncome = item.total
      if (item._id === 'expense') acc.totalExpense = item.total
      return acc
    },
    { totalIncome: 0, totalExpense: 0 }
  )

  return {
    totalIncome: totals.totalIncome,
    totalExpense: totals.totalExpense,
    netBalance: totals.totalIncome - totals.totalExpense,
    recentTransactions
  }
}

export const getCategoryBreakdown = async () => {
  const categories = await Record.aggregate([
    baseMatchStage,
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' }
      }
    },
    { $project: { _id: 0, category: '$_id', total: 1 } },
    { $sort: { total: -1 } }
  ])
  return categories
}

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' })

export const getMonthlyTrends = async () => {
  const trends = await Record.aggregate([
    baseMatchStage,
    {
      $group: {
        _id: { month: { $dateToString: { format: '%Y-%m', date: '$date' } }, type: '$type' },
        total: { $sum: '$amount' }
      }
    },
    {
      $group: {
        _id: '$_id.month',
        breakdown: {
          $push: {
            k: '$_id.type',
            v: '$total'
          }
        }
      }
    },
    {
      $project: {
        monthKey: '$_id',
        totals: { $arrayToObject: '$breakdown' }
      }
    },
    { $sort: { monthKey: 1 } }
  ])

  return trends
    .filter((item) => item.monthKey)
    .map((item) => {
      const [year, month] = item.monthKey.split('-')
      const formattedMonth = monthFormatter.format(new Date(Number(year), Number(month) - 1))
      return {
        month: formattedMonth,
        income: item.totals?.income || 0,
        expense: item.totals?.expense || 0
      }
    })
}
