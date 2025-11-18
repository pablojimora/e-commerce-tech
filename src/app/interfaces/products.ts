export interface Product{
    _id?: string;
    sku: number;
    name: string;
    brand: string;
    quantity:number;
    price:number;
    isActive:boolean;
    category: string;
    imageUrl:string;
    createdAt: Date;
}

export interface ApiResponse<T> {
    ok?:boolean;
    data?:T;
    error?:string;
}

