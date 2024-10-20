# How to make requests with curl

## Get request

### Read resource

If the resource is all the books, the request will be:

```bash
curl --location 'http://127.0.0.1:25565/books'
```

If the resource is a book, the request will be:

```bash
curl --location 'http://127.0.0.1:25565/book/1'
```

In this case `1` is the id of the book.

### Add a resource

```bash
curl --location 'http://127.0.0.1:25565/books' \
--header 'Content-Type: application/json' \
--data '{   
    "title": "Book-example43",
    "gender": "gender-example",
    "image": "jaasdasdj",
    "description": "buenardoooooooooooo",
    "authors":[1]
}'
```

### Delete a resource

```bash
curl --location --request DELETE 'http://127.0.0.1:25565/book/1'
```

### Update a resource

```bash
curl --location --request PUT 'http://127.0.0.1:25565/book/1' \
--header 'Content-Type: application/json' \
--data '{   
    "title": "Book-example43",
    "gender": "gender-example",
    "image": "jaasdasdj",
    "description": "buenardoooooooooooo",
    "authors":[1]
}'
```