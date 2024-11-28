import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";

const UsersList = () => {
  const { backendUrl } = useContext(AppContext);
  const { users, aToken, getAllUser } = useContext(AdminContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    password: "",
  });
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    if (aToken) {
      getAllUser();
    }
  }, [aToken]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const openModal = (user = null) => {
    setIsEditMode(!!user);
    setUserData(
      user || {
        name: "",
        email: "",
        phone: "",
        address: "",
        gender: "",
        dob: "",
        password: "",
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    try {
      if (isEditMode) {
        await axios.post(
          `${backendUrl}/api/user/edit-user`,
          { ...userData, userId: userData.id },
          { headers: { aToken } }
        );
        toast.success("Thành công");
      } else {
        await axios.post(`${backendUrl}/api/user/add-user`, userData, {
          headers: { aToken },
        });
        toast.success("Thành công");
      }
      getAllUser();
      closeModal();
    } catch (error) {
      toast.error("Lỗi");
      console.error(error);
    }
  };

  const handleSearch = (searchTerm) => {
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
  };

  const columns = [
    { name: "Họ tên", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "SDT", selector: (row) => row.phone, sortable: true },
    { name: "Địa chỉ", selector: (row) => row.address, sortable: true },
    { name: "Giới tính", selector: (row) => row.gender, sortable: true },
    { name: "Ngày sinh", selector: (row) => row.dob, sortable: true },
    {
      name: "Thao tác",
      cell: (row) => (
        <button onClick={() => openModal(row)} className="text-blue-500">
          Chỉnh Sửa
        </button>
      ),
    },
  ];

  return (
    <div className="m-5 w-full">
      <DataTable
        title="Danh sách bệnh nhân"
        columns={columns}
        data={filteredUsers}
        pagination
        highlightOnHover
        fixedHeader
        fixedHeaderScrollHeight="400px"
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full p-2 border"
            onChange={(e) => handleSearch(e.target.value)}
          />
        }
      />

      {/* Modal thêm mới / chỉnh sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded w-96">
            <h2 className="text-lg font-medium mb-4">
              {isEditMode ? "Chỉnh Sửa User" : "Thêm Mới User"}
            </h2>
            <form>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Họ tên"
                className="w-full mb-2 p-2 border"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full mb-2 p-2 border"
                readOnly={isEditMode}
              />
              {/* Trường nhập mật khẩu chỉ hiển thị khi thêm mới */}
              {!isEditMode && (
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  placeholder="Mật khẩu"
                  className="w-full mb-4 p-2 border"
                />
              )}
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                placeholder="Số điện thoại"
                className="w-full mb-2 p-2 border"
              />
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                placeholder="Địa chỉ"
                className="w-full mb-2 p-2 border"
              />
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>

              <input
                type="date"
                name="dob"
                value={userData.dob}
                onChange={handleInputChange}
                placeholder="Ngày sinh"
                className="w-full mb-2 p-2 border"
              />

              <button
                type="button"
                onClick={handleSaveUser}
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                {isEditMode ? "Cập Nhật" : "Thêm Mới"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full mt-2 py-2 border"
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
