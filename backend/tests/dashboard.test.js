import request from 'supertest'
import app from '../src/app.js'

describe('Dashboard API', () => {
  let token

  const seedRecord = (payload) =>
    request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)

  beforeEach(async () => {
    const email = `admin-${Date.now()}@example.com`
    await request(app).post('/api/auth/register').send({ name: 'Admin', email, password: '123456', role: 'admin' })
    const login = await request(app).post('/api/auth/login').send({ email, password: '123456' })
    token = login.body.data.token

    await seedRecord({ amount: 5000, type: 'income', category: 'Salary', date: '2025-01-01' })
    await seedRecord({ amount: 2000, type: 'expense', category: 'Food', date: '2025-01-02' })
  })

  it('should return dashboard summary', async () => {
    const res = await request(app).get('/api/dashboard/summary').set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body?.data?.totalIncome).toBe(5000)
    expect(res.body?.data?.totalExpense).toBe(2000)
  })

  it('should return category breakdown', async () => {
    const res = await request(app).get('/api/dashboard/categories').set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body?.data?.length).toBeGreaterThan(0)
  })

  it('should return trends', async () => {
    const res = await request(app).get('/api/dashboard/trends').set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body?.data?.length).toBeGreaterThan(0)
  })
})
