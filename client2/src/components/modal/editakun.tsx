import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

const EditUserModal: React.FC<{
  userId: String;
  role: String;
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose, userId }) => {
  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    no_induk: '',
    penjurusan: '',
    no_telp: '',
    password: '',
    role: '',
  });
  const initialFormData = {
    username: '',
    nama: '',
    no_induk: '',
    penjurusan: '',
    no_telp: '',
    password: '',
    role: '',
  };
  const handleClearForm = () => {
    setFormData(initialFormData);
  };

  const [userRole, setUserRole] = useState('');

  //fetct data
  useEffect(() => {
    // Retrieve the user's role from localStorage
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setUserRole(storedRole);
    }

    // Fetch user data when userId is available and modal is open
    if (userId && isOpen) {
      fetchUserData();
    }
  }, [userId, isOpen]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${userId}`);
      setFormData(response.data); // Set form data with the fetched user data
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  //end fetch data

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const result = await axios.patch(
        `http://localhost:5000/user/${userId}`,
        formData,
      );

      if (result.status === 201) {
        onClose(); // Close the modal only if the status is 201
      }
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error if needed
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Role</option>
              {userRole === 'Asisten Lab' && (
                <option value="Mahasiswa">Mahasiswa</option>
              )}
              {userRole === 'Dosen' && (
                <>
                  <option value="Dosen">Dosen</option>
                  <option value="Asisten Lab">Asisten Lab</option>
                  <option value="Mahasiswa">Mahasiswa</option>
                </>
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nama
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              NIP / NPM
            </label>
            <input
              type="text"
              name="no_induk"
              value={formData.no_induk}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              required
            />
          </div>

          {formData.role === 'Mahasiswa' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Penjurusan
              </label>
              <input
                type="text"
                name="penjurusan"
                value={formData.penjurusan}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
          )}

          {formData.role === 'Asisten Lab' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                No Telepon
              </label>
              <input
                type="text"
                name="no_telp"
                value={formData.no_telp}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                onClose();
                handleClearForm();
              }}
              className="mr-2 py-2 px-4 border border-gray-300 rounded-md text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
