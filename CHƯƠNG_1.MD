# BÁO CÁO BÀI TẬP LỚN
## MÔN HỌC: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG THÔNG TIN
### ĐỀ TÀI: PHÂN TÍCH, THIẾT KẾ VÀ CÀI ĐẶT MODULE THỐNG KÊ & BÁO CÁO DOANH THU CHO HỆ THỐNG QUẢN LÝ CHUỖI SIÊU THỊ MINI ANNA

---

# CHƯƠNG I: GIỚI THIỆU ĐỀ TÀI VÀ LỰA CHỌN CÔNG NGHỆ

## 1.1. GIỚI THIỆU ĐỀ TÀI

### 1.1.1. Bối cảnh và Lý do chọn đề tài
Trong kỷ nguyên số và sự phát triển vượt bậc của thương mại hiện đại, mô hình chuỗi cửa hàng tiện lợi và siêu thị mini (Mini-mart) đang trở thành xu hướng mua sắm phổ biến tại các đô thị lớn nhờ tính tiện lợi, vị trí phân bổ gần các khu dân cư và sự đa dạng của các mặt hàng tiêu dùng thiết yếu. Chuỗi Siêu thị Mini Anna là một mô hình kinh doanh bán lẻ tiêu biểu tại khu vực Hà Nội với nhiều điểm bán (chi nhánh) phục vụ hàng nghìn lượt khách hàng mỗi ngày.

Tuy nhiên, cùng với tốc độ mở rộng về quy mô và số lượng giao dịch, công tác quản lý vận hành đang đối mặt với nhiều thách thức lớn:
- **Khối lượng dữ liệu giao dịch khổng lồ**: Mỗi ngày, hệ thống ghi nhận hàng trăm đến hàng nghìn hóa đơn với danh mục hàng hóa đa dạng từ thực phẩm tươi sống, đồ uống, hóa mỹ phẩm đến đồ gia dụng.
- **Phương pháp quản lý truyền thống bộc lộ nhiều hạn chế**: Việc tổng hợp doanh số qua sổ sách hoặc các bảng tính Excel thủ công thường tốn nhiều thời gian, dễ xảy ra sai sót trong quá trình nhập liệu và đối soát, đặc biệt là khi áp dụng nhiều hình thức thanh toán (tiền mặt, quét mã QR/chuyển khoản, thanh toán thẻ).
- **Thiếu tính tức thời trong hỗ trợ ra quyết định**: Ban lãnh đạo và người quản lý chuỗi siêu thị không thể nắm bắt được diễn biến doanh thu theo thời gian thực (Real-time). Việc chậm trễ trong báo cáo khiến nhà quản lý khó đưa ra các quyết định kịp thời về điều phối nguồn hàng, nhập thêm hàng hóa bán chạy hoặc tung ra các chương trình khuyến mãi kích cầu đối với các nhóm hàng có doanh thu thấp.

Xuất phát từ thực tế đó, việc xây dựng một hệ thống thông tin quản lý bán hàng nói chung và đặc biệt là phát triển chuyên sâu **Module Thống kê và Báo cáo Doanh thu** nói riêng là vô cùng cấp thiết. Phân hệ này đóng vai trò là "bộ não điều hành tài chính", giúp tự động hóa khâu tổng hợp dữ liệu, trực quan hóa các chỉ số kinh doanh dưới dạng đồ thị sinh động và xuất báo cáo đối soát định kỳ, góp phần tối ưu hóa hiệu quả kinh doanh và nâng cao năng lực cạnh tranh cho chuỗi siêu thị Mini Anna.

### 1.1.2. Mục tiêu xây dựng hệ thống
Đề tài hướng tới các mục tiêu cụ thể sau:
1. **Mục tiêu phân tích và thiết kế**:
   - Vận dụng bài bản phương pháp luận Phân tích và Thiết kế Hệ thống Hướng đối tượng (OOAD) theo chuẩn UML dựa trên giáo trình của Học viện Công nghệ Bưu chính Viễn thông.
   - Xây dựng đầy đủ các mô hình chức năng (Use Case Diagram, Use Case Scenario), mô hình tĩnh (Class Diagram) và mô hình động (Sequence Diagram) theo chuẩn kiến trúc 3 lớp: Lớp Giao diện (Boundary), Lớp Xử lý/Điều khiển (Control), và Lớp Thực thể (Entity).
