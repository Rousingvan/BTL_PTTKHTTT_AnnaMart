-- ================================================================
-- HỆ THỐNG QUẢN LÝ CHUỖI SIÊU THỊ MINI ANNA HÀ NỘI
-- CƠ SỞ DỮ LIỆU CHO MODULE THỐNG KÊ VÀ BÁO CÁO DOANH THU
-- MÔN HỌC: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG THÔNG TIN (PTIT)
-- ================================================================

CREATE DATABASE IF NOT EXISTS `sieuthi_anna` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sieuthi_anna`;

-- 1. Bảng Cửa hàng / Chi nhánh (CuaHang)
CREATE TABLE IF NOT EXISTS `tbl_cuahang` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_cua_hang` VARCHAR(20) NOT NULL UNIQUE,
    `ten_cua_hang` VARCHAR(150) NOT NULL,
    `dia_chi` VARCHAR(255) NOT NULL,
    `so_dien_thoai` VARCHAR(20),
    `trang_thai` TINYINT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Nhân viên (NhanVien)
CREATE TABLE IF NOT EXISTS `tbl_nhanvien` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_nv` VARCHAR(20) NOT NULL UNIQUE,
    `ho_ten` VARCHAR(100) NOT NULL,
    `chuc_vu` VARCHAR(50) DEFAULT 'Thu ngân',
    `id_cua_hang` INT,
    FOREIGN KEY (`id_cua_hang`) REFERENCES `tbl_cuahang`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Danh mục Sản phẩm (DanhMuc)
CREATE TABLE IF NOT EXISTS `tbl_danhmuc` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_danh_muc` VARCHAR(20) NOT NULL UNIQUE,
    `ten_danh_muc` VARCHAR(100) NOT NULL,
    `mo_ta` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Sản phẩm (SanPham)
CREATE TABLE IF NOT EXISTS `tbl_sanpham` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_sp` VARCHAR(20) NOT NULL UNIQUE,
    `ten_sp` VARCHAR(150) NOT NULL,
    `don_vi_tinh` VARCHAR(20) DEFAULT 'Cái',
    `gia_nhap` DECIMAL(12,2) DEFAULT 0,
    `gia_ban` DECIMAL(12,2) NOT NULL,
    `so_luong_ton` INT NOT NULL DEFAULT 100,
    `id_danh_muc` INT,
    `trang_thai` TINYINT DEFAULT 1,
    FOREIGN KEY (`id_danh_muc`) REFERENCES `tbl_danhmuc`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Hóa đơn (HoaDon - Thực thể chính tính doanh thu)
CREATE TABLE IF NOT EXISTS `tbl_hoadon` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_hoa_don` VARCHAR(30) NOT NULL UNIQUE,
    `ngay_lap` DATETIME NOT NULL,
    `id_nhan_vien` INT,
    `id_cua_hang` INT,
    `tong_tien` DECIMAL(14,2) NOT NULL DEFAULT 0,
    `giam_gia` DECIMAL(14,2) DEFAULT 0,
    `thanh_tien` DECIMAL(14,2) NOT NULL DEFAULT 0,
    `phuong_thuc_tt` ENUM('TIEN_MAT', 'CHUYEN_KHOAN_QR', 'THE_ATM') DEFAULT 'TIEN_MAT',
    `trang_thai` ENUM('DA_THANH_TOAN', 'CHO_XU_LY', 'DA_HUY') DEFAULT 'DA_THANH_TOAN',
    `ghi_chu` VARCHAR(255),
    INDEX `idx_ngay_lap` (`ngay_lap`),
    INDEX `idx_trang_thai` (`trang_thai`),
    FOREIGN KEY (`id_nhan_vien`) REFERENCES `tbl_nhanvien`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`id_cua_hang`) REFERENCES `tbl_cuahang`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng Chi tiết Hóa đơn (ChiTietHoaDon)
CREATE TABLE IF NOT EXISTS `tbl_chitiethoadon` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `id_hoa_don` INT NOT NULL,
    `id_san_pham` INT NOT NULL,
    `so_luong` INT NOT NULL DEFAULT 1,
    `don_gia` DECIMAL(12,2) NOT NULL,
    `thanh_tien` DECIMAL(14,2) NOT NULL,
    FOREIGN KEY (`id_hoa_don`) REFERENCES `tbl_hoadon`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_san_pham`) REFERENCES `tbl_sanpham`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng Phiếu Kiểm Kê (PhieuKiemKe - Cho Module Kiểm kê & Điều chỉnh tồn kho)
CREATE TABLE IF NOT EXISTS `tbl_phieukiemke` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_phieu` VARCHAR(30) NOT NULL UNIQUE,
    `ngay_kiem_ke` DATETIME NOT NULL,
    `id_nhan_vien` INT,
    `id_cua_hang` INT,
    `trang_thai` ENUM('CAN_BANG_XONG', 'DANG_KIEM_KE', 'DA_HUY') DEFAULT 'CAN_BANG_XONG',
    `ghi_chu` VARCHAR(255),
    INDEX `idx_ngay_kiem` (`ngay_kiem_ke`),
    FOREIGN KEY (`id_nhan_vien`) REFERENCES `tbl_nhanvien`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`id_cua_hang`) REFERENCES `tbl_cuahang`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng Chi Tiết Kiểm Kê (ChiTietKiemKe)
