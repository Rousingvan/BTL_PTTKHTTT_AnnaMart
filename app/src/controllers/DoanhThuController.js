/**
 * LỚP ĐIỀU KHIỂN: DoanhThuController (Control Layer)
 * Tiếp nhận yêu cầu từ Boundary (Router/Client), điều phối tính toán và trả về kết quả
 * Chuẩn mô hình 3 lớp Boundary - Control - Entity (PTIT)
 */
const HoaDon = require('../models/HoaDon');
const SanPham = require('../models/SanPham');
const ExcelJS = require('exceljs');

class DoanhThuController {
    /**
     * API: Lấy số liệu tổng quan KPI
     */
    static async getOverview(req, res) {
        try {
            const { fromDate, toDate, storeId } = req.query;
            const data = await HoaDon.getOverview({ fromDate, toDate, storeId });
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Lỗi getOverview:', error);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy dữ liệu tổng quan' });
        }
    }

    /**
     * API: Lấy dữ liệu biểu đồ doanh thu theo thời gian
     */
    static async getTimeline(req, res) {
        try {
            const { fromDate, toDate, storeId } = req.query;
            const data = await HoaDon.getTimelineData({ fromDate, toDate, storeId });
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Lỗi getTimeline:', error);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy biểu đồ doanh thu' });
        }
    }

    /**
     * API: Lấy Top sản phẩm bán chạy nhất
     */
    static async getTopProducts(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 5;
            const data = await SanPham.getTopSellingProducts({ limit });
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Lỗi getTopProducts:', error);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy top sản phẩm' });
        }
    }

    /**
     * API: Lấy tỷ trọng doanh thu theo danh mục sản phẩm
     */
    static async getCategoryBreakdown(req, res) {
        try {
            const data = await SanPham.getCategoryRevenue();
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Lỗi getCategoryBreakdown:', error);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy cơ cấu danh mục' });
        }
    }

    /**
     * API: Lấy danh sách hóa đơn chi tiết
     */
    static async getInvoices(req, res) {
        try {
            const { fromDate, toDate, storeId } = req.query;
            const data = await HoaDon.getInvoiceList({ fromDate, toDate, storeId });
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Lỗi getInvoices:', error);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy danh sách hóa đơn' });
        }
    }

    /**
     * NGHIỆP VỤ XUẤT FILE BÁO CÁO EXCEL CHUẨN KẾ TOÁN TÀI CHÍNH (.xlsx)
     */
    static async exportExcel(req, res) {
        try {
            const { fromDate, toDate, storeId } = req.query;
            const invoices = await HoaDon.getInvoiceList({ fromDate, toDate, storeId });
            const overview = await HoaDon.getOverview({ fromDate, toDate, storeId });

            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Hệ thống Quản lý Siêu thị Mini Anna';
            workbook.created = new Date();

            const sheet = workbook.addWorksheet('Báo cáo doanh thu', {
                views: [{ showGridLines: true }]
            });

            // Tiêu đề báo cáo
            sheet.mergeCells('A1:G1');
            const titleCell = sheet.getCell('A1');
            titleCell.value = 'CHUỖI SIÊU THỊ MINI ANNA HÀ NỘI';
            titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF1E3A8A' } };
            titleCell.alignment = { horizontal: 'center' };

            sheet.mergeCells('A2:G2');
            const subTitle = sheet.getCell('A2');
            subTitle.value = 'BÁO CÁO THỐNG KÊ DOANH THU BÁN HÀNG';
            subTitle.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF0F172A' } };
            subTitle.alignment = { horizontal: 'center' };

            sheet.mergeCells('A3:G3');
            const dateFilterCell = sheet.getCell('A3');
            dateFilterCell.value = `Khoảng thời gian: ${fromDate || 'Tất cả'} đến ${toDate || 'Hiện tại'}`;
            dateFilterCell.font = { name: 'Arial', size: 11, italic: true };
            dateFilterCell.alignment = { horizontal: 'center' };

            // Khối tóm tắt KPI
            sheet.addRow([]);
            const sumRow1 = sheet.addRow(['TỔNG DOANH THU:', Number(overview.tong_doanh_thu), '', 'SỐ LƯỢNG ĐƠN:', Number(overview.so_don_hang)]);
            sumRow1.getCell(1).font = { bold: true };
            sumRow1.getCell(2).font = { bold: true, color: { argb: 'FF047857' } };
            sumRow1.getCell(2).numFmt = '#,##0 "đ"';
            sumRow1.getCell(4).font = { bold: true };

            sheet.addRow([]);

            // Header bảng
            const headerRow = sheet.addRow([
                'STT',
                'Mã Hóa Đơn',
                'Ngày Lập',
                'Thu Ngân',
                'Phương Thức TT',
                'Trạng Thái',
                'Thành Tiền (VNĐ)'
            ]);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF2563EB' }
                };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Đổ dữ liệu các dòng
            invoices.forEach((inv, index) => {
                const ptMap = {
                    'TIEN_MAT': 'Tiền mặt',
                    'CHUYEN_KHOAN_QR': 'Chuyển khoản QR',
                    'THE_ATM': 'Thẻ ATM/POS'
                };
                const row = sheet.addRow([
                    index + 1,
                    inv.ma_hoa_don,
                    inv.ngay_lap,
                    inv.nv_thu_ngan,
                    ptMap[inv.phuong_thuc_tt] || inv.phuong_thuc_tt,
                    'Đã thanh toán',
                    Number(inv.thanh_tien)
                ]);

                row.getCell(1).alignment = { horizontal: 'center' };
                row.getCell(2).alignment = { horizontal: 'center' };
                row.getCell(3).alignment = { horizontal: 'center' };
                row.getCell(5).alignment = { horizontal: 'center' };
                row.getCell(6).alignment = { horizontal: 'center' };
                row.getCell(7).numFmt = '#,##0 "đ"';

                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
                    };
                });
            });

            // Set column width
            sheet.columns = [
                { width: 8 },
                { width: 20 },
                { width: 22 },
                { width: 24 },
                { width: 20 },
                { width: 18 },
                { width: 22 }
            ];

            // Trả về file Excel dạng stream
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=BaoCaoDoanhThu_Anna_${Date.now()}.xlsx`
            );

            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Lỗi exportExcel:', error);
            return res.status(500).json({ success: false, message: 'Lỗi khi tạo file Excel báo cáo' });
        }
    }
}

module.exports = DoanhThuController;
