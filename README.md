# StyleVidia App
## migrate database

### generate a migration script
- cd services
- npm install
- npm run migrate:create ./migrations/scripts/[name of file]

### execute migrations scripts
- after deploy, get outputs from RDS stack
```
Stack local-style-vidia-stacks-RDSStack
  Status: no changes
  Outputs:
    rdsArn: arn:aws:rds:us-west-2:399139363696:cluster:local-style-vidia-stacks-rds
    rdsDatabase: stylevidiadb
    rdsSecretArn: arn:aws:secretsmanager:us-west-2:399139363696:secret:rdsClusterSecret694AB211-Nesu4AsVYsHZ-BwoKZn
```

- put it into file .env.[stage]
```
RDS_DATABASE = stylevidiadb
RDS_ARN = arn:aws:rds:us-west-2:399139363696:cluster:local-style-vidia-stacks-rds
RDS_SECRET_ARN = arn:aws:secretsmanager:us-west-2:399139363696:secret:rdsClusterSecret694AB211-Nesu4AsVYsHZ-BwoKZn
```
- config aws credentials
- run command: npm run migrate:up:[stage]