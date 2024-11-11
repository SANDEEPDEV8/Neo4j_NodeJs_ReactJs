# Neo4j_NodeJs_ReactJs

https://neo4j.com/docs/graphql/current/getting-started/toolbox/

```
MATCH(n) DETACH DELETE n
```

Example: parker acted in spider man

```
mutation Mutation($input: [MovieCreateInput!]!) {
  createMovies(input: $input) {
    movies {
      title
    }
  }
}

{
  "input": [
    {
      "title": "Spider Man",
      "actorsIn": {
        "create": [
          {
            "node": {
              "name": "Parker"
            }
          }
        ]
      }
    }
  ]
}
```

query

```
query Query {
  actors {
    name
    moviesIn {
      title
    }
  }
}
```

EX: add spideman 2

```
mutation Mutation($input: [MovieCreateInput!]!) {
  createMovies(input: $input) {
    movies {
      title
    }
  }
}

{
  "input": [
    {
      "title": "Spider Man 2",
      "actorsIn": {
        "connect": [
          {
            "where": {
              "node": {
                "name": "Parker"
              }
            }
          }
        ]
      }
    }
  ]
}
```

query: in spider man movies, list actors and their count of movies

```
query Query($where: MovieWhere) {
  movies(where: $where) {
    title
    actorsIn {
      name
      moviesInAggregate {
        count
      }
    }
  }
}
{
  "where": {
    "title": "Spider Man"
  }
}
```
