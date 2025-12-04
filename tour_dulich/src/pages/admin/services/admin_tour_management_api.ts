

import type { Tour, TourDetail } from '../tourmng/tour';


export async function fetchAllTours(): Promise<Tour[]> {
  const url = `/api/thong-ke/all-tours`;
  
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

// Lấy chi tiết tour
export async function fetchTourDetail(maTour: string): Promise<TourDetail> {
  const url = `/api/tour/${maTour}`;
  
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

// Toggle trạng thái tour (ẩn/hiện)
export async function toggleTourStatus(maTour: string): Promise<{
  maTour: string;
  trangThai: boolean;
  message: string;
}> {
  const url = `/api/thong-ke/toggle-tour-status/${maTour}`;
  
  console.log("🔍 Calling API:", url);

  const res = await fetch(url, {
    method: "PUT",
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