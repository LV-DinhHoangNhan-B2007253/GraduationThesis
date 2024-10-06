import { Address } from "./adress.interface";

export interface IRegisterForm {
    email: string;
    name: string;
    password: string;
}

export interface ILoginFrom {
    email: string;
    password: string;
}

export interface UserInfo {
    _id: string;
    name: string;
    avatarUrl: string;
    email: string;
    phone_number: string;
    role: string;
    addresses: Address;
    wishlist: any[];
    orders: any[];
    cart: any[];
    comments: any[];
}

export interface UserState {
    userInfo: UserInfo | undefined;
    loading: boolean;
    error: string | undefined;
}

export interface IUserUpdateInfo {
    name: string,
    phone_number: string,
    addresses: Address
}