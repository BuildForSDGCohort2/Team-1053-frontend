export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    key: string;
}

export interface Customer {
    name: string;
    first_name: string;
    last_name: string;
    address: string;
    phone: string;
    city: string;
    state: string;
    postalCode: string;
}

export interface ProductInterface {
    id: number;
    name: string;
    price: number;
    stock: string;
    code: string;
    date_created: Date;
    tags: string[];
}

export interface StockInterface {
    id: number;
    category: string;
    quantity: number;
    date_added: Date;
}
