export interface IRegisterForm {
    email: string;
    name: string;
    password: string;
}

export interface ILoginFrom {
    email: string;
    password: string;
}

// types.ts
export interface Address {
    addressDetail: string;
    region: string;
    _id: string;
}

export interface UserInfo {
    _id: string;
    name: string;
    avatarUrl: string;
    email: string;
    phone_number: string;
    role: number;
    addresses: Address;
    wishlist: any[];
    orders: any[];
    cart: any[];
    comments: any[];
}

export interface UserState {
    userInfo: UserInfo | null;
    loading: boolean;
    error: string | null;
}