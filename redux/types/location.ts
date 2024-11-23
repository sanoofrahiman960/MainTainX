export interface Location {
    id: string;
    name: string;
    address: string;
    description: string;
    images: string[];  // Array of image URLs or base64 strings
    qrCode?: string;   // QR/Bar code data
    barCode?: string;  // Alternative bar code data
    teamsInCharge: string[];  // Array of team IDs or names
    vendors: {
        id: string;
        name: string;
        contact?: string;
    }[];
    files: {
        id: string;
        name: string;
        url: string;
        type: string;
    }[];
    parentLocationId?: string;  // Reference to parent location
    createdAt: string;
    updatedAt: string;
}

export interface Assets {
    id: string;
    name: string;
    description?: string;
}