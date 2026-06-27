export interface User {
    id: number,
    username: string,
    email: string,
    password: string,
}

export interface UserCredentials{
    email: string,
    password: string,
}

export interface RegisterData extends UserCredentials {
    username: string,
}
