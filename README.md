- set up git

# ONE MILLION CHECK BOXES CREATE USING WEBSOCKET

- initialize the project
- install express
- install express types and node js types

- create index.js file
- create server on this file 
- and use express as a handler function
- because i am using websockets

- curl is cli utility is used to make api call from terminal

- we create public folder
    - we can access this folder anyone
    - express handle my server
    - by default express does not give permission ro access any file 
    - we need a middleware which express.static("/path")

- create index.html file 

- create 100 checkbox using js
- write css 


# I WANT TRACK SOMETHING CHANGE ON CHECKBOX

- for that we use websockets
- install for clint side and server side also

- add event into checkbox
- also track a checkbox changes 
- but here is problem 
- suppose we have made clint from start user1 and user 2
- and i change the checkbox
- and now i add one more clint 
- this clint does not know what change happen in past 
- this is thr problem

- my source of truth is on frontend

# solve thr problem new user lost the data
- for that we maintain state in backend 
- we create array and fill the all value is false 
- also add data inside backend is send by frontend
- create api to fetch state from backend
- frontend fetch the sate and update into new clint 
- now when new user come he assigned to old state
- but here also one problem one server has accept limited req 
- so we divide the server 
- but how to share the state between the two server
