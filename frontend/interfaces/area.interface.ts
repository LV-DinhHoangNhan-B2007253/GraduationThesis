import { ICategory } from "./category.interface"

export interface ICreateArea {
    name: string,
    banner: File | null
}

export interface IArea {
    _id: string
    name: string,
    banner: string,
    categoryItem?: ICategory[]
}