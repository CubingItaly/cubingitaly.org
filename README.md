
# cubingitaly.org

**Installation**

    git clone https://github.com/CubingItaly/cubingitaly.org.git && cd cubingitaly.org
    cp ormconfig.model.json ormconfig.json
    cp server/secrets/keys.model.ts server/secrets/keys.ts
    npm install
Before running the system you need to configure both ormconfig.json with the database information and keys.ts with secret codes.

You also need to create a database:

    create database database_name
**Run in development mode**

    npm run start
    
**Testing environment**
The application was tested with MySQL
