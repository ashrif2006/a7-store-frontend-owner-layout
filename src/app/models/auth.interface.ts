export interface loginResponse {
    token: string;
}

export interface registerRequest {
    name:string;
    email:string;
    password:string;
    slug:string;
    whatsapp_number:string;
}

export interface registerResponse {
    token: string;
    store:{
        name:string;
        slug:string;
    }
}