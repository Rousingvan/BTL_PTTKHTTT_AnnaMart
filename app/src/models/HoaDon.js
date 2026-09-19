/**
 * LỚP THỰC THỂ: HoaDon (Entity Layer)
 * Đại diện cho bảng tbl_hoadon trong CSDL theo chuẩn phân tích thiết kế PTIT
 */
const { getPool, isMySQLConnected, fallbackData } = require('../db');

class HoaDon {
    /**
     * Thống kê tổng quan doanh thu trong khoảng thời gian
     */
    static async getOverview({ fromDate, toDate, storeId }) {
        if (isMySQLConnected()) {
            const pool = getPool();
            let sql = `
                SELECT 
                    COALESCE(SUM(thanh_tien), 0) AS tong_doanh_thu,
                    COUNT(id) AS so_don_hang,
                    COALESCE(AVG(thanh_tien), 0) AS gia_tri_trung_binh_don,
                    COALESCE(SUM(CASE WHEN phuong_thuc_tt = 'TIEN_MAT' THEN thanh_tien ELSE 0 END), 0) AS tien_mat,
                    COALESCE(SUM(CASE WHEN phuong_thuc_tt = 'CHUYEN_KHOAN_QR' THEN thanh_tien ELSE 0 END), 0) AS chuyen_khoan_qr,
                    COALESCE(SUM(CASE WHEN phuong_thuc_tt = 'THE_ATM' THEN thanh_tien ELSE 0 END), 0) AS the_atm
                FROM tbl_hoadon
                WHERE trang_thai = 'DA_THANH_TOAN'
            `;
            const params = [];
            if (fromDate) {
                sql += ` AND ngay_lap >= ?`;
                params.push(fromDate + ' 00:00:00');
            }
            if (toDate) {
                sql += ` AND ngay_lap <= ?`;
                params.push(toDate + ' 23:59:59');
            }
            if (storeId && storeId !== 'ALL') {
                sql += ` AND id_cua_hang = ?`;
                params.push(storeId);
            }
            const [rows] = await pool.query(sql, params);
            return rows[0];
        } else {
            // Xử lý bằng dữ liệu mẫu
            let list = fallbackData.hoaDons.filter(h => h.trang_thai === 'DA_THANH_TOAN');
            if (fromDate) {
                list = list.filter(h => h.ngay_lap.substring(0, 10) >= fromDate);
            }
            if (toDate) {
                list = list.filter(h => h.ngay_lap.substring(0, 10) <= toDate);
            }
            if (storeId && storeId !== 'ALL') {
                list = list.filter(h => h.id_cua_hang === parseInt(storeId));
            }

            const tong_doanh_thu = list.reduce((sum, h) => sum + h.thanh_tien, 0);
            const so_don_hang = list.length;
            const gia_tri_trung_binh_don = so_don_hang > 0 ? tong_doanh_thu / so_don_hang : 0;
            const tien_mat = list.filter(h => h.phuong_thuc_tt === 'TIEN_MAT').reduce((s, h) => s + h.thanh_tien, 0);
            const chuyen_khoan_qr = list.filter(h => h.phuong_thuc_tt === 'CHUYEN_KHOAN_QR').reduce((s, h) => s + h.thanh_tien, 0);
            const the_atm = list.filter(h => h.phuong_thuc_tt === 'THE_ATM').reduce((s, h) => s + h.thanh_tien, 0);

            return {
                tong_doanh_thu,
                so_don_hang,
                gia_tri_trung_binh_don,
                tien_mat,
                chuyen_khoan_qr,
                the_atm
            };
        }
    }

