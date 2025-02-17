import React, { useEffect, useState } from "react";
import axios from "axios";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        alert("Error fetching users: " + error.response.data.message);
      }
    };
    fetchUsers();
  }, []);

  const updateUserRole = async (userId, role) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/admin/users/${userId}`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Role updated successfully!");
    } catch (error) {
      alert("Error updating role: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
