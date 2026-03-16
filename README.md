# GraphQL_API
Detta är ett api som ger möjligheten att se spel från metacritic

AI-Statement
1. Fick hjälp med sql scheman
2. Fick hjälp med etl som jag gjorde om till elt


### produktion service:
https://reliable-hope-production-e0b4.up.railway.app/graphql

### testning service:
https://graphqlapi-development.up.railway.app/graphql

### Deployed playground on:
För att testa runt i prododuktions servicen så använder du den url i vänsta hörnet och för att testa på ett lite mindre dataset kan du testa runt med testning service url.

https://studio.apollographql.com/sandbox/explorer

### Nedladdning

#### metod 1

1. git clone "github url för detta projekt"
2. Kör kommandot npm install
3. sätt upp dina egna .env men följ .env.example för att det ska funka så bra som möjligt

#### metod 2

1. ladda ner som zip
2. packa upp zip med verktyg som 7zip eller liknande
3. Kör kommandot npm install
4. sätt upp dina egna .env men följ .env.example för att det ska funka så bra som möjligt

### Seed guide

1. Följ först stegen för nedladdning
2. kör kommandot npm run etl
3. VIKTIGT för att det ska funka krävs det att du har gjort tables i en postgres databas. Det går att göra väldigt smidigt genom att följa dessa kommando /src/schema/db/Create.sql. I denna fil finns exakt de kommando jag skrev för att göra alla mina tables.

### Testning

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
