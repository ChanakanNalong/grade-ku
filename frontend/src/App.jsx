import React, {useState, useEffect} from 'react'

export default function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch(import.meta.env.VITE_API+'/old_users')
      .then(res => res.json())
      .then(result => {
        setUsers(result)
        console.log(result)
      })
      .catch(err => console.error("Error fetching users:", err))
  }, []) // เพิ่ม [] ให้รันครั้งเดียว
  
  return (
    <div>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.id} {user.name} {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
