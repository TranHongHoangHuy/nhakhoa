import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import DataTable from "react-data-table-component";

const FeedbackList = () => {
  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState({
    id: "",
    comment: "",
    rate: "",
  });

  // Lấy danh sách feedbacks
  const fetchFeedbacks = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/service/fblist`, {
        headers: { aToken },
      });
      setFeedbacks(data.feedbacks || []);
      setFilteredFeedbacks(data.feedbacks || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách phản hồi");
      console.error(error);
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchFeedbacks();
    }
  }, [aToken]);

  // Mở Modal chỉnh sửa
  const openModal = (feedback) => {
    setCurrentFeedback({
      id: feedback.id,
      comment: feedback.comment,
      rate: feedback.rate,
    });
    setIsModalOpen(true);
  };

  // Đóng Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Xử lý thay đổi dữ liệu trong Modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFeedback((prev) => ({ ...prev, [name]: value }));
  };

  // Lưu chỉnh sửa feedback
  const handleSaveFeedback = async () => {
    try {
      await axios.put(
        `${backendUrl}/api/service/edit-feedback`,
        {
          feedbackId: currentFeedback.id,
          comment: currentFeedback.comment,
          rate: currentFeedback.rate,
        },
        { headers: { aToken } }
      );
      toast.success("Cập nhật thành công!");
      fetchFeedbacks(); // Reload danh sách feedback
      closeModal();
    } catch (error) {
      toast.error("Lỗi khi cập nhật phản hồi");
      console.error(error);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (searchTerm) => {
    const filtered = feedbacks.filter((feedback) =>
      Object.values(feedback).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredFeedbacks(filtered);
  };

  // Hiển thị sao đánh giá
  const renderStars = (rate) =>
    Array(rate)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="star-icon text-yellow-500">
          ★
        </span>
      ));

  // Cấu hình cột cho React Data Table
  const columns = [
    { name: "Tên dịch vụ", selector: (row) => row.title, sortable: true },
    { name: "Khách hàng", selector: (row) => row.name, sortable: true },
    {
      name: "Đánh giá",
      cell: (row) => <div>{renderStars(row.rate)}</div>,
      sortable: true,
    },
    { name: "Phản hồi", selector: (row) => row.comment, sortable: false },
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
        title="Danh sách phản hồi"
        columns={columns}
        data={filteredFeedbacks}
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

      {/* Modal chỉnh sửa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded w-96">
            <h2 className="text-lg font-medium mb-4">Chỉnh Sửa Phản Hồi</h2>
            <form>
              <textarea
                name="comment"
                value={currentFeedback.comment}
                onChange={handleInputChange}
                placeholder="Phản hồi"
                className="w-full mb-2 p-2 border"
                rows="4"
              />
              <select
                name="rate"
                value={currentFeedback.rate}
                onChange={handleInputChange}
                className="w-full mb-2 p-2 border"
              >
                <option value="">Chọn đánh giá</option>
                {[1, 2, 3, 4, 5].map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSaveFeedback}
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                Cập Nhật
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

export default FeedbackList;
