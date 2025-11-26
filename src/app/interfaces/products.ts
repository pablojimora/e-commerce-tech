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

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ApiResponse<T> {
    ok?:boolean;
    data?:T;
    error?:string;
    pagination?: PaginationInfo;
}

