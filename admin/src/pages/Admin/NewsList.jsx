import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import DataTable from "react-data-table-component";

const NewsList = () => {
  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]); // Dữ liệu đã lọc
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách dịch vụ
  const fetchServices = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/service/newlist`, {
        headers: { aToken },
      });
      setServices(data.news || []);
      setFilteredNews(data.news || []); // Cập nhật dữ liệu lọc ban đầu
    } catch (error) {
      toast.error("Lỗi khi tải danh sách dịch vụ");
      console.error(error);
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchServices();
    }
  }, [aToken]);

  // Tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filteredData = services.filter((service) =>
      service.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNews(filteredData);
  };

  // Cột dữ liệu
  const columns = [
    {
      name: "Tiêu đề",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Hình ảnh",
      cell: (row) => (
        <img
          src={row.image}
          alt={row.title}
          className="w-36 h-24 object-cover rounded"
        />
      ),
    },
    {
      name: "Mô tả ngắn",
      cell: (row) => (
        <button
          onClick={() => openModal(row.shortdes)} // Gọi modal
          className="text-blue-500 underline"
        >
          Xem
        </button>
      ),
    },
    {
      name: "Thao tác",
      cell: (row) => (
        <button
          onClick={() => navigate(`/edit-news/${row.id}`, { state: row })} // Điều hướng chỉnh sửa
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Chỉnh sửa
        </button>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  // Hàm mở modal
  const openModal = (shortdes) => {
    setModalContent(shortdes);
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  return (
    <div className="m-5 w-full">
      <h1 className="text-lg font-medium">Danh sách tin tức</h1>
      <button
        onClick={() => navigate("/add-news")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Thêm Tin tức Mới
      </button>

      {/* Bảng dữ liệu */}
      <DataTable
        columns={columns}
        data={filteredNews}
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
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        }
      />

      {/* Modal hiển thị nội dung */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Mô tả ngắn</h3>
            <p>{modalContent}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsList;
