export const keys = {
    wca: {
        redirect_uri: "http://localhost:4200/auth/wca/callback",
        user_agent: "http://localhost:4200",
        scope: "public email",
        client_id: "fe0ab58ff738566ec4f41075f31cb6b2632e43550ac2d49d5db8191ec4713204",
        client_secret: "2ee6b32e1b0645b656eec53d41aa7822b2fd83b21d61a74fdb7f654e87b2069a"
    },
    session: {
        secret: 'ciaone amiconi di raksalk',
        cookie:{
            secure: false,
            maxAge: 1000*3600*24 //1 day
        }
    },
    admin:{
        shortname: "drago",
        name: "Admin",
        id:397
    }
}