2. **Mục tiêu chức năng của Module Thống kê & Báo cáo Doanh thu**:
   - **Thống kê linh hoạt theo thời gian**: Cho phép người quản lý truy vấn doanh thu theo ngày, theo tuần, theo tháng, theo quý, theo năm hoặc trong một khoảng ngày bất kỳ do người dùng lựa chọn.
   - **Đo lường các chỉ số kinh doanh then chốt (KPIs)**: Tự động tổng hợp tổng doanh thu thực tế, số lượng đơn hàng hoàn thành, giá trị trung bình trên mỗi đơn hàng (AOV - Average Order Value), và phân loại doanh thu theo từng phương thức thanh toán.
   - **Trực quan hóa dữ liệu (Data Visualization)**: Cung cấp biểu đồ đường (Line Chart) biểu diễn xu hướng tăng trưởng doanh thu theo thời gian; biểu đồ tròn (Pie/Doughnut Chart) thể hiện cơ cấu doanh thu theo từng danh mục hàng hóa; biểu đồ cột (Bar Chart) vinh danh Top các mặt hàng bán chạy nhất.
   - **Xuất báo cáo định kỳ**: Cho phép trích xuất toàn bộ dữ liệu thống kê ra file bảng tính Excel (.xlsx) chuẩn mẫu biểu tài chính phục vụ công tác lưu trữ và đối soát kế toán.
3. **Mục tiêu phi chức năng**:
   - Giao diện thân thiện, hiện đại, dễ thao tác đối với nhân sự quản lý.
   - Tốc độ xử lý và truy vấn tổng hợp dữ liệu nhanh chóng, đảm bảo tính toàn vẹn và chính xác tuyệt đối của số liệu tài chính.

### 1.1.3. Phạm vi đề tài và Đối tượng sử dụng
- **Phạm vi hệ thống**: Đề tài tập trung phân tích, thiết kế và hiện thực hóa chức năng thuộc phân hệ **Thống kê và Báo cáo Doanh thu** trong hệ sinh thái quản lý siêu thị mini Anna, tích hợp với các bảng dữ liệu thực thể về Hóa đơn (`HoaDon`), Chi tiết hóa đơn (`ChiTietHoaDon`), Sản phẩm (`SanPham`), Danh mục (`DanhMuc`) và Nhân viên (`NhanVien`).
- **Đối tượng sử dụng hệ thống**:
  - *Chủ hệ thống / Tổng quản lý chuỗi siêu thị*: Theo dõi bức tranh toàn cảnh doanh số, so sánh hiệu quả kinh doanh giữa các mốc thời gian để đưa ra chiến lược kinh doanh dài hạn.
  - *Quản lý cửa hàng (Store Manager)*: Nắm bắt sát sao tình hình bán hàng hàng ngày, quản lý dòng tiền vào và xuất báo cáo kết ca / kết ngày.
  - *Kế toán*: Sử dụng dữ liệu báo cáo chi tiết để đối soát doanh thu với số lượng hàng tồn kho và các tài khoản ngân hàng.

### 1.1.4. Kết quả dự kiến đạt được
- Bản tài liệu đặc tả và thiết kế hệ thống chi tiết bao gồm: Biểu đồ Use Case, kịch bản chi tiết, Biểu đồ tuần tự (Sequence Diagram), Biểu đồ lớp (Class Diagram) và Thiết kế cơ sở dữ liệu quan hệ (ERD).
- Một module ứng dụng web hoàn chỉnh, có khả năng chạy thực tế trên máy tính cá nhân, kết nối cơ sở dữ liệu và hiển thị đầy đủ giao diện thống kê biểu đồ doanh thu tương tác cao.
- Chức năng xuất dữ liệu báo cáo định dạng Microsoft Excel hoạt động chính xác.

