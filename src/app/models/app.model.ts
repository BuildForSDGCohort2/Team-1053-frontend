export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    key: string;
}

export interface Customer {
    username: string;
    first_name: string;
    last_name: string;
    address: string;
    mobile: string;
    city: string;
    street: string;
    profile_pic: string;
    postal_code: string;
    grandTotal: number;
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

export interface OrderItem {
    id: number;
    cost: number;
    product: string;
    price_per_item: number;
    quantity: number;

}

export interface OrderedItem {
    cost: number;
    id: number;
    is_ordered: boolean;
    item: string;
    price_per_item: number;
    product: number;
    quantity: number;
}

export interface OrderInterface {
    name: string;
    id: number;
    status: string;
    order_id: string;
    grand_total: number;
    date_created: string;
    order_items: OrderedItem[];
    payment_option: string;
    first_name: string;
    last_name: string;
}

