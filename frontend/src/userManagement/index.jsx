import React, { useEffect, useState } from "react";
import axios from "axios";
import ListComponent from "../component/table/listComponent";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const headers = ["email", "role"];

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
    <>
      <ListComponent items={users} title={"User"} headers={headers} />
    </>
  );
};

export default UserManagement;
