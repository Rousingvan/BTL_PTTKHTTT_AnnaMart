/**
 * SCRIPT ĐIỀU KHIỂN FRONTEND DASHBOARD
 * Gọi RESTful API, render biểu đồ Chart.js và xử lý sự kiện người dùng
 */

// Lưu trữ các đối tượng biểu đồ Chart.js để destroy và re-render khi lọc
let timelineChartInstance = null;
let categoryChartInstance = null;
let topProductsChartInstance = null;
let allInvoicesData = [];

// Hàm định dạng tiền tệ VNĐ
function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
}

// Khởi chạy khi DOM load xong
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    loadDashboardData();
    setupEventListeners();
});

function initFilters() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('inputToDate').value = today;

    // 7 ngày trước
    const d = new Date();
    d.setDate(d.getDate() - 7);
    document.getElementById('inputFromDate').value = d.toISOString().split('T')[0];
}

function setupEventListeners() {
    // Sự kiện thay đổi bộ lọc nhanh
    document.getElementById('selectQuickFilter').addEventListener('change', (e) => {
        const val = e.target.value;
        const now = new Date();
        const toDateInput = document.getElementById('inputToDate');
        const fromDateInput = document.getElementById('inputFromDate');

        if (val === 'today') {
            const todayStr = now.toISOString().split('T')[0];
            fromDateInput.value = todayStr;
            toDateInput.value = todayStr;
        } else if (val === 'last7days') {
            toDateInput.value = now.toISOString().split('T')[0];
            const d = new Date();
            d.setDate(d.getDate() - 7);
            fromDateInput.value = d.toISOString().split('T')[0];
        } else if (val === 'thisMonth') {
            toDateInput.value = now.toISOString().split('T')[0];
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            fromDateInput.value = firstDay.toISOString().split('T')[0];
        } else if (val === 'all') {
            fromDateInput.value = '2026-01-01';
            toDateInput.value = now.toISOString().split('T')[0];
        }
        loadDashboardData();
    });

    // Nút Áp dụng lọc
    document.getElementById('btnApplyFilter').addEventListener('click', () => {
        loadDashboardData();
    });

    // Nút Xuất Báo Cáo Excel
    document.getElementById('btnExportExcel').addEventListener('click', () => {
        const fromDate = document.getElementById('inputFromDate').value;
        const toDate = document.getElementById('inputToDate').value;
        const storeId = document.getElementById('selectStore').value;

        const downloadUrl = `/api/revenue/export-excel?fromDate=${fromDate}&toDate=${toDate}&storeId=${storeId}`;
        window.location.href = downloadUrl;
    });

    // Tìm kiếm trong bảng hóa đơn
    document.getElementById('inputTableSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allInvoicesData.filter(inv => 
            inv.ma_hoa_don.toLowerCase().includes(query) ||
            inv.nv_thu_ngan.toLowerCase().includes(query) ||
            inv.phuong_thuc_tt.toLowerCase().includes(query)
        );
        renderInvoicesTable(filtered);
    });
}

/**
 * Tải toàn bộ dữ liệu thống kê từ Backend API
 */
async function loadDashboardData() {
    const fromDate = document.getElementById('inputFromDate').value;
    const toDate = document.getElementById('inputToDate').value;
    const storeId = document.getElementById('selectStore').value;

    const queryParams = `?fromDate=${fromDate}&toDate=${toDate}&storeId=${storeId}`;

    try {
        // Gọi song song các API
        const [overviewRes, timelineRes, topRes, catRes, invRes] = await Promise.all([
            fetch(`/api/revenue/overview${queryParams}`).then(r => r.json()),
            fetch(`/api/revenue/timeline${queryParams}`).then(r => r.json()),
            fetch(`/api/revenue/top-products`).then(r => r.json()),
            fetch(`/api/revenue/category-breakdown`).then(r => r.json()),
            fetch(`/api/revenue/invoices${queryParams}`).then(r => r.json())
        ]);

        if (overviewRes.success) {
            renderOverview(overviewRes.data);
            renderPaymentStats(overviewRes.data);
        }

        if (timelineRes.success) {
            renderTimelineChart(timelineRes.data);
        }

        if (topRes.success) {
            renderTopProductsChart(topRes.data);
        }

        if (catRes.success) {
            renderCategoryChart(catRes.data);
        }

        if (invRes.success) {
            allInvoicesData = invRes.data;
            renderInvoicesTable(allInvoicesData);
        }

    } catch (error) {
        console.error('Lỗi tải dữ liệu dashboard:', error);
    }
}

/**
 * Hiển thị thẻ KPI
 */
function renderOverview(data) {
    document.getElementById('kpiTotalRevenue').textContent = formatVND(data.tong_doanh_thu);
    document.getElementById('kpiOrderCount').textContent = `${data.so_don_hang} đơn`;
    document.getElementById('kpiAOV').textContent = formatVND(data.gia_tri_trung_binh_don);
    document.getElementById('kpiQRRevenue').textContent = formatVND(data.chuyen_khoan_qr);
}

/**
 * Hiển thị danh sách kênh thanh toán
 */
