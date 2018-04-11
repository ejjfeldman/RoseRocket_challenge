import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyB2OU_Tm8Cbl-R42ROtJOMpj6rcBNWBEoY",
    authDomain: "rose-rocket-d3afb.firebaseapp.com",
    databaseURL: "https://rose-rocket-d3afb.firebaseio.com",
    projectId: "rose-rocket-d3afb",
    storageBucket: "",
    messagingSenderId: "766017187108"
  };

firebase.initializeApp(config);

const db=firebase.database();
const auth=firebase.auth();

export{
    db,
    auth
};

export default firebase;