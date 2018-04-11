This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

<h1>Rose Rocket Coding Challenge</h1>
<h3>Packtor Trailers</h3>

A collaboration packing tool allowing users to anonymously access the web app and place items into boxes, ready for shipping. 

<h2>Description</h2>
The packing tool allows multiple users to package items into boxes. Items are cannot be added if they are not ready for shipment or if the box has already reached its weight limit. New items and boxes can be created. Using Firebase's database, the changes update in real time therefore preventing multiple users from moving the same item into different boxes. 

<h2>Getting Started</h2>

Packages included (Firebase, Sockets-io, Express, React DnD and immutability helper) have been saved. Upon forking the project, use "npm install" to install these dependencies.

To run the app, "npm start" from "rose-rocket-challenge" (front-end) and "node server.js" from "Rose-Rose-Project" (back-end).

Once a user opens the web app, Firebase authentication, checks to see if the user already exists, creating an anonymous user id and name (which is displayed at the top of the page). 

All boxes and items are saved on Firebase's database and will immediately load. Items that are ready for packaging can be dragged into boxes. Each box displays their maximum weight limit as well as how much remaining weight can be added. If a box has reached it's limit, an item may no longer be added, alerting the user. 

Once an item has been added, it will appear in the box, also allowing the user to see which items are already contained within that box.

By clicking on an item, the user can remove it from a box, automatically returning to the the list of items.

Upon creating an item, the user can decide whether or not the item is ready for packaging. If it is not ready, it cannot be placed in a box. The status of the item can be changed by clicking on it, making it active and ready to package.

Using sockets.io, the user can see what users are currently logged onto the page as well.