    /**
     * Dữ liệu biểu đồ doanh thu theo ngày
     */
    static async getTimelineData({ fromDate, toDate, storeId }) {
        if (isMySQLConnected()) {
            const pool = getPool();
            let sql = `
                SELECT 
                    DATE_FORMAT(ngay_lap, '%Y-%m-%d') AS ngay,
                    COALESCE(SUM(thanh_tien), 0) AS doanh_thu,
                    COUNT(id) AS so_don
                FROM tbl_hoadon
                WHERE trang_thai = 'DA_THANH_TOAN'
            `;
            const params = [];
            if (fromDate) {
                sql += ` AND ngay_lap >= ?`;
                params.push(fromDate + ' 00:00:00');
            }
            if (toDate) {
                sql += ` AND ngay_lap <= ?`;
                params.push(toDate + ' 23:59:59');
            }
            if (storeId && storeId !== 'ALL') {
                sql += ` AND id_cua_hang = ?`;
                params.push(storeId);
            }
            sql += ` GROUP BY DATE_FORMAT(ngay_lap, '%Y-%m-%d') ORDER BY ngay ASC`;

            const [rows] = await pool.query(sql, params);
            return rows;
        } else {
            let list = fallbackData.hoaDons.filter(h => h.trang_thai === 'DA_THANH_TOAN');
            if (fromDate) list = list.filter(h => h.ngay_lap.substring(0, 10) >= fromDate);
            if (toDate) list = list.filter(h => h.ngay_lap.substring(0, 10) <= toDate);
            if (storeId && storeId !== 'ALL') list = list.filter(h => h.id_cua_hang === parseInt(storeId));

            const grouped = {};
            list.forEach(h => {
                const date = h.ngay_lap.substring(0, 10);
                if (!grouped[date]) {
                    grouped[date] = { ngay: date, doanh_thu: 0, so_don: 0 };
                }
                grouped[date].doanh_thu += h.thanh_tien;
                grouped[date].so_don += 1;
            });

            return Object.values(grouped).sort((a, b) => a.ngay.localeCompare(b.ngay));
        }
    }

    /**
     * Lấy danh sách hóa đơn chi tiết phục vụ đối soát và xuất file Excel
     */
    static async getInvoiceList({ fromDate, toDate, storeId }) {
        if (isMySQLConnected()) {
            const pool = getPool();
            let sql = `
                SELECT 
                    h.id,
                    h.ma_hoa_don,
                    DATE_FORMAT(h.ngay_lap, '%Y-%m-%d %H:%i:%s') AS ngay_lap,
                    c.ten_cua_hang,
                    nv.ho_ten AS nv_thu_ngan,
                    h.tong_tien,
                    h.giam_gia,
                    h.thanh_tien,
                    h.phuong_thuc_tt,
                    h.trang_thai
                FROM tbl_hoadon h
                LEFT JOIN tbl_cuahang c ON h.id_cua_hang = c.id
                LEFT JOIN tbl_nhanvien nv ON h.id_nhan_vien = nv.id
                WHERE h.trang_thai = 'DA_THANH_TOAN'
            `;
            const params = [];
            if (fromDate) {
                sql += ` AND h.ngay_lap >= ?`;
                params.push(fromDate + ' 00:00:00');
            }
            if (toDate) {
                sql += ` AND h.ngay_lap <= ?`;
                params.push(toDate + ' 23:59:59');
            }
            if (storeId && storeId !== 'ALL') {
                sql += ` AND h.id_cua_hang = ?`;
                params.push(storeId);
            }
            sql += ` ORDER BY h.ngay_lap DESC`;

            const [rows] = await pool.query(sql, params);
            return rows;
        } else {
            let list = fallbackData.hoaDons.filter(h => h.trang_thai === 'DA_THANH_TOAN');
            if (fromDate) list = list.filter(h => h.ngay_lap.substring(0, 10) >= fromDate);
            if (toDate) list = list.filter(h => h.ngay_lap.substring(0, 10) <= toDate);
            if (storeId && storeId !== 'ALL') list = list.filter(h => h.id_cua_hang === parseInt(storeId));

            return list.map(h => {
                const ch = fallbackData.cuaHangs.find(c => c.id === h.id_cua_hang);
                return {
                    id: h.id,
                    ma_hoa_don: h.ma_hoa_don,
                    ngay_lap: h.ngay_lap,
                    ten_cua_hang: ch ? ch.ten : 'Siêu thị Anna - Cầu Giấy',
                    nv_thu_ngan: h.nv_thu_ngan || 'Nguyễn Thị Thu Hà',
                    tong_tien: h.thanh_tien,
                    giam_gia: 0,
                    thanh_tien: h.thanh_tien,
                    phuong_thuc_tt: h.phuong_thuc_tt,
                    trang_thai: h.trang_thai
                };
            }).sort((a, b) => b.ngay_lap.localeCompare(a.ngay_lap));
        }
    }
}

module.exports = HoaDon;
