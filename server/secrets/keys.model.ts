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
        cookie:{
            secure: false,
            maxAge: 1000*3600*24 //1 day
        }
    },
    admin:{
        shortname: "admin",
        name: "Admin",
        id: 1234567890
    }
}