# STUDENT RANT API

### installation

`npm install`


### test

**e2e test**
`npm run test:e2e`

**unit test**
`npm run test:unit`


**run both e2e and unit test together**
`npm test`

### lint

`npm run lint`


### lint fix

`npm run lint:fix`


### generate html documentation

`npm run doc`

### pushing documentation to upstream
```bash
$ cd html-doc
$ git push origin
```


### start up mongodb database

```bash
$ npm run docker:up
$ npm run db:start
```

### stop mongodb database

```bash
$ npm run db:stop
```

### purge mongodb database (deletes the entire database)

```bash
$ npm run db:drop
```
### start local server

`npm run start:dev`

### start local server in development mode
`npm run start:dev:watch`
