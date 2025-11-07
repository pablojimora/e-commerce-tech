export interface Email {
    to:string;
    subject:string;
    html:string;
}

export interface ApiResponse<T>{
    res?:string;
    error:string;
}