---

## 1.2. LỰA CHỌN CÔNG NGHỆ XÂY DỰNG HỆ THỐNG

Để hiện thực hóa module phần mềm đáp ứng đúng yêu cầu của môn học Phân tích và Thiết kế Hệ thống Thông tin, đồng thời tối ưu hóa tính tương thích với môi trường phát triển thực tế của máy tính cá nhân, nhóm thực hiện đã nghiên cứu và lựa chọn ngăn xếp công nghệ (Technology Stack) hiện đại, phổ biến và có tính mở rộng cao.

### 1.2.1. Lựa chọn công nghệ phía Client (Frontend)
Phía giao diện người dùng đòi hỏi tính trực quan, độ mượt mà cao và khả năng hiển thị các biểu đồ thống kê động linh hoạt.

* **Công nghệ lựa chọn**: **React.js kết hợp Tailwind CSS và thư viện đồ họa Chart.js**
* **Lý do lựa chọn**:
  - **React.js**: Là một thư viện JavaScript mã nguồn mở được phát triển bởi Meta, cho phép xây dựng giao diện người dùng dựa trên các thành phần (Component-based architecture). Điều này giúp module hóa giao diện của trang Thống kê doanh thu thành các khối độc lập: Khối Bộ lọc thời gian (Filter Component), Khối Thẻ chỉ số (Stat Cards Component), Khối Biểu đồ (Chart Components), và Khối Bảng kê hóa đơn (Data Table Component). Cơ chế Virtual DOM của React giúp cập nhật lại số liệu trên biểu đồ gần như tức thì khi người quản trị thay đổi điều kiện lọc mà không phải tải lại toàn bộ trang web.
  - **Tailwind CSS**: Framework CSS theo triết lý Utility-First giúp thiết kế giao diện Dashboard theo phong cách hiện đại, tinh gọn, chuẩn giao diện các hệ thống ERP/CRM cao cấp hiện nay.
  - **Chart.js**: Thư viện vẽ biểu đồ JavaScript mạnh mẽ hàng đầu thế giới trên nền tảng HTML5 Canvas. Chart.js hỗ trợ đầy đủ các dạng đồ thị như Line Chart, Bar Chart, Doughnut Chart với hiệu ứng chuyển động (animation) mượt mà, hỗ trợ tooltip hiển thị chi tiết số tiền khi rê chuột và tự động co giãn theo kích thước màn hình (Responsive design).

### 1.2.2. Lựa chọn công nghệ phía Server (Backend)
Phía máy chủ chịu trách nhiệm tiếp nhận yêu cầu từ client, thực thi các nghiệp vụ tính toán tổng hợp, kết nối cơ sở dữ liệu và xuất file báo cáo.

* **Công nghệ lựa chọn**: **Node.js với framework Express.js**
* **Lý do lựa chọn**:
  - **Khả năng ánh xạ chuẩn mô hình 3 lớp của môn PTTKHTTT**:
    - *Lớp Biên (Boundary)*: Hệ thống Routes và Middleware của Express tiếp nhận yêu cầu HTTP từ giao diện web (`W_DoanhThu`).
    - *Lớp Điều khiển (Control)*: Được cài đặt qua các Controller chuyên trách (`DoanhThuController`), chịu trách nhiệm tiếp nhận tham số ngày tháng, điều phối nghiệp vụ và gọi các phương thức tổng hợp từ tầng thực thể.
    - *Lớp Thực thể (Entity)*: Tương ứng với các Model đại diện cho bảng dữ liệu (`HoaDon`, `ChiTietHoaDon`, `SanPham`), đảm nhận việc tương tác truy vấn dữ liệu trực tiếp từ CSDL.
  - **Hiệu năng và mô hình Bất đồng bộ (Asynchronous Event-driven)**: Node.js xử lý I/O non-blocking cực tốt, đặc biệt phù hợp với các tác vụ truy vấn gom nhóm dữ liệu (Aggregation Queries) từ CSDL mà không gây tắc nghẽn luồng xử lý chính.
  - **Hệ sinh thái phong phú**: Tích hợp thư viện **`exceljs`** giúp tạo trực tiếp file bảng tính Microsoft Excel (.xlsx) với đầy đủ định dạng: tiêu đề bảng in đậm, căn chỉnh lề, định dạng tiền tệ VND (`#,##0 đ`) và tô màu các dòng tiêu đề một cách chuyên nghiệp.

