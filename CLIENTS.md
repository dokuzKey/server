## API Guide for Client Developers

Creating and maintaining clients for the 9Key servers require a deep understanding of how the APIs, servers and HTTP works.

# Authentication

## Registering an account

**Endpoint:** `/api/auth/register`

**Requirements:** The request should be made with the following JSON body.
```json
{
"email": "password@example.com",
"username": "example",
"password": "niceExamplePassword29!"
}
```

**Response:** *
```json
{
"status": 1,
"token": "Generated_User_Token"
}
```

`status` **variable:** If `1`, operation succeded. If `0`, operation failed.

`token` **variable:** Returns the generated token for the account.

\* *This function might return an error. Please see the designated **[errors](#errors)** section.*

## Logging in

**Endpoint:** `/api/auth/login`

**Requirements:** The request should be made with the following JSON body.
```json
{
"username": "example",
"password": "niceExamplePassword29!"
}
```

**Response:** *
```json
{
"status": 1,
"message": "Login successful",
"token": "User_Token"
}
```

`status` **variable:** If `1`, operation succeded. If `0`, operation failed.

`message` **variable:** Explains the current status, with words.

`token` **variable:** Contains the user token to be stored and used in new client

\* *This function might return an error. Please see the designated **[errors](#errors)** section.*
_____

# Syncing 

## Fetching current items

**Endpoint:** `/api/list/:item`

**Avaible :item**: `passwords` or `notes`

**Requirements:** The request should be made with the following JSON body.
```json
{
  "token": "User_Token"
}
```

**Response:** **
```json
{
"status": 1,
"data": [
  "67018bad1ab18ba81fba321e",
  "67018e9c1ab18ba81fba3229"
 ]
}
```

`status` **variable:** If `1`, operation succeded. If `0`, operation failed.

`data` **array:** Returns the IDs of the up-to-date passwords/notes.

** *Response is the same with password/note, it only includes the respective IDs.*
_____

# Passwords

## Create a password

**Endpoint:** `/api/create/passwords`

**Requirements:** The request should be made with the following JSON body.

```json
{
"token": "User_Token",
"siteAddress": "https://musti.codes",
"username": "musti",
"password": "ILove9Key!69"
}
```
**Response:** *
```json
{
"status": 1,
"message": "Password created successfully"
}
```

`status` **variable:** If `1`, operation succeded. If `0`, operation failed.

`message` **variable:** Explains the current status, with words.

\* *This function might return an error. Please see the designated **[errors](#errors)** section.*

## Fetch passwords

**Endpoint:** `/api/fetch/passwords`

**Requirements:** The request should be made with the following JSON body.

```json
{
"token": "User_Token"
}
```
**Response:** *
```json
{
"status": 1,
"data": {
 "67018bad1ab18ba81fba321e": {
  "id": "67018bad1ab18ba81fba321e",
  "siteAddress": "https://musti.codes",
  "username": "musti",
  "password": "ILove9Key!69",
  "createdAt": "2024-10-05T18:55:14.869Z"
    }
  }
}
```

`status` **variable:** If `1`, operation succeded. If `0`, operation failed.

`data` **array:** Includes the data sent by the server. 

\* *This function might return an error. Please see the designated **[errors](#errors)** section.*
_____

# Notes
## Create a note

**Endpoint:** `/api/create/notes`

**Requirements:** The request should be made with the following JSON body.

```json
{
"token": "User_Token",
"title": "After hacking NASA...",
"body": "Wait for them to send a hand-written note to you."
}
```
**Response:** *
```json
{
"status": 1,
"message": "Note created successfully"
}
```

`status` **variable:** If `1`, operation succeded. If `0`, operation failed.

`message` **variable:** Explains the current status, with words.

\* *This function might return an error. Please see the designated **[errors](#errors)** section.*

## Fetch notes

**Endpoint:** `/api/fetch/notes`

**Requirements:** The request should be made with the following JSON body.

```json
{
"token": "User_Token"
}
```
**Response:** *
```json
{
"status": 1,
"data": {
 "67018bad1ab18ba81fba291e": {
  "id": "67018bad1ab18ba81fba291e",
  "title": "After hacking NASA...",
  "body": "Wait for them to send a hand-written note to you.",
  "createdAt": "2024-10-05T18:55:14.870Z"
    }
  }
}
```

`status` **variable:** If `1`, operation succeded. If `0`, operation failed.

`data` **array:** Includes the data sent by the server.

\* *This function might return an error. Please see the designated **[errors](#errors)** section.*

# Errors

*Soon.*