import React, { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UsersList = () => {
  const { backendUrl } = useContext(AppContext);
  const { users, aToken, getAllUser } = useContext(AdminContext);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    dob: "",
    password: "", // Thêm trường password
  });

  useEffect(() => {
    if (aToken) {
      getAllUser();
    }
  }, [aToken]);

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
        password: "", // Reset password khi mở modal
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
        // Gọi API chỉnh sửa người dùng
        await axios.post(
          `${backendUrl}/api/user/edit-user`,
          { ...userData, userId: userData.id },
          { headers: { aToken } }
        );
        toast.success("Thành công");
      } else {
        // Gọi API thêm người dùng
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

  useEffect(() => {
    const result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search)
    );
    setFilteredUsers(result);
  }, [search, users]);

  const columns = [
    {
      name: "Họ tên",
      selector: (row) => row.name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "300px",
    },
    {
      name: "SDT",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Địa chỉ",
      selector: (row) => row.address,
    },
    {
      name: "Giới tính",
      selector: (row) => row.gender,
    },
    {
      name: "Ngày sinh",
      selector: (row) => row.dob,
      sortable: true,
    },
    {
      name: "Thao tác",
      cell: (row) => (
        <button onClick={() => openModal(row)} className="text-blue-500">
          Chỉnh Sửa
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="w-full max-w-6xl m-5 overflow-y-scroll">
      <h1 className="text-lg font-medium">Danh sách bệnh nhân</h1>
      <button
        onClick={() => openModal()}
        className="mt-4 mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Thêm Mới
      </button>

      <div className="w-full max-w-6xl pt-5">
        <h1 className="text-lg font-medium mb-4">Danh sách bệnh nhân</h1>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="mb-4 px-4 py-2 border border-gray-300 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <DataTable
          columns={columns}
          data={filteredUsers}
          pagination
          highlightOnHover
          responsive
          customStyles={{
            header: {
              style: {
                fontSize: "16px", // Kích thước chữ tiêu đề
                fontWeight: "bold", // Đậm tiêu đề
                color: "#262626", // Màu chữ tiêu đề
                backgroundColor: "#EAEFFF", // Nền tiêu đề
              },
            },
            headCells: {
              style: {
                paddingLeft: "16px", // Khoảng cách bên trái
                paddingRight: "16px", // Khoảng cách bên phải
                color: "#262626", // Màu chữ
                fontSize: "14px", // Kích thước chữ
                fontWeight: "600", // Đậm
                textAlign: "left", // Căn trái
              },
            },
            rows: {
              style: {
                fontSize: "14px", // Kích thước chữ hàng
                color: "#5C5C5C", // Màu chữ
              },
            },
            cells: {
              style: {
                padding: "12px", // Khoảng cách giữa các ô
                fontSize: "14px", // Kích thước chữ trong ô
                color: "#262626", // Màu chữ
              },
            },
          }}
          className="min-w-full"
        />
      </div>

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
