# GraphQL_API
Detta är ett api som ger möjligheten att se spel från metacritic

AI-Statement
1. Fick hjälp med sql scheman
2. Fick hjälp med etl som jag gjorde om till elt


### production service:
https://reliable-hope-production-e0b4.up.railway.app/graphql

### testing service:
https://graphqlapi-development.up.railway.app/graphql

### Deployed playground on:
You can explore both the testing service and the production service. Just add the correct url.

https://studio.apollographql.com/sandbox/explorer

### Testing

Testerna täcker: 

* användarens registrering och inloggning
* CRUD operationer för spel
* hämtandet av score, platforms och gamePlatforms (vilket är spel specifik platforms information)
* kapslade/nested operationer som tillexempel score till ett specifikt spel
* pagination, filtrerings testning

#### test filer
postman/collection.json
postman/production.environment.json
postman/development.environment.json

#### kör testerna lokalt

##### metod 1

1. importera collection och production.environment till postman
2. glöm inte välja rätt environment i postman
3. sen kan testerna köras genom manuellt genom epecfika tester eller genom att köra hela kollektionen

##### metod 2

1. ladda ner collection och production.environment
2. kör testerna i en konsol genom kommandot: npx newman run postman/collection.json -e postman/production.environment.json
