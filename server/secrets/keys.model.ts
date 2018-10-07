export const keys = {
    wca: {
        redirect_uri: "domain/auth/wca/callback",
        user_agent: "domain",
        scope: "public email",
        client_id: "clientid",
        client_secret: "clientsecret"
    },
    session: {
        secret: 'secret',
        cookie: {
            secure: false,
            maxAge: 1000 * 3600 * 24 * 7 //7 days
        }
    },
    admin: {
        shortname: "admin",
        name: "Admin",
        id: 1234567890
    },
    db: {
        host: 'localhost',
        user: 'user',
        password: "",
        database: "dbname"
    },
    contact: {
        from: "",
        to: "",
        subject: "Cubingitaly.org - Form di contatto"
    }
}