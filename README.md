# generator-jhipster-swagger-api-first
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module, JHipster module to support API first development using swagger

# Introduction

This module uses the [swagger-codegen-maven-plugin](https://github.com/swagger-api/swagger-codegen/tree/master/modules/swagger-codegen-maven-plugin) to bring API-first development to your JHipster application.
In API first development, instead of generating the doc from the code, you first write the spec and generate the code from it. This has the following advantages:
* you design your API for the consumers and not as a consequence of your implementation.
* you can use it to mock your new server endpoints before they are released so you decouple more between frontend and backend dev
* you don't need a live server to use your swagger spec

Note : the module currently only works with Maven.


# Prerequisites

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have JHipster and its related tools already installed:

- [Installing JHipster](https://jhipster.github.io/installation.html)

# Installation

To install this module:

```bash
yarn global add generator-jhipster-swagger-api-first
```

# Usage

At the root of your project
```bash
yo jhipster-swagger-api-first
```
This will configure the swagger-codegen-maven-plugin in your pom.xml so that, when you compile, the spec located at `src/main/resources/swagger/api.yml` is used to generate endpoint interfaces that you can implement.
Those interfaces have default methods which answer with a 200 HTTP status and an empty body.

Write your spec using a tool such as [swagger-editor](http://editor.swagger.io), put it in `src/main/resources/swagger/api.yml`, then :
```bash
./mvnw generate-sources
```
Then implement the interfaces generated in `target/generated-sources/swagger/src/main/java/${package}/web/api/controller` with `@RestController` classes.

Example of code to write yourself for the famous [petstore](http://petstore.swagger.io) spec:
```java
@RestController
@RequestMapping("/api/petstore")
public class PetStore implements PetApi, StoreApi, UserApi {

    @Override
    public ResponseEntity<List<Pet>> findPetsByStatus(@RequestParam List<String> status) {
        return new ResponseEntity<>(
            status.stream()
                .distinct()
                .map(Pet.StatusEnum::fromValue)
                .map(statusEnum -> new Pet().id(RandomUtils.nextLong()).status(statusEnum))
                .collect(Collectors.toList()),
            HttpStatus.OK);
    }
}
```

# License

Apache-2.0 © [Christophe Bornet](https://github.com/cbornet)


[npm-image]: https://img.shields.io/npm/v/generator-jhipster-swagger-api-first.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-swagger-api-first
[travis-image]: https://travis-ci.org/cbornet/generator-jhipster-swagger-api-first.svg?branch=master
[travis-url]: https://travis-ci.org/cbornet/generator-jhipster-swagger-api-first
[daviddm-image]: https://david-dm.org/cbornet/generator-jhipster-swagger-api-first.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/cbornet/generator-jhipster-swagger-api-first
