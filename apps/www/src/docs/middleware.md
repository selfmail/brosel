---
title: "Middlewares"
description: "Middlewares are easy to integrate – for example with a custom middleware folder!"
author: "Henri"
---

# Middlewares

Middlewares are running before a route. You can perform auth logic for example, when there's no user, the route won't even be running. Brösel has an easy middleware integration. You can define middlewares in your `src/middleware` folder or specify a custom folder in the `config.ts` file with the `middleWareDir: string` option.

## Define a new middleware

There are two types of middlewares: Root Middlewares (Global Middlewares) or Path Middlewares. Global Middlewares are running before **every** request, path middlewares only on specific pathes. You can use a glob pattern to define the pathes for Path Middleware.

### Create a Path Middleware

```ts
import {middleware} from "brosel/middleware"

export default middleware(async (req, res) => {
    // perform your auth logic
    const user = await getUser(req)

    if (!user) return res.deny()

    return res.next()
})
```