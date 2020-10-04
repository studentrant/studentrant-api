# STUDENT RANT API

### installation

`yarn install`


### test

**e2e test**

`yarn test e2e`

**unit test**

`yarn test unit`


**run both e2e and unit test together**

`yarn test`

### lint

`yarn lint`


### lint fix

`yarn lint:fix`


### generate html documentation

`yarn doc`

### pushing documentation to upstream
```bash
$ cd html-doc
$ git push origin
```


### start up mongodb database

```bash
$ yarn docker:up
$ yarn db:start
```

### stop mongodb database

```bash
$ yarn db:stop
```

### purge mongodb database (deletes the entire database)

```bash
$ yarn db:drop
```
### start local server

`yarn start:dev`

### start local server in development mode
`yarn start:dev:watch`
