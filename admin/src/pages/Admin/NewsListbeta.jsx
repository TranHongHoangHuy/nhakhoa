import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import DataTable from "react-data-table-component";

const NewsListBeta = () => {
  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);

  // Lấy danh sách tin tức
  const fetchNews = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/service/newlist`, {
        headers: { aToken },
      });
      setNews(data.news || []);
      setFilteredNews(data.news || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách tin tức");
      console.error(error);
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchNews();
    }
  }, [aToken]);

  // Xử lý tìm kiếm
  const handleSearch = (searchTerm) => {
    const filtered = news.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredNews(filtered);
  };

  // Cột của React Data Table
  const columns = [
    {
      name: "Tiêu đề",
      selector: (row) => row.title,
      sortable: true,
      width: "15%",
    },
    {
      name: "Hình ảnh",
      cell: (row) => (
        <img
          src={row.image}
          alt={row.title}
          className="w-24 h-16 object-cover rounded"
        />
      ),
      width: "10%",
    },
    {
      name: "Mô tả ngắn",
      selector: (row) => row.shortdes,
      sortable: false,
      width: "15%",
    },
    {
      name: "Thao tác",
      cell: (row) => (
        <Link to={`/edit-news/${row.id}`} className="text-blue-500">
          Chỉnh sửa
        </Link>
      ),
      width: "15%",
    },
  ];

  return (
    <div className="m-5 max-w-90 overflow-x-auto">
      <button
        onClick={() => navigate("/add-news")}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Thêm Tin tức Mới
      </button>
      <DataTable
        title="Danh sách tin tức"
        columns={columns}
        data={filteredNews}
        pagination
        responsive
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
    </div>
  );
};

export default NewsListBeta;
