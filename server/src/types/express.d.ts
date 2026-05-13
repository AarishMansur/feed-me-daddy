

declare global{
    namespace Express{
        interface Request{
            session?:any,
            googleAccount?:any
        }
    }
}

export {};