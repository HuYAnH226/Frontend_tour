

export interface Tour {
  maTour: string;
  tenTour: string;
  diemKhoiHanh: string;
  diemDen: string;
  soNgay: number;
  soChoToiDa: number;
  giaTour: number;
  trangThai: boolean;
  ngayTao: string;
  tongChoConLai: number;
  soLuong: number; 
  tinhTrang: string;
}

export interface LichTrinhDto {
  loai: string;
  moTa: string;
  tenDiaDiem: string | null;
  tenDichVu: string | null;
}

export interface LichKhoiHanhDto {
  idLich: number;
  ngayKhoiHanh: string;
  ngayKetThuc: string;
  soChoConLai: number;
}

export interface TourDetail {
  maTour: string;
  tenTour: string;
  diemKhoiHanh: string;
  tenDiaDiemDen: string | null;
  moTa: string;
  soNgay: number;
  soChoToiDa: number;
  giaTour: number;
  trangThai: boolean;
  ngayTao: string;
  lichTrinh: LichTrinhDto[];
  lichKhoiHanh: LichKhoiHanhDto[];
}