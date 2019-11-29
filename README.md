## ActivityPub Moleculer Test

1. Run `yarn start` or `yarn run dev` 

2. With Postman or Insomnia, POST to `https://localhost:3000` some JSON like this:

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