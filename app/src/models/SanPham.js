/**
 * LỚP THỰC THỂ: SanPham & ChiTietHoaDon (Entity Layer)
 * Xử lý thống kê Top sản phẩm bán chạy và cơ cấu theo Danh mục hàng hóa
 */
const { getPool, isMySQLConnected, fallbackData } = require('../db');

class SanPham {
    /**
     * Thống kê Top sản phẩm có doanh thu và số lượng bán chạy nhất
     */
    static async getTopSellingProducts({ limit = 5 }) {
        if (isMySQLConnected()) {
            const pool = getPool();
            const sql = `
                SELECT 
                    sp.id,
                    sp.ma_sp,
                    sp.ten_sp,
                    sp.don_vi_tinh,
                    SUM(ct.so_luong) AS tong_so_luong,
                    SUM(ct.thanh_tien) AS tong_doanh_thu
                FROM tbl_chitiethoadon ct
                JOIN tbl_sanpham sp ON ct.id_san_pham = sp.id
                JOIN tbl_hoadon hd ON ct.id_hoa_don = hd.id
                WHERE hd.trang_thai = 'DA_THANH_TOAN'
                GROUP BY sp.id, sp.ma_sp, sp.ten_sp, sp.don_vi_tinh
                ORDER BY tong_doanh_thu DESC
                LIMIT ?
            `;
            const [rows] = await pool.query(sql, [limit]);
            return rows;
        } else {
            const map = {};
            fallbackData.chiTiets.forEach(ct => {
                if (!map[ct.id_san_pham]) {
                    map[ct.id_san_pham] = {
                        id: ct.id_san_pham,
                        ten_sp: ct.ten_sp,
                        tong_so_luong: 0,
                        tong_doanh_thu: 0
                    };
                }
                map[ct.id_san_pham].tong_so_luong += ct.so_luong;
                map[ct.id_san_pham].tong_doanh_thu += ct.thanh_tien;
            });

            return Object.values(map)
                .sort((a, b) => b.tong_doanh_thu - a.tong_doanh_thu)
                .slice(0, limit);
        }
    }

    /**
     * Thống kê cơ cấu doanh thu theo Danh mục sản phẩm (phục vụ biểu đồ tròn)
     */
    static async getCategoryRevenue() {
        if (isMySQLConnected()) {
            const pool = getPool();
            const sql = `
                SELECT 
                    dm.ten_danh_muc,
                    COALESCE(SUM(ct.thanh_tien), 0) AS doanh_thu
                FROM tbl_danhmuc dm
                JOIN tbl_sanpham sp ON dm.id = sp.id_danh_muc
                JOIN tbl_chitiethoadon ct ON sp.id = ct.id_san_pham
                JOIN tbl_hoadon hd ON ct.id_hoa_don = hd.id
                WHERE hd.trang_thai = 'DA_THANH_TOAN'
                GROUP BY dm.id, dm.ten_danh_muc
                ORDER BY doanh_thu DESC
            `;
            const [rows] = await pool.query(sql);
            return rows;
        } else {
            return [
                { ten_danh_muc: 'Thực phẩm tươi sống', doanh_thu: 2889000 },
                { ten_danh_muc: 'Hóa mỹ phẩm & Tẩy rửa', doanh_thu: 1066000 },
                { ten_danh_muc: 'Đồ uống & Giải khát', doanh_thu: 545000 },
                { ten_danh_muc: 'Thực phẩm & Bánh kẹo', doanh_thu: 366000 },
                { ten_danh_muc: 'Đồ gia dụng tiện ích', doanh_thu: 170000 }
            ];
        }
    }
}

module.exports = SanPham;
