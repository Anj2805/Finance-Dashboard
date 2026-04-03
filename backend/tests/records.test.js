import request from 'supertest'
import app from '../src/app.js'

describe('Records API', () => {
  let token

  const createAdminAndLogin = async () => {
    const email = `admin-${Date.now()}@example.com`
    await request(app).post('/api/auth/register').send({
      name: 'Admin',
      email,
      password: '123456',
      role: 'admin'
    })
    const login = await request(app).post('/api/auth/login').send({ email, password: '123456' })
    return login.body.data.token
  }

  beforeEach(async () => {
    token = await createAdminAndLogin()
  })

  it('should create a record', async () => {
    const res = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 5000, type: 'income', category: 'Salary', date: '2025-01-01' })

    expect(res.statusCode).toBe(201)
    expect(res.body?.data?.record).toBeDefined()
  })

  it('should fetch records', async () => {
    await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 2000, type: 'expense', category: 'Food', date: '2025-01-02' })

    const res = await request(app).get('/api/records').set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body?.data?.records?.length).toBeGreaterThan(0)
  })

  it('should block non-admin from creating record', async () => {
    const email = `analyst-${Date.now()}@example.com`
    await request(app).post('/api/auth/register').send({
      name: 'Analyst',
      email,
      password: '123456',
      role: 'analyst'
    })
    const login = await request(app).post('/api/auth/login').send({ email, password: '123456' })
    const analystToken = login.body.data.token

    const res = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${analystToken}`)
      .send({ amount: 1000, type: 'income', category: 'Test', date: '2025-01-01' })

    expect(res.statusCode).toBe(403)
  })
})
