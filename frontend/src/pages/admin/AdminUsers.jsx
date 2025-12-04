import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import './AdminUsers.css';

export default function AdminUsers(){
  const [users, setUsers] = useState([]);

  useEffect(()=>{ fetchUsers(); }, []);

  const fetchUsers = async ()=>{
    try{ const res = await axios.get('/api/admin/users'); setUsers(res.data.users || res.data); }catch(e){console.error(e)}
  };

  const toggle = async (id)=>{
    try{ await axios.put(`/api/admin/users/${id}/toggle-status`); fetchUsers(); }catch(e){console.error(e)}
  };

  return (
    <Layout>
      <div className="admin-users">
        <h1>Users</h1>
        <div className="users-list">
          {users.map(u=> (
            <div key={u._id} className="user-card">
              <div>{u.firstName} {u.lastName}</div>
              <div>{u.email}</div>
              <div><button className="btn" onClick={()=>toggle(u._id)}>{u.isActive? 'Deactivate' : 'Activate'}</button></div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
