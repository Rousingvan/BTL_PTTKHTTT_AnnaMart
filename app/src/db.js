/**
 * Quản lý kết nối Cơ sở dữ liệu
 * Kết nối MySQL (XAMPP localhost:3306) và cơ chế bộ đệm dữ liệu mẫu
 */
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sieuthi_anna',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool = null;
let isConnected = false;

// Dữ liệu mẫu khởi tạo sẵn trong trường hợp chưa khởi động MySQL
const fallbackData = {
    cuaHangs: [
        { id: 1, ma: 'ANNA-01', ten: 'Siêu thị Anna - Cầu Giấy', dia_chi: 'Số 18 Trần Thái Tông, Cầu Giấy, Hà Nội' },
        { id: 2, ma: 'ANNA-02', ten: 'Siêu thị Anna - Hà Đông', dia_chi: 'Số 102 Quang Trung, Hà Đông, Hà Nội' },
        { id: 3, ma: 'ANNA-03', ten: 'Siêu thị Anna - Hai Bà Trưng', dia_chi: 'Số 45 Bạch Mai, Hai Bà Trưng, Hà Nội' }
    ],
    danhMucs: [
        { id: 1, ten: 'Thực phẩm & Bánh kẹo' },
        { id: 2, ten: 'Đồ uống & Giải khát' },
        { id: 3, ten: 'Hóa mỹ phẩm & Tẩy rửa' },
        { id: 4, ten: 'Thực phẩm tươi sống' },
        { id: 5, ten: 'Đồ gia dụng tiện ích' }
    ],
    sanPhams: [
        { id: 1, ma_sp: 'SP001', ten_sp: 'Sữa tươi Vinamilk 1L Không đường', gia_ban: 35000, id_danh_muc: 2 },
        { id: 2, ma_sp: 'SP002', ten_sp: 'Nước ngọt Coca-Cola lon 330ml', gia_ban: 11000, id_danh_muc: 2 },
        { id: 3, ma_sp: 'SP003', ten_sp: 'Bánh Chocopie hộp 12 cái', gia_ban: 56000, id_danh_muc: 1 },
        { id: 4, ma_sp: 'SP004', ten_sp: 'Mì tôm Hảo Hảo Tôm chua cay', gia_ban: 5000, id_danh_muc: 1 },
        { id: 5, ma_sp: 'SP005', ten_sp: 'Dầu ăn Simply hạt cải 1L', gia_ban: 68000, id_danh_muc: 1 },
        { id: 6, ma_sp: 'SP006', ten_sp: 'Nước giặt OMO Matic 3.6kg', gia_ban: 189000, id_danh_muc: 3 },
        { id: 7, ma_sp: 'SP007', ten_sp: 'Sữa tắm Dettol kháng khuẩn 950g', gia_ban: 155000, id_danh_muc: 3 },
        { id: 8, ma_sp: 'SP008', ten_sp: 'Táo Envy New Zealand nhập khẩu', gia_ban: 219000, id_danh_muc: 4 },
        { id: 9, ma_sp: 'SP009', ten_sp: 'Thịt ba chỉ heo tươi MeatDeli 400g', gia_ban: 99000, id_danh_muc: 4 },
        { id: 10, ma_sp: 'SP010', ten_sp: 'Giấy vệ sinh cuộn Pulppy 10 cuộn', gia_ban: 85000, id_danh_muc: 5 }
    ],
    hoaDons: [
        { id: 1, ma_hoa_don: 'HD20260910-001', ngay_lap: '2026-09-10 08:30:15', id_cua_hang: 1, thanh_tien: 240000, phuong_thuc_tt: 'TIEN_MAT', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Nguyễn Thị Thu Hà' },
        { id: 2, ma_hoa_don: 'HD20260910-002', ngay_lap: '2026-09-10 11:45:00', id_cua_hang: 1, thanh_tien: 478000, phuong_thuc_tt: 'CHUYEN_KHOAN_QR', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Nguyễn Thị Thu Hà' },
        { id: 3, ma_hoa_don: 'HD20260911-001', ngay_lap: '2026-09-11 09:12:00', id_cua_hang: 1, thanh_tien: 600000, phuong_thuc_tt: 'THE_ATM', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Trần Văn Minh' },
        { id: 4, ma_hoa_don: 'HD20260911-002', ngay_lap: '2026-09-11 17:25:30', id_cua_hang: 1, thanh_tien: 310000, phuong_thuc_tt: 'TIEN_MAT', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Trần Văn Minh' },
        { id: 5, ma_hoa_don: 'HD20260912-001', ngay_lap: '2026-09-12 14:10:00', id_cua_hang: 1, thanh_tien: 840000, phuong_thuc_tt: 'CHUYEN_KHOAN_QR', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Nguyễn Thị Thu Hà' },
        { id: 6, ma_hoa_don: 'HD20260913-001', ngay_lap: '2026-09-13 10:05:22', id_cua_hang: 1, thanh_tien: 520000, phuong_thuc_tt: 'TIEN_MAT', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Nguyễn Thị Thu Hà' },
        { id: 7, ma_hoa_don: 'HD20260914-001', ngay_lap: '2026-09-14 15:40:11', id_cua_hang: 1, thanh_tien: 1100000, phuong_thuc_tt: 'CHUYEN_KHOAN_QR', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Trần Văn Minh' },
        { id: 8, ma_hoa_don: 'HD20260915-001', ngay_lap: '2026-09-15 12:20:00', id_cua_hang: 1, thanh_tien: 720000, phuong_thuc_tt: 'THE_ATM', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Nguyễn Thị Thu Hà' },
        { id: 9, ma_hoa_don: 'HD20260916-001', ngay_lap: '2026-09-16 18:05:40', id_cua_hang: 1, thanh_tien: 950000, phuong_thuc_tt: 'CHUYEN_KHOAN_QR', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Trần Văn Minh' },
        { id: 10, ma_hoa_don: 'HD20260917-001', ngay_lap: '2026-09-17 09:45:10', id_cua_hang: 1, thanh_tien: 660000, phuong_thuc_tt: 'TIEN_MAT', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Nguyễn Thị Thu Hà' },
        { id: 11, ma_hoa_don: 'HD20260918-001', ngay_lap: '2026-09-18 10:15:00', id_cua_hang: 1, thanh_tien: 1280000, phuong_thuc_tt: 'CHUYEN_KHOAN_QR', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Nguyễn Thị Thu Hà' },
        { id: 12, ma_hoa_don: 'HD20260918-002', ngay_lap: '2026-09-18 14:30:00', id_cua_hang: 1, thanh_tien: 450000, phuong_thuc_tt: 'TIEN_MAT', trang_thai: 'DA_THANH_TOAN', nv_thu_ngan: 'Trần Văn Minh' }
    ],
    chiTiets: [
        { id_hoa_don: 1, id_san_pham: 1, ten_sp: 'Sữa tươi Vinamilk 1L', so_luong: 2, don_gia: 35000, thanh_tien: 70000 },
        { id_hoa_don: 1, id_san_pham: 4, ten_sp: 'Mì tôm Hảo Hảo', so_luong: 10, don_gia: 5000, thanh_tien: 50000 },
        { id_hoa_don: 1, id_san_pham: 3, ten_sp: 'Bánh Chocopie', so_luong: 2, don_gia: 56000, thanh_tien: 112000 },
        { id_hoa_don: 2, id_san_pham: 6, ten_sp: 'Nước giặt OMO Matic', so_luong: 2, don_gia: 189000, thanh_tien: 378000 },
        { id_hoa_don: 2, id_san_pham: 2, ten_sp: 'Coca-Cola lon 330ml', so_luong: 5, don_gia: 11000, thanh_tien: 55000 },
        { id_hoa_don: 3, id_san_pham: 8, ten_sp: 'Táo Envy New Zealand', so_luong: 2, don_gia: 219000, thanh_tien: 438000 },
        { id_hoa_don: 5, id_san_pham: 6, ten_sp: 'Nước giặt OMO Matic', so_luong: 2, don_gia: 189000, thanh_tien: 378000 },
        { id_hoa_don: 7, id_san_pham: 8, ten_sp: 'Táo Envy New Zealand', so_luong: 3, don_gia: 219000, thanh_tien: 657000 },
        { id_hoa_don: 11, id_san_pham: 8, ten_sp: 'Táo Envy New Zealand', so_luong: 4, don_gia: 219000, thanh_tien: 876000 },
        { id_hoa_don: 11, id_san_pham: 1, ten_sp: 'Sữa tươi Vinamilk 1L', so_luong: 6, don_gia: 35000, thanh_tien: 210000 }
    ]
};

async function initDB() {
    try {
        pool = mysql.createPool(dbConfig);
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        isConnected = true;
        console.log('✅ Đã kết nối thành công tới MySQL CSDL `sieuthi_anna` (Port 3306)');
    } catch (err) {
        console.warn('⚠️ Không thể kết nối MySQL (XAMPP chưa bật). Hệ thống tự động chuyển sang chế độ dữ liệu mẫu tích hợp (Mock DB) để ứng dụng hoạt động bình thường.');
        isConnected = false;
    }
}

initDB();

module.exports = {
    getPool: () => pool,
    isMySQLConnected: () => isConnected,
    fallbackData
};
