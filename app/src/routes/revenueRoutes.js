/**
 * LỚP BIÊN: Revenue Routes (Boundary Layer)
 * Định tuyến các yêu cầu HTTP từ giao diện web tới Control Layer
 */
const express = require('express');
const router = express.Router();
const DoanhThuController = require('../controllers/DoanhThuController');

// Lấy tổng quan các chỉ số KPI doanh thu
router.get('/overview', DoanhThuController.getOverview);

// Lấy dữ liệu biểu đồ doanh thu theo ngày
router.get('/timeline', DoanhThuController.getTimeline);

// Lấy top sản phẩm bán chạy nhất
router.get('/top-products', DoanhThuController.getTopProducts);

// Lấy cơ cấu doanh thu theo danh mục
router.get('/category-breakdown', DoanhThuController.getCategoryBreakdown);

// Lấy danh sách hóa đơn chi tiết
router.get('/invoices', DoanhThuController.getInvoices);

// Xuất file báo cáo Excel
router.get('/export-excel', DoanhThuController.exportExcel);

module.exports = router;
