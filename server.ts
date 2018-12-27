import express from 'express';
import graphqlHTTP from 'express-graphql';
import fetch from 'fetch-with-proxy';
import bodyParser from 'body-parser';
import { buildSchema } from 'graphql';
import md5 from 'md5';

import { post, get } from './favorites';
import { appMiddleware } from './app';

const app = express();
const API = 'https://gateway.marvel.com:443/v1/public/';
const key = '942af392660d8e9becb212667f5e78a3'; // https://developer.marvel.com/
const pkey = '5c5b0b36bf89e1e0c579f198d3efb652e496bec0';

const favorites = {};

const getHash = () => {
  const ts = new Date().getMilliseconds();
  return `&ts=${ts}&hash=${md5(ts + pkey + key)}`;
};

const fetchResource = (res, queryParams = '') => {
  const url = `${API}${res}?apikey=${key}${getHash()}${queryParams}`;
  return fetch(url);
};

// ToDo Create schema
const schema = buildSchema(`
  type Query {
    characters: [Character]
    character(id: Int): Character
  }

  type Mutation {
    updateCharacter(id: Int, input: FavoriteInput): Character
  }

  type Character {
    id: Int
    name: String
    thumbnail: String
    favorite: Boolean
  }

  input FavoriteInput {
    favorite: Boolean
  }
`);

// ToDo create implementation
const rootValue = {
  characters: async function () {
    const response = await fetchResource('characters');
    const json = await response.json();
    const results = json.data.results;
    return results.map((character) => {
      character.thumbnail = character.thumbnail.path + '.' + character.thumbnail.extension;
      character.favorite = favorites[character.id] || false;
      return character;
    });
  },
  character: async function({id}) {
    const response = await fetchResource('characters/' + id);
    const json = await response.json();
    const result = json.data.results[0];
    result.thumbnail = result.thumbnail.path + '.' + result.thumbnail.extension;
    result.favorite = favorites[id] || false;
    return result;
  },
  updateCharacter: async function({id, input}) {
    favorites[id] = input.favorite;
    const response = await fetchResource('characters/' + id);
    const json = await response.json();
    const result = json.data.results[0];
    result.thumbnail = result.thumbnail.path + '.' + result.thumbnail.extension;
    result.favorite = favorites[id] || false;
    return result;
  }
};

// separator per request for logging
app.use((req, res, next) => {
  console.log('---');
  next();
});
app.use(bodyParser.json());


// /favorites endpoints
app.post('/favourites', post);
app.get('/favourites', get);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  }),
);

// build and host ./app
app.use(appMiddleware);

app.listen(4011, () => {
  console.log('server started at port: 4011');
});
