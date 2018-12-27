# Graphql and marvel

This is a simple example of usage Graphql with [marvel API](https://developer.marvel.com/)

## Installation

Unzip the node_modules.tar.gz into the root folder

```bash
gunzip node_modules.tar.gz
tar -xvf node_modules.tar
```

## Run the server

```bash
npm start
```

## Run queries (for debugging)

Got to [graphgl-interface](http://localhost:4011/graphql)

### Request all characters
```python
mutation {
  updateCharacter(id: 1017100, input: {
    favorite: true
  }) {
    id
    favorite
    name
  }
}
```

### Request character by ID

```python
{
  character(id: 1017100) {
    id
    name
    thumbnail
    favorite
  }
}
```

### Mutation
```python
mutation {
  updateCharacter(id: 1017100, input: {
    favorite: true
  }) {
    id
    favorite
    name
  }
}
```

## Open the page with "Marvel Heros"
```python
http://localhost:4011/
```
