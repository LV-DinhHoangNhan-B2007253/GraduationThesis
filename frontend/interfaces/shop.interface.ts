interface ICreateShopForm {
    name: string;
    description: string;
    logoUrl?: File;
    shopBanner?: File;
    shopLocation: string;
    shopMail: string;
    shopPhone: string;
}

interface IShop {
    _id: string,
    name: string,
    description: string,
    owner: string,
    logoUrl: string,
    shopBanner: string,
    isActive: boolean,
    shopMail: string,
    shopPhone: string,
    shopLocation: string
}
