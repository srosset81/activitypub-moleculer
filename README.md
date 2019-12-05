## ActivityPub Moleculer Test

1. Launch Jena and create a 'activities' dataset

2. Update the `SPARQL_ENDPOINT` variables in the `.env` file if necessary.

3. Run `yarn start` or `yarn run dev` 

4. With Postman or Insomnia, POST to `https://localhost:3000/outbox` some JSON like this:

```
{
 "@context": "https://www.w3.org/ns/activitystreams",
 "type": "Note",
 "name": "Hello World",
 "content": "Voilà mon premier message, très content de faire partie du fedivers !",
 "published": "2019-05-28T12:12:12Z"
}
```

You should get a response with a `Create` activity.

5. Get the list of created activities by doing a GET to `https://localhost:3000/outbox`