function renderPaymentStats(data) {
    const total = Number(data.tong_doanh_thu) || 1;
    const items = [
        {
            name: 'Chuyển khoản QR / Momo / VNPay',
            iconClass: 'fa-solid fa-qrcode',
            colorClass: 'qr',
            amount: Number(data.chuyen_khoan_qr),
            pct: ((Number(data.chuyen_khoan_qr) / total) * 100).toFixed(1)
        },
        {
            name: 'Tiền mặt',
            iconClass: 'fa-solid fa-money-bill-wave',
            colorClass: 'cash',
            amount: Number(data.tien_mat),
            pct: ((Number(data.tien_mat) / total) * 100).toFixed(1)
        },
        {
            name: 'Thẻ ATM / Thẻ Tín Dụng',
            iconClass: 'fa-solid fa-credit-card',
            colorClass: 'card',
            amount: Number(data.the_atm),
            pct: ((Number(data.the_atm) / total) * 100).toFixed(1)
        }
    ];

    const container = document.getElementById('paymentStatsList');
    container.innerHTML = items.map(item => `
        <div class="payment-item">
            <div class="pay-left">
                <div class="pay-icon ${item.colorClass}"><i class="${item.iconClass}"></i></div>
                <div>
                    <strong>${item.name}</strong>
                </div>
            </div>
            <div class="pay-right">
                <span class="amount">${formatVND(item.amount)}</span>
                <span class="percent">${item.pct}% tổng doanh thu</span>
            </div>
        </div>
    `).join('');
}

/**
 * Vẽ biểu đồ đường: Biến động doanh thu theo ngày
 */
function renderTimelineChart(timelineData) {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    if (timelineChartInstance) timelineChartInstance.destroy();

    const labels = timelineData.map(d => {
        const parts = d.ngay.split('-');
        return `${parts[2]}/${parts[1]}`;
    });
    const values = timelineData.map(d => Number(d.doanh_thu));

    // Gradient màu xanh
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    timelineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: values,
                borderColor: '#2563eb',
                backgroundColor: gradient,
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: '#2563eb',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` Doanh thu: ${formatVND(ctx.raw)}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: (v) => (v >= 1000000 ? `${v / 1000000}Tr` : `${v / 1000}k`),
                        font: { family: 'Plus Jakarta Sans', size: 11 }
                    },
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
                }
            }
        }
    });
}

/**
 * Vẽ biểu đồ tròn: Tỷ trọng doanh thu theo danh mục
 */
function renderCategoryChart(categoryData) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    if (categoryChartInstance) categoryChartInstance.destroy();

    const labels = categoryData.map(c => c.ten_danh_muc);
    const dataValues = categoryData.map(c => Number(c.doanh_thu));

    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: [
                    '#2563eb',
                    '#10b981',
                    '#f59e0b',
                    '#6366f1',
                    '#ec4899'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 12 }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.label}: ${formatVND(ctx.raw)}`
                    }
                }
            }
        }
    });
}

/**
 * Vẽ biểu đồ cột: Top sản phẩm bán chạy nhất
 */
function renderTopProductsChart(topProducts) {
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    if (topProductsChartInstance) topProductsChartInstance.destroy();

    const labels = topProducts.map(p => p.ten_sp);
    const revenues = topProducts.map(p => Number(p.tong_doanh_thu));

    topProductsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh thu mang lại',
                data: revenues,
                backgroundColor: '#3b82f6',
                borderRadius: 6,
                maxBarThickness: 32
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // Biểu đồ nằm ngang
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` Doanh thu: ${formatVND(ctx.raw)}`
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        callback: (v) => `${(v / 1000).toLocaleString('vi-VN')}k`,
                        font: { family: 'Plus Jakarta Sans', size: 11 }
                    },
                    grid: { color: '#f1f5f9' }
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } }
                }
            }
        }
    });
}

/**
 * Đổ danh sách hóa đơn vào bảng
 */
function renderInvoicesTable(invoices) {
    const tbody = document.getElementById('invoicesTableBody');
    if (!invoices || invoices.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="padding: 24px; color: #94a3b8;">Không tìm thấy hóa đơn nào trong khoảng thời gian này</td></tr>`;
        return;
    }

    const ptMap = {
        'TIEN_MAT': '<span class="badge-status" style="background:#f1f5f9; color:#475569;"><i class="fa-solid fa-money-bill-1"></i> Tiền mặt</span>',
        'CHUYEN_KHOAN_QR': '<span class="badge-status" style="background:#e0f2fe; color:#0369a1;"><i class="fa-solid fa-qrcode"></i> QR Bank</span>',
        'THE_ATM': '<span class="badge-status" style="background:#ede9fe; color:#6d28d9;"><i class="fa-solid fa-credit-card"></i> Thẻ POS</span>'
    };

    tbody.innerHTML = invoices.map((inv, idx) => `
        <tr>
            <td style="color: #94a3b8; font-weight: 600;">#${idx + 1}</td>
            <td><strong>${inv.ma_hoa_don}</strong></td>
            <td>${inv.ngay_lap}</td>
            <td>${inv.ten_cua_hang || 'Anna - Cầu Giấy'}</td>
            <td>${inv.nv_thu_ngan}</td>
            <td>${ptMap[inv.phuong_thuc_tt] || inv.phuong_thuc_tt}</td>
            <td><span class="badge-status success"><i class="fa-solid fa-check"></i> Đã thanh toán</span></td>
            <td class="text-right" style="font-weight: 700; color: #047857;">${formatVND(inv.thanh_tien)}</td>
        </tr>
    `).join('');
}
