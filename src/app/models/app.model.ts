export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    key: string;
    is_staff: boolean;
    joined: Date;
    last_login: Date;
}

export interface Customer {
    user: User;
    address: string;
    mobile: string;
    city: string;
    street: string;
    profile_pic: string;
    postal_code: string;
    grandTotal: number;
    id: number;
}

export interface ProductInterface {
    id: number;
    name: string;
    price: number;
    stock: number;
    code: string;
    description: string;
    date_created: Date;
    tags: string[];
    image: string;
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
    product: number;
    product_name: string;
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
    orderitem_set: OrderedItem[];
    payment_option: string;
    first_name: string;
    last_name: string;
    is_paid: boolean;
}

