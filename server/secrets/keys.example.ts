export const keys = {
    wca: {
        prod: {
            redirect_uri: "websitedomain/api/v0/auth/wca/callback",
            user_agent: "websitedomain",
            scope: "public",
            client_id: "client id",
            client_secret: "client secret"
        },
        dev: {
            redirect_uri: "http://localhost:4200/api/v0/auth/wca/callback",
            user_agent: "http://localhost:4200",
            scope: "public",
            client_id: "client id",
            client_secret: "client secret"
        }
    },
    session: {
        secret: 'secret',
        cookie: {
            secure: false,
            maxAge: 1000 * 3600 * 24 * 7
        }
    },
    admin: {
        shortname: "admin",
        name: "Admin",
        id: 0
    },
    mail: {
        from: "no-reply@websitedomain",
        to: "",
        subject: "Form di contatto",
        auth: {
            api_key: "api key",
            domain: "email server domain"
        }
    },
    db: {},
    test: {
        db: {
            host: '',
            user: '',
            password: "",
            database: ""
        }
    }
}
