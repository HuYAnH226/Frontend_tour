// API cho thống kê tour theo doanh thu
export async function fetchRevenueByTour(start: string, end: string) {
  // URL khớp với ThongKeController: /api/admin/thongke/doanhthu-theo-tour
  const url = `/api/thong-ke/revenue-by-tour?startDate=${start}&endDate=${end}`;
  
  console.log("🔍 Calling API:", url);

  const res = await fetch(url, { 
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  console.log("📡 Response status:", res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error:", errorText);
    throw new Error(`Server returned ${res.status}`);
  }
  
  const data = await res.json();
  console.log("✅ Data:", data);
  return data;
}

// API cho danh sách hóa đơn theo tour
export async function fetchInvoicesByTour(maTour: string, start: string, end: string) {
  // URL khớp với ThongKeController: /api/admin/thongke/hoadon-theo-tour/{maTour}
  const url = `/api/thong-ke/invoices-by-tour?maTour=${maTour}`;
  
  console.log("🔍 Calling API:", url);

  const res = await fetch(url, { 
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  console.log("📡 Response status:", res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error:", errorText);
    throw new Error(`Server returned ${res.status}`);
  }
  
  const data = await res.json();
  console.log("✅ Data:", data);
  return data;
}