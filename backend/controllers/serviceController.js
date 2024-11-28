import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API to get all services list for Frontend
const serviceList = async (req, res) => {
  try {
    const [services] = await req.app.locals.db.execute(
      "SELECT * FROM services order by id desc"
    );
    res.json({ success: true, services });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all services list for Frontend
const newList = async (req, res) => {
  try {
    const [news] = await req.app.locals.db.execute(
      "SELECT id, title, image, shortdes, description  FROM news order by id desc"
    );
    res.json({ success: true, news });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all feedbaks
const fbList = async (req, res) => {
  try {
    const [feedbacks] = await req.app.locals.db.execute(
      "SELECT f.id, f.userId, u.name, u.email, u.image, f.serviceId, f.rate, f.comment, f.date, s.title FROM feedbacks f JOIN users u ON f.userId = u.id JOIN services s ON f.serviceId = s.id"
    );
    res.json({ success: true, feedbacks });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get service detail
const serviceDetail = async (req, res) => {
  try {
    const { serId } = req.body;
    const [detailSerData] = await req.app.locals.db.execute(
      "SELECT id, title, image, shortdes , price, description FROM services WHERE id = ?",
      [serId]
    );

    res.json({ success: true, detailSerData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listFeedbackByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.query;

    // Câu truy vấn để lấy thông tin chi tiết về các cuộc hẹn
    const [feedbacks] = await req.app.locals.db.execute(
      `SELECT 
                f.id, 
                f.userId, 
                u.name, 
                u.email, 
                u.image,
                f.serviceId, 
                f.rate, 
                f.comment,
                f.date
            FROM 
                feedbacks f
            JOIN 
                users u ON f.userId = u.id
            WHERE 
                f.serviceId = ?`,
      [serviceId]
    );

    res.json({ success: true, feedbacks });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API chỉnh sửa thông tin phản hồi
const editFeedback = async (req, res) => {
  try {
    const { feedbackId, comment, rate } = req.body;

    // Log các giá trị để kiểm tra
    console.log("Dữ liệu nhận từ client:");
    console.log("feedbackId:", feedbackId);
    console.log("comment:", comment);
    console.log("rate:", rate);

    // Kiểm tra dữ liệu bắt buộc
    if (!feedbackId || !comment || rate == null) {
      console.log("Thiếu thông tin bắt buộc");
      return res.json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    // Cập nhật thông tin phản hồi
    const [result] = await req.app.locals.db.execute(
      "UPDATE feedbacks SET rate = ?, comment = ? WHERE id = ?",
      [rate, comment, feedbackId]
    );

    // console.log("Kết quả cập nhật:", result); // Log kết quả từ query

    res.json({ success: true, message: "Cập nhật phản hồi thành công" });
  } catch (error) {
    console.error("Lỗi hệ thống:", error); // Log lỗi chi tiết
    res.json({
      success: false,
      message: "Lỗi hệ thống. Vui lòng thử lại sau.",
    });
  }
};

export {
  serviceList,
  newList,
  serviceDetail,
  listFeedbackByServiceId,
  fbList,
  editFeedback,
};
