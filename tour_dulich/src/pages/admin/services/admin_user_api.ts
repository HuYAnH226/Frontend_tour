export async function getUsers() {
  const res = await fetch("http://localhost:8080/api/user/all");

  if (!res.ok) {
    throw new Error("Lỗi khi gọi API /api/admin/users");
  }

  return res.json();
}