### 1.2.3. Lựa chọn Hệ quản trị Cơ sở dữ liệu
Hệ thống quản lý chuỗi siêu thị yêu cầu một cơ sở dữ liệu có tính nhất quán cao, hỗ trợ quan hệ chặt chẽ giữa Hóa đơn và Chi tiết sản phẩm bán ra.

* **Công nghệ lựa chọn**: **Hệ quản trị CSDL quan hệ MySQL (sử dụng trên gói XAMPP / MariaDB)**
* **Lý do lựa chọn**:
  - **Đảm bảo tính toàn vẹn dữ liệu (ACID Compliance)**: MySQL là RDBMS chuẩn mực, hỗ trợ khóa chính (Primary Key), khóa ngoại (Foreign Key) để liên kết chặt chẽ giữa bảng `HoaDon` và bảng `ChiTietHoaDon`, ngăn ngừa hiện tượng sai lệch hoặc mồ côi dữ liệu khi bán hàng.
  - **Hỗ trợ mạnh mẽ các hàm tổng hợp theo thời gian**: MySQL cung cấp sẵn bộ hàm ngày tháng và tính toán thống kê phong phú như `SUM()`, `COUNT()`, `AVG()`, `DATE()`, `YEAR()`, `MONTH()`, `DATE_FORMAT()`, kết hợp với mệnh đề `GROUP BY` và `HAVING` giúp tính toán doanh thu theo từng mốc thời gian một cách nhanh chóng ngay tại tầng cơ sở dữ liệu.
  - **Khả năng đánh chỉ mục (Indexing) tối ưu**: Hỗ trợ đánh chỉ mục trên trường `ngay_tao` (ngày lập hóa đơn) và `trang_thai` (trạng thái thanh toán) giúp tăng tốc độ truy vấn báo cáo ngay cả khi bảng hóa đơn có hàng trăm nghìn bản ghi.
  - **Tính phổ biến và dễ triển khai**: Gói phần mềm XAMPP được tích hợp sẵn trên máy tính của người dùng, đi kèm công cụ giao diện trực quan phpMyAdmin giúp quản lý cơ sở dữ liệu, kiểm tra bảng và chạy thử nghiệm các câu lệnh SQL một cách dễ dàng và minh bạch.

---

## 1.3. KẾT LUẬN CHƯƠNG I

Chương I đã giới thiệu một cách toàn diện về bối cảnh thực tiễn của Chuỗi Siêu thị Mini Anna, làm rõ tính cấp thiết của việc xây dựng Module Thống kê và Báo cáo Doanh thu nhằm nâng cao năng lực quản lý tài chính và hỗ trợ ra quyết định kinh doanh. Đồng thời, chương này cũng đã xác định rõ mục tiêu, phạm vi nghiên cứu, đối tượng sử dụng và đưa ra những lập luận chặt chẽ để lựa chọn ngăn xếp công nghệ: **React.js + Chart.js (Frontend)**, **Node.js Express (Backend theo mô hình 3 lớp)** và **MySQL (CSDL)**.

Những nội dung và định hướng công nghệ được xác lập trong Chương I chính là nền tảng vững chắc để triển khai các bước Phân tích và Thiết kế chi tiết cho module ở **Chương II** (xây dựng biểu đồ Use Case, kịch bản nghiệp vụ, biểu đồ lớp thực thể, biểu đồ tuần tự và lược đồ CSDL) cũng như hiện thực hóa cài đặt ứng dụng thực tế ở **Chương III**.
