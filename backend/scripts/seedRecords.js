import dotenv from 'dotenv'
import connectDB from '../src/config/db.js'
import Record from '../src/models/Record.js'
import User from '../src/models/User.js'
import { ROLES } from '../src/utils/constants.js'

dotenv.config()

const seedData = [
  { amount: 50000, type: 'income', category: 'Salary', date: '2025-01-05', note: 'Monthly salary' },
  { amount: 2000, type: 'expense', category: 'Food', date: '2025-01-06', note: 'Groceries' },
  { amount: 1500, type: 'expense', category: 'Transport', date: '2025-01-07', note: 'Fuel' },
  { amount: 3000, type: 'expense', category: 'Shopping', date: '2025-01-10', note: 'Clothes' },
  { amount: 10000, type: 'income', category: 'Freelance', date: '2025-01-15', note: 'Website project' },
  { amount: 2500, type: 'expense', category: 'Bills', date: '2025-01-18', note: 'Electricity bill' },
  { amount: 1200, type: 'expense', category: 'Entertainment', date: '2025-01-20', note: 'Movies' },
  { amount: 6000, type: 'income', category: 'Bonus', date: '2025-02-01', note: 'Performance bonus' },
  { amount: 1800, type: 'expense', category: 'Food', date: '2025-02-03', note: 'Dining out' },
  { amount: 2200, type: 'expense', category: 'Transport', date: '2025-02-05', note: 'Cab rides' },
  { amount: 52000, type: 'income', category: 'Salary', date: '2025-02-05', note: 'Monthly salary' },
  { amount: 4000, type: 'expense', category: 'Shopping', date: '2025-02-08', note: 'Electronics' },
  { amount: 3000, type: 'income', category: 'Investments', date: '2025-02-12', note: 'Stock profit' },
  { amount: 2700, type: 'expense', category: 'Bills', date: '2025-02-15', note: 'Internet + electricity' },
  { amount: 1300, type: 'expense', category: 'Entertainment', date: '2025-02-18', note: 'OTT subscriptions' },
  { amount: 55000, type: 'income', category: 'Salary', date: '2025-03-01', note: 'Monthly salary' },
  { amount: 2500, type: 'expense', category: 'Food', date: '2025-03-03', note: 'Groceries' },
  { amount: 3500, type: 'expense', category: 'Travel', date: '2025-03-06', note: 'Weekend trip' },
  { amount: 8000, type: 'income', category: 'Freelance', date: '2025-03-10', note: 'App development' },
  { amount: 2000, type: 'expense', category: 'Health', date: '2025-03-12', note: 'Doctor visit' }
]

const seedRecords = async () => {
  try {
    await connectDB()
    const adminUser = await User.findOne({ role: ROLES.ADMIN })
    if (!adminUser) {
      throw new Error('No admin user found. Please create an admin before seeding records.')
    }

    const recordsWithUser = seedData.map((item) => ({
      ...item,
      date: new Date(item.date),
      userId: adminUser._id
    }))

    await Record.insertMany(recordsWithUser)
    console.log(`Inserted ${recordsWithUser.length} records`)
  } catch (error) {
    console.error('Failed to seed records:', error.message)
  } finally {
    process.exit(0)
  }
}

seedRecords()
