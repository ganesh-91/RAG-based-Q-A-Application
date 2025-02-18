import React, { useEffect, useState } from "react";
import axios from "axios";
import ListComponent from "../component/table/listComponent";

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const headers = ["email", "role"];
  const [user, setUser] = useState({ email: "", password: "", name: '', role: '' });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const updateUserRole = async (user) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:3001/auth/register`,
        user,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowUserForm(false)
      fetchUsers();
    } catch (error) {
      alert("Error updating role: " + error.response.data.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateUserRole(user)
    console.log(user)
  };

  return (
    <>
      {showUserForm &&
        <div className="fixed h-full w-full top-0 left-0 z-10 bg-gray-900 bg-opacity-40">
          <div class="fixed inset-0 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 w-96 max-w-full shadow-lg transform transition-all duration-300">
              <div class="flex justify-between items-center border-b-2 border-gray-200 pb-4">
                <h2 class="text-2xl font-semibold">Create User</h2>
                <button class="text-gray-500 hover:text-gray-700 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div class="mt-6 space-y-4">
                <div class="flex flex-col space-y-4">

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={user.name}
                        onChange={(e) =>
                          setUser({ ...user, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={user.password}
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={user.role}
                        onChange={(e) =>
                          setUser({ ...user, role: e.target.value })
                        }
                      >
                        <option value='ADMIN'>ADMIN</option>
                        <option value='EDITOR'>EDITOR</option>
                        <option value='VIEWER'>VIEWER</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Sign in
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      }
      <ListComponent items={users} title={"User"} headers={headers} addEntityCb={() => { setShowUserForm(true) }} />
    </>
  );
};

export default UserManagement;
