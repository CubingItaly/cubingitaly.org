export const keys = {
    wca: {
        redirect_uri: "http://localhost:4200/auth/wca/callback",
        user_agent: "http://localhost:4200",
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
        shortname: "drago",
        id: 1234567890
    }
}