# cubingitaly.org
**Requirements**

 - Node
 - Mysql

**Install**

    git clone https://github.com/CubingItaly/cubingitaly.org.git && cd cubingitaly.org
    npm install

**DB setup**
Database must be configured ormconfig.json

    mysql -u username -p
    create database dbname

**Run in development mode mode**

    npm run start

**Config Models**
ormconfig.model.json
server/secrets/keys.model.ts