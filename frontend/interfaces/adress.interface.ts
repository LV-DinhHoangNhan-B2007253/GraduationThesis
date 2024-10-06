export interface Ward {
    ward_id: string;

    ward_name: string;
}

// Định nghĩa lớp District
export interface District {
    district_id: string;

    district_name: string;
}

// Định nghĩa lớp Province
export interface Province {
    province_id: string;

    province_name: string;
}

// Định nghĩa lớp Address
export interface Address {
    province: Province;

    district: District;

    ward: Ward;

    detail: string; // Chi tiết địa chỉ
}