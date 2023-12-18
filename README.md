<p align="center">
  <h1 align="center">Next-api-route-middleware</h1>
  <p align="center">
    Middleware for Next.js api routes
  </p>
</p>
<p align="center">
<a href="https://twitter.com/kolbysisk" rel="nofollow"><img src="https://img.shields.io/badge/created%20by-@kolbysisk-e57060.svg" alt="Created by Kolby Sisk"></a>
<a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/kolbysisk/next-api-route-middleware" alt="License"></a>
</p>

> ⚠️ This package is for projects using Next.js Pages Router. For projects using App Router see [next-route-handler-pipe](https://github.com/KolbySisk/next-route-handler-pipe).
> 
## Introduction

Middleware functions allows us to abstract reusable code that runs before the api handler is invoked. They have access to the `req`, `res`, and the `next` middleware function.

##### Example uses:

- Add data to the `req` object <sub><sup>_(without TypeScript complaining!)_</sub></sup>
- Reject wrong request methods
- Capture errors
- Validate body/query data

## Getting started

##### 1. Install'r

`npm i next-api-route-middleware`

##### 2. Create your middleware

Your middleware is a function that accepts `req`, `res`, and `next`. It should call `next()` when done, or send a response.

```ts
export type NextApiRequestWithUser = NextApiRequest & User;

export const withUser: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const authCookie = await getUserByCookie();

  if (authCookie) {
    req.userId = authCookie.userId;
    await next();
  } else {
    res.status(401).send({ message: 'Invalid auth cookie.' });
  }
};
```

##### 3. Export the `use` function. Include an array of middlewares in the order you want them to execute, along with your handler as the last item in the array.

```ts
import { use } from 'next-api-route-middleware';

const handler = async (req: NextApiRequestWithUser, res: NextApiResponse<User>) => {
  res.status(200).json({ userId: req.userId });
};

export default use(captureErrors, allowMethods(['GET']), addhUser, handler);
```

## Examples

#### addUser

You can add data to the `req` object, and it will be available in your handler. In this example we get a userId from an http cookie, if the cookie isn't valid we return a 401.

```ts
export const addUser: Middleware<NextApiRequestWithUser> = async (req, res, next) => {
  const authCookie = await getUserByCookie();

  if (authCookie) {
    req.userId = authCookie.userId;
    await next();
  } else {
    res.status(401).send({ message: 'Invalid auth cookie.' });
  }
};
```

#### allowMethods

You may find that you need to add args to a middleware. To achieve this we make use of a factory pattern. The `allowMethods` function bellow accepts an array of allowed methods, and returns a middleware. We can make use of this factory by calling the function: `allowMethods(['GET', 'POST'])`

```ts
import { Middleware } from 'next-api-route-middleware';

export const allowMethods = (allowedMethods: string[]): Middleware => {
  return async function (req, res, next) {
    if (allowedMethods.includes(req.method!) || req.method == 'OPTIONS') {
      await next();
    } else {
      res.status(405).send({ message: 'Method not allowed.' });
    }
  };
};
```

#### captureErrors

We can also perform actions with inner middleware functions. In this example we wrap the inner middleware functions in a try catch, allowing us to catch any errors that bubble up.

```ts
import { Middleware } from 'next-api-route-middleware';

export const captureErrors: Middleware = async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error!' });
  }
};
```
