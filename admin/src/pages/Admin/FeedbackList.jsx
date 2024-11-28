import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const FeedbackList = () => {
  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const [feedbacks, setFeedbacks] = useState([]);
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
          feedbackId: currentFeedback.id, // Đổi "id" thành "feedbackId"
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

  const renderStars = (rate) => {
    return Array(rate)
      .fill(0)
      .map((_, i) => (
        <span key={i} className="star-icon">
          &#9733;
        </span>
      ));
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      {/* Danh sách feedbacks */}
      <table
        className="border border-[#C9D8FF] text-left text-sm lg:text-base"
        style={{ width: "900px", margin: "0 auto" }}
      >
        <thead>
          <tr className="bg-[#EAEFFF] text-left">
            <th className="p-4 border-b border-[#C9D8FF]">Tên dịch vụ</th>
            <th className="p-4 border-b border-[#C9D8FF]">Khách hàng</th>
            <th className="p-4 border-b border-[#C9D8FF]">Đánh giá</th>
            <th className="p-4 border-b border-[#C9D8FF]">Phản hồi</th>
            <th className="p-4 border-b border-[#C9D8FF]">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback, index) => (
            <tr key={index} className="hover:bg-[#F7FAFC]">
              <td className="p-4 border-b border-[#C9D8FF]">
                {feedback.title}
              </td>
              <td className="p-4 border-b border-[#C9D8FF]">{feedback.name}</td>
              <td className="p-4 border-b border-[#C9D8FF] feedback-stars">
                {renderStars(feedback.rate)}
              </td>
              <td className="p-4 border-b border-[#C9D8FF]">
                {feedback.comment}
              </td>
              <td className="p-4 border-b border-[#C9D8FF]">
                <button
                  onClick={() => openModal(feedback)}
                  className="text-blue-500"
                >
                  Chỉnh sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} sao
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleSaveFeedback}
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                Lưu
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

      <style jsx>{`
        .feedback-stars {
          color: #f5c518;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default FeedbackList;