CREATE TABLE IF NOT EXISTS `tbl_chitietkiemke` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `id_phieu_kiem_ke` INT NOT NULL,
    `id_san_pham` INT NOT NULL,
    `so_luong_he_thong` INT NOT NULL DEFAULT 0,
    `so_luong_thuc_te` INT NOT NULL DEFAULT 0,
    `chenh_lech` INT GENERATED ALWAYS AS (`so_luong_thuc_te` - `so_luong_he_thong`) STORED,
    `ly_do_dieu_chinh` VARCHAR(255),
    FOREIGN KEY (`id_phieu_kiem_ke`) REFERENCES `tbl_phieukiemke`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`id_san_pham`) REFERENCES `tbl_sanpham`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- DỮ LIỆU MẪU (SEED DATA ĐỂ THỐNG KÊ DOANH THU)
-- ================================================================

-- Chi nhánh
INSERT INTO `tbl_cuahang` (`id`, `ma_cua_hang`, `ten_cua_hang`, `dia_chi`, `so_dien_thoai`) VALUES
(1, 'ANNA-01', 'Siêu thị Anna - Cầu Giấy', 'Số 18 Trần Thái Tông, Cầu Giấy, Hà Nội', '0243.888.111'),
(2, 'ANNA-02', 'Siêu thị Anna - Hà Đông', 'Số 102 Quang Trung, Hà Đông, Hà Nội', '0243.888.222'),
(3, 'ANNA-03', 'Siêu thị Anna - Hai Bà Trưng', 'Số 45 Bạch Mai, Hai Bà Trưng, Hà Nội', '0243.888.333')
ON DUPLICATE KEY UPDATE `ten_cua_hang`=VALUES(`ten_cua_hang`);

-- Nhân viên
INSERT INTO `tbl_nhanvien` (`id`, `ma_nv`, `ho_ten`, `chuc_vu`, `id_cua_hang`) VALUES
(1, 'NV001', 'Nguyễn Thị Thu Hà', 'Thu ngân', 1),
(2, 'NV002', 'Trần Văn Minh', 'Thu ngân', 1),
(3, 'NV003', 'Lê Hoàng Yến', 'Quản lý cửa hàng', 1),
(4, 'NV004', 'Phạm Quốc Bảo', 'Thu ngân', 2)
ON DUPLICATE KEY UPDATE `ho_ten`=VALUES(`ho_ten`);

-- Danh mục hàng hóa
INSERT INTO `tbl_danhmuc` (`id`, `ma_danh_muc`, `ten_danh_muc`, `mo_ta`) VALUES
(1, 'DM_THUCPHAM', 'Thực phẩm & Bánh kẹo', 'Các loại thực phẩm khô, bánh ngọt, snack, mì ăn liền'),
(2, 'DM_DOUONG', 'Đồ uống & Giải khát', 'Nước ngọt, nước khoáng, trà xanh, bia, sữa chua uống'),
(3, 'DM_HOAMYPHAM', 'Hóa mỹ phẩm & Tẩy rửa', 'Dầu gội, sữa tắm, nước giặt, nước rửa chén'),
(4, 'DM_TUOISONG', 'Thực phẩm tươi sống', 'Rau củ quả sạch, thịt, cá mát bảo quản lạnh'),
(5, 'DM_GIADUNG', 'Đồ gia dụng tiện ích', 'Màng bọc thực phẩm, khăn giấy, pin, đồ nhựa gia đình')
ON DUPLICATE KEY UPDATE `ten_danh_muc`=VALUES(`ten_danh_muc`);

