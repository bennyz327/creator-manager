export type SCHEMA_creators = {
    id: number;
    start_at: string;
    end_at: string;
}

export type SCHEMA_creators_list = {
    creator_id: number;
    start_at: string;
    end_at: string;
}

export type SCHEMA_creator_identities = {
    creator_id: number;
    display_name: string;
    scoped_id: number;
    scoped_name: string;
}

export type SCHEMA_product_types = {
    id: number;
    name: string;
}