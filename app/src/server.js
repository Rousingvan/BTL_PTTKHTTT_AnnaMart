/**
 * SERVER CHÍNH: Khởi chạy Express Server
 * Hệ thống Quản lý Siêu thị Mini Anna - Module Thống kê & Báo cáo Doanh thu
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const revenueRoutes = require('./routes/revenueRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ giao diện tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, '../public')));

// Gắn các routes nghiệp vụ
app.use('/api/revenue', revenueRoutes);

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`🚀 Siêu thị Anna - Module Thống kê & Báo cáo Doanh thu`);
    console.log(`🌐 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📊 Truy cập giao diện Dashboard tại trình duyệt.`);
    console.log(`================================================================`);
});
