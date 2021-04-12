## Running Locally 

Server requires docker installed

- From the root of the directory run `npm run build_run_posix` to run the server on a POSIX system

- On windows run `npm run build_run_windows`

# Tests
To run the tests for the remote server, ensure the environment variable `REMOTE_TEST` is present (the value does not matter).
To run the tests locally, make sure `REMOTE_TEST` is *not* set.

As of now, tests are run one by one. In the future a more automated system will be put in place.

### Run the tests
1. `cd tests`
1.  `node addActivity.js`
1.  `node fetchActivities.js`





# Rest API

## `GET` `/activities`

Usage

`GET` `/activities?start_time=0&end_time=10000000000&user_id=1`

Where `start_time` and `end_time` are in UTC [unix epoch time](https://en.wikipedia.org/wiki/Unix_time) (in milliseconds)
and `user_id` is the user_id to request activities for



Returns data like so

```
{
    activities: [
      {
        title: 'One',
        description: null,
        feeling: 'Good',
        time: 1,
        tags: ['health','education','leisure'],
        user_id: 1,
        id: 1
      },
      {
        title: 'Two',
        description: null,
        feeling: 'Great',
        time: 2,
        tags: [],
        user_id: 1,
        id: 2
      },
      {
        title: 'Three',
        description: null,
        feeling: 'Bad',
        time: 3,
        tags: [],
        user_id: 1,
        id: 3
      }
    ]
  }
```


## `POST` `/activity`

Usage

`POST` `/activity`

Sample of body data (content type should be `application/json`):

```
{
    user_id: 1,
    title: "Testing the API",
    description: "A description",
    feeling: "great",
    tags: ['health','education','leisure']
}
```

The response will be the activity with `id` and `time` properties appended
(activity time is determined by the server)

```
{
    user_id: 1,
    title: "Testing the API",
    description: "A description",
    feeling: "great",
    tags: ['health','education','leisure']
    time: 1616868552958,
    id: 13
   }
```