# <p align="center">Potluck Planner api - December, 2021</p>

## <p align="center">https://potluckplan.herokuapp.com/</p>

## <p align="center">REGISTER / LOGIN</p>

### <p align="center">User examples:</p>

```json
[
  {
    "username": "userone",
    "password": "yeet"
  },
  {
    "username": "usertwo",
    "password": "yeet"
  }
]
```

### [POST] /api/auth/register

- Register a new user
  - username required (must be a string | unique)
  - password required (must be a string)

_What you send:_

```json
{
  "username": "iamauser",
  "password": "randompassword"
}
```

_What you receive:_

```json
{
  "message": "You have successfully created a new account with username 'iamauser'"
}
```

### [POST] /api/auth/login

- Login
  - username and password required
  - returns user object with with welcome message and token

_What you send:_

```json
{
  "username": "iamauser",
  "password": "randompassword"
}
```

_What you receive:_

```json
{
  "message": "Welcome back iamauser",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlhbWF1c2VyIiwiaWF0IjoxNjM2ODYyMDY5LCJleHAiOjE2MzY5NDg0Njl9.fhVnkCzPDA5kubS1fo3mj57AEZcon267qH7dQ5Rk7rU",
  "user_id": 3
}
```


## <p align="center">POTLUCK INFO</p>


### [GET] /api/potlucks

- Get all potlucks
  - Returns an array of all potlucks with their properties. Organizer/username are the same person, returns username property for convenience

_What you receive:_

```json
[
  {
      "potluck_id": 2,
      "potluck_name": "a day out",
      "potluck_description": null,
      "date": "Jan 1",
      "time": "10 pm",
      "location": "the park",
      "organizer": 1,
      "username": "userone"
  },
  {
      "potluck_id": 1,
      "potluck_name": "Grandma's 50th!",
      "potluck_description": "A lovely day in the park",
      "date": "June 1, 2022",
      "time": "1:00PM",
      "location": "Laurelhurst Park",
      "organizer": 1,
      "username": "userone"
  }
]
```


### [POST] /api/potlucks

- Create a new potluck
  - requires the fields potluck_name, date, time, and location all as strings
  - can optionally provide a string for potluck_description field, but not required (see return object below)
  - returns the new potluck object

_What you send:_

```json
{
  "potluck_name": "a day out",
  "date": "Jan 1",
  "time": "10 pm",
  "location": "the park"
}
```

_What you receive:_

```json
{
  "potluck_id": 2,
  "potluck_name": "a day out",
  "potluck_description": null,
  "date": "Jan 1",
  "time": "10 pm",
  "location": "the park",
  "organizer": 1
}
```


### [GET] /api/potlucks/:potluck_id

- Get a potluck by id

_What you receive:_

```json
{
  "potluck_id": 1,
  "potluck_name": "Grandma's 50th!",
  "potluck_description": "A lovely day in the park",
  "date": "June 1, 2022",
  "time": "1:00PM",
  "location": "Laurelhurst Park",
  "organizer": 1,
  "username": "userone"
}
```

### [PUT] /api/potlucks/:potluck_id

- Edit a potluck by id
  - updates the potluck indicated by the id in the request
  - requires at least one of the following properties in the request: time, date, location
  - returns the updated potluck object

_What you send:_

```json
{
  "location": "Peter's house",
  "time": "11:30 pm"
}
```

_What you receive:_

```json
{
    "potluck_id": 1,
    "potluck_name": "Grandma's 50th!",
    "potluck_description": "A lovely day in the park",
    "date": "June 1, 2022",
    "time": "11:30 pm",
    "location": "Peter's house",
    "organizer": 1,
    "username": "userone"
}
```

### [DELETE] /api/potlucks/:potluck_id

- Deletes the potluck indicated in the request params

What do you want to receive??

_What you receive:_

```json 
{
  "message": "potluck successfully deleted"
}
```

### [POST] /api/potlucks/:potluck_id/items

- Adds item to a potluck
  - add an item to the potluck identified in the :potluck_id param in request
  - requires the field item_name as a string
  - returns the item added, plus the confirmed and user_bringing properties

_What you send:_

```json
{
  "item_name": "salad"
}
```

_What you receive:_

```json
{
  "item_id": 14,
  "item_name": "salad",
  "confirmed": false,
  "user_bringing": null
}
```


### [GET] /api/potlucks/:potluck_id/guests

- Get guest list for a potluck
  - responds with an array of all users invited to the potluck indicated in :potluck_id param in request
  - guests that have confirmed will have confirmed property true

_What you receive:_

```json
[
    {
        "username": "userone",
        "confirmed": false
    },
    {
        "username": "usertwo",
        "confirmed": true
    }
]
```

### [POST] /api/potlucks/:potluck_id/guests

- Adds a guest by username to a potluck guest list
  - adds guest to potluck indicated in potluck_id in request params
  - requires a username property
  - returns the new guest list for the potluck

_What you send:_

```json
{
  "username": "Cheyenne"
}
```

_What you receive:_

```json
[
  {
        "username": "userone",
        "confirmed": false
    },
    {
        "username": "usertwo",
        "confirmed": true
    },
    {
        "username": "Cheyenne",
        "confirmed": false
    }
]
```

### [GET] /api/potlucks/:potluck_id/items

- Get food list for a potluck
  - returns an array of all items attributed to a certain potluck
  - potluck is determined by the number in the :potluck_id param in request

_What you receive:_

```json
[
  {
      "item_id": 1,
      "item_name": "potato salad",
      "confirmed": false,
      "user_bringing": null
  },
  {
      "item_id": 2,
      "item_name": "cherry pie",
      "confirmed": false,
      "user_bringing": null
  }
]
```

### [PUT] /api/potlucks/:potluck_id/guests

- Allows a user to set their status to confirmed for a potluck guest list
  - requires a user_id in the request headers - perhaps set all your axiosWithAuth to include on successful login?
  - confirms for the potluck indicated in by :potluck_id param in request params
  - returns simple success message.

_What you receive:_

```json
{
  "message": "You have successfully RSVPd!"
}
```
