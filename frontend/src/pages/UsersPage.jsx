import { useEffect, useState } from 'react'
import Table from '../components/common/Table'
import Select from '../components/common/Select'
import Button from '../components/common/Button'
import { getUsers, updateUserRole, updateUserStatus } from '../services/userService'
import { ROLES, STATUS } from '../utils/constants'
import { useUI } from '../context/UIContext'

const UsersPage = () => {
  const { showToast } = useUI()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await getUsers()
      const userList = data?.data?.users || data?.users || data || []
      setUsers(Array.isArray(userList) ? userList : [])
    } catch (error) {
      showToast('Unable to load users', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (user, nextRole) => {
    try {
      await updateUserRole(user.id || user._id, nextRole)
      showToast('Role updated', 'success')
      fetchUsers()
    } catch (error) {
      showToast(error?.response?.data?.message || 'Unable to update role', 'error')
    }
  }

  const handleStatusChange = async (user, nextStatus) => {
    try {
      await updateUserStatus(user.id || user._id, nextStatus)
      showToast('Status updated', 'success')
      fetchUsers()
    } catch (error) {
      showToast(error?.response?.data?.message || 'Unable to update status', 'error')
    }
  }

  const columns = [
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      render: (value, record) => (
        <Select value={value} onChange={(e) => handleRoleChange(record, e.target.value)}>
          {Object.values(ROLES).map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </Select>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (value, record) => (
        <Select value={value} onChange={(e) => handleStatusChange(record, e.target.value)}>
          {Object.values(STATUS).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </Select>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, record) => (
        <Button size="sm" onClick={() => handleStatusChange(record, record.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE)}>
          {record.status === STATUS.ACTIVE ? 'Deactivate' : 'Activate'}
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">User Management</h1>
        <p className="text-sm text-slate-500">Manage system access and roles.</p>
      </div>
      {loading ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
          Loading users...
        </div>
      ) : (
        <Table columns={columns} data={users} />
      )}
    </div>
  )
}

export default UsersPage
