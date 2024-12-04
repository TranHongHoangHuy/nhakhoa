import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } =
    useContext(AdminContext);
  const navigate = useNavigate();

  // State để quản lý tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  useEffect(() => {
    // Tự động cập nhật kết quả tìm kiếm khi danh sách bác sĩ thay đổi
    setFilteredDoctors(doctors);
  }, [doctors]);

  const handleSearch = (searchTerm) => {
    const filtered = doctors.filter((doctor) =>
      Object.values(doctor).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredDoctors(filtered);
  };

  const handleAddDoctor = () => {
    navigate("/add-doctor");
  };

  const columns = [
    {
      name: "Tên bác sĩ",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Thông tin",
      selector: (row) => row.about,
      cell: (row) => (
        <div
          className="whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
          title={row.about}
        >
          {row.about}
        </div>
      ),
    },
    {
      name: "Kinh nghiệm",
      selector: (row) => row.experience,
      sortable: true,
    },
    {
      name: "Địa chỉ",
      selector: (row) => row.address,
    },
    {
      name: "Ảnh",
      cell: (row) => (
        <img
          src={row.image}
          alt={row.name}
          className="w-24 h-auto object-cover rounded"
        />
      ),
    },
    {
      name: "Sẵn sàng",
      cell: (row) => (
        <input
          type="checkbox"
          checked={row.available}
          onChange={() => changeAvailability(row.id)}
        />
      ),
    },
    {
      name: "Thao tác",
      cell: (row) => (
        <button
          onClick={() =>
            navigate(`/edit-doctor/${row.id}`, { state: { doctor: row } })
          }
          className="text-blue-500 underline"
        >
          Chỉnh sửa
        </button>
      ),
    },
  ];

  return (
    <div className="m-5 w-full max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">Danh sách bác sĩ</h1>
      <button
        onClick={handleAddDoctor}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Thêm Bác sĩ Mới
      </button>

      {/* Sử dụng DataTable */}
      <DataTable
        columns={columns}
        data={filteredDoctors}
        pagination
        highlightOnHover
        fixedHeader
        // fixedHeaderScrollHeight="400px"
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Tìm kiếm tất cả thông tin..."
            className="w-full p-2 border"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        }
        noDataComponent="Không có dữ liệu"
      />
    </div>
  );
};

export default DoctorsList;