-- Sản phẩm
INSERT INTO `tbl_sanpham` (`id`, `ma_sp`, `ten_sp`, `don_vi_tinh`, `gia_nhap`, `gia_ban`, `id_danh_muc`) VALUES
(1, 'SP001', 'Sữa tươi Vinamilk 1L Không đường', 'Hộp', 28000, 35000, 2),
(2, 'SP002', 'Nước ngọt Coca-Cola lon 330ml', 'Lon', 8000, 11000, 2),
(3, 'SP003', 'Bánh Chocopie hộp 12 cái', 'Hộp', 42000, 56000, 1),
(4, 'SP004', 'Mì tôm Hảo Hảo Tôm chua cay', 'Gói', 3500, 5000, 1),
(5, 'SP005', 'Dầu ăn Simply hạt cải 1L', 'Chai', 52000, 68000, 1),
(6, 'SP006', 'Nước giặt OMO Matic cửa trên 3.6kg', 'Túi', 145000, 189000, 3),
(7, 'SP007', 'Sữa tắm Dettol kháng khuẩn 950g', 'Chai', 120000, 155000, 3),
(8, 'SP008', 'Táo Envy New Zealand nhập khẩu', 'Kg', 160000, 219000, 4),
(9, 'SP009', 'Thịt ba chỉ heo tươi MeatDeli 400g', 'Khay', 75000, 99000, 4),
(10, 'SP010', 'Giấy vệ sinh cuộn cao cấp Pulppy 10 cuộn', 'Lốc', 65000, 85000, 5)
ON DUPLICATE KEY UPDATE `ten_sp`=VALUES(`ten_sp`);

-- Hóa đơn mẫu (trong các ngày gần đây để trực quan hóa biểu đồ)
INSERT INTO `tbl_hoadon` (`id`, `ma_hoa_don`, `ngay_lap`, `id_nhan_vien`, `id_cua_hang`, `tong_tien`, `giam_gia`, `thanh_tien`, `phuong_thuc_tt`, `trang_thai`) VALUES
(1, 'HD20260910-001', '2026-09-10 08:30:15', 1, 1, 255000, 15000, 240000, 'TIEN_MAT', 'DA_THANH_TOAN'),
(2, 'HD20260910-002', '2026-09-10 11:45:00', 1, 1, 478000, 0, 478000, 'CHUYEN_KHOAN_QR', 'DA_THANH_TOAN'),
(3, 'HD20260911-001', '2026-09-11 09:12:00', 2, 1, 620000, 20000, 600000, 'THE_ATM', 'DA_THANH_TOAN'),
(4, 'HD20260911-002', '2026-09-11 17:25:30', 2, 1, 310000, 0, 310000, 'TIEN_MAT', 'DA_THANH_TOAN'),
(5, 'HD20260912-001', '2026-09-12 14:10:00', 1, 1, 890000, 50000, 840000, 'CHUYEN_KHOAN_QR', 'DA_THANH_TOAN'),
(6, 'HD20260913-001', '2026-09-13 10:05:22', 1, 1, 520000, 0, 520000, 'TIEN_MAT', 'DA_THANH_TOAN'),
(7, 'HD20260914-001', '2026-09-14 15:40:11', 2, 1, 1150000, 50000, 1100000, 'CHUYEN_KHOAN_QR', 'DA_THANH_TOAN'),
(8, 'HD20260915-001', '2026-09-15 12:20:00', 1, 1, 740000, 20000, 720000, 'THE_ATM', 'DA_THANH_TOAN'),
(9, 'HD20260916-001', '2026-09-16 18:05:40', 2, 1, 980000, 30000, 950000, 'CHUYEN_KHOAN_QR', 'DA_THANH_TOAN'),
(10, 'HD20260917-001', '2026-09-17 09:45:10', 1, 1, 670000, 10000, 660000, 'TIEN_MAT', 'DA_THANH_TOAN'),
(11, 'HD20260918-001', '2026-09-18 10:15:00', 1, 1, 1340000, 60000, 1280000, 'CHUYEN_KHOAN_QR', 'DA_THANH_TOAN'),
(12, 'HD20260918-002', '2026-09-18 14:30:00', 2, 1, 450000, 0, 450000, 'TIEN_MAT', 'DA_THANH_TOAN')
ON DUPLICATE KEY UPDATE `tong_tien`=VALUES(`tong_tien`);

-- Chi tiết các hóa đơn
INSERT INTO `tbl_chitiethoadon` (`id_hoa_don`, `id_san_pham`, `so_luong`, `don_gia`, `thanh_tien`) VALUES
(1, 1, 2, 35000, 70000),
(1, 4, 10, 5000, 50000),
(1, 3, 2, 56000, 112000),
(2, 6, 2, 189000, 378000),
(2, 2, 5, 11000, 55000),
(3, 8, 2, 219000, 438000),
(3, 9, 1, 99000, 99000),
(4, 5, 3, 68000, 204000),
(4, 2, 6, 11000, 66000),
(5, 7, 2, 155000, 310000),
(5, 6, 2, 189000, 378000),
(7, 8, 3, 219000, 657000),
(7, 9, 3, 99000, 297000),
(11, 8, 4, 219000, 876000),
(11, 1, 6, 35000, 210000),
(11, 10, 2, 85000, 170000);
