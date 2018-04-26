import React, { Component } from 'react';
import update from 'immutability-helper';
import './App.css';
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';

import Item from './Items/Item';
import ItemsList from './Items/ItemsList';
import BoxList from './Boxes/BoxList';
import Box from './Boxes/Box';
import Users from './Users/Users';
import {db, auth} from './firebase';

import CreateItem from './Items/CreateItem';
import CreateBox from './Boxes/CreateBox';


class App extends Component {
  constructor(props){
    super(props)
    this.state={
      endpoint: "http://localhost:8080",
      user:{
        id: '',
        name: ''
      },
      droppedItemNames: [],
      viewForm: false,
      viewBoxForm: false,
      firebaseItems: [],
      firebaseBoxes: [],
      itemName: '',
      itemWeight: 0,
      itemType: "",
      boxName: '',
      boxWeight: 0,
      boxAccepts: 'item',
    }
  }


//signing in an anonymous user with firebase
//need to connect with sockets so that new user's id is recreated**
componentDidMount(){
  let names=[ 'Abbott','Acevedo','Acosta','Adams','Adkins','Aguilar','Aguirre','Albert','Alexander','Alford','Allen','Allison','Alston','Alvarado','Alvarez','Anderson','Andrews','Anthony','Armstrong','Arnold',
'Ashley','Atkins','Atkinson','Austin','Avery','Avila','Ayala','Ayers','Bailey','Baird','Baker','Baldwin','Ball','Ballard','Banks',
'Barber','Barker','Barlow','Barnes','Barnett','Barr','Barrera','Barrett','Barron','Barry','Bartlett','Barton','Bass',
'Bates','Battle','Bauer','Baxter','Beach','Bean','Beard','Beasley','Beck','Becker','Bell','Bender','Benjamin','Bennett','Benson','Bentley',]

//checking if user signed in anonymously
  auth.signInAnonymously().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage)
  });

  //assigning user data to anonymous user
    auth.onAuthStateChanged(authUser=>{ 
      this.setState(()=>({
        user:{
          id: authUser.uid,
          name:names[Math.floor(Math.random()*(names.length))]}}))
    })

  //collecting item data from firebase
  let itemRef = db.ref().child('allItems');
  itemRef.on('value', snap=>{
    let items=snap.val()
    let newState=[];
    for( let item in items){
      newState.push({
        id: item,
        name:items[item].name,
        weight: items[item].weight,
        type: items[item].type,
        inBox: items[item].inBox
      })
    }

    //setting state with collected item data
    this.setState({firebaseItems: newState})
  })

  //collecting box data from firebase
  
  let boxRef=db.ref().child('allBoxes');
  boxRef.on('value', snap=>{
    let boxes=snap.val()
    let boxState=[];
    for(let box in boxes){
      boxState.push({
        id: box,
        name: boxes[box].name,
        accepts: boxes[box].accepts,
        weight: boxes[box].weight,
        remainingWeight: boxes[box].remainingWeight,
        lastDroppedItem: null,
        pastItems: []
      })
    }
    //setting state with collected box data
    this.setState({firebaseBoxes: boxState})
  })
  }

  //removes item from boxlist and places it back in items ready for packaging
  removeBoxedItem=(item)=>{
    let removeFromBox = update(item, {$merge: {inBox: "undefined"}});
    let oneRef = db.ref().child('allItems').child(String(item.id)).update(removeFromBox);
    let indexResult = this.state.firebaseItems.findIndex(x=> x.id===item.id)

    let boxIndex = this.state.firebaseBoxes.findIndex(x=> x.name===item.inBox)
    let boxCopy = this.state.firebaseBoxes[boxIndex];

    let boxWeight = Number(boxCopy.remainingWeight)+Number(item.weight)
    let addItemWeight = update(boxCopy, {$merge: {remainingWeight: boxWeight}})
    this.setState(update(this.state,{
      firebaseItems:{
        [indexResult]:{
          $set: removeFromBox
        }
  
      },
      firebaseBoxes:{
        [boxIndex]:{
          $set: addItemWeight
        }
      }
    })
    )
  //update the box information on firebase
let boxRef=db.ref().child('allBoxes').child(String(boxCopy.id)).update(addItemWeight)
}

  // Drag and Drop Functionality
  isDropped(itemName){
    return this.state.droppedItemNames.indexOf(itemName) > -1
  }

  //make item active/be ready for packaging
  makeActive=(name)=>{
  let itemIndex=this.state.firebaseItems.findIndex(thisItem=>thisItem.name===name)
  let findItem=this.state.firebaseItems[itemIndex]
  let updateItem= update(findItem, {$merge: {type: "item"}})
  this.setState(
    update(this.state,{
      firebaseItems:{
        [itemIndex]:{
          $set: updateItem
        }
      }
    })
  )
  let itemRef=db.ref().child('allItems').child(String(this.state.firebaseItems[itemIndex].id)).update(updateItem)
  }

//Form Functionality
    //Show form for creating new item
  createNewItem=()=>{
    this.setState({viewForm:true})
  }

  //Show form for creating new box
  createNewBox=()=>{
    this.setState({viewBoxForm: true})
  }

  //Close Item Form
  closeForm=()=>{
    this.setState({viewForm:false})
    
  }

  //Close Box Form
  closeBoxForm=()=>{
    this.setState({viewBoxForm:false})
    
  }

  //handle change when inputting data into new item form and checking that the box name isn't already taken
  handleChange=(event)=>{
    let matched=this.state.firebaseBoxes.find(item=>item.name===event.target.value)
    if(matched){
      alert("This name is already taken. Please create a unique one.")
      event.target.value=""
    }else{
      this.setState({
        [event.target.name]:event.target.value
      })
    }
  }

  //new item submit
  handleSubmit=(event)=>{
    event.preventDefault();
    let itemRef = db.ref().child('allItems');
    let newItem={
      name: this.state.itemName,
      weight: this.state.itemWeight,
      type: this.state.itemType,
      inBox: "undefined"
    }
    itemRef.push(newItem);
    this.setState({
      itemName: '',
      weight: 0,
      viewForm: false
    })
  }

  //new box submit
  handleBoxSubmit=(event)=>{
    event.preventDefault();
    let boxRef = db.ref().child('allBoxes');
    let newBox={
      name: this.state.boxName,
      weight: Number(this.state.boxWeight),
      accepts: this.state.boxAccepts,
      remainingWeight: Number(this.state.boxWeight),
    }
    boxRef.push(newBox);
    this.setState({
      boxName: '',
      boxWeight: 0,
      viewBoxForm:false
    })
  }

  render() {

    const {boxes, firebaseItems, firebaseBoxes} = this.state;

    let itemsInBox=firebaseItems.filter(thisItem=>thisItem.inBox!=="undefined")
    let itemsNotBoxed=firebaseItems.filter(thisItem=>thisItem.inBox=="undefined")

    let listView=(
      <span>
        <div className="itemDisplay" >
          
          <ItemsList createNewItem={this.createNewItem}>
            {itemsNotBoxed.map(({name, type, id, weight, inBox}, index)=>(
              <Item
              id={id}
              weight={weight}
              name={name}
              type={type}       
              isDropped={this.isDropped(name)}
              key={index}
              inBox={inBox}
              canDrag={type=="item"}
              makeActive={this.makeActive}
            />

            ))}
          </ItemsList>
        </div>
      
      <div className="boxDisplay">

        <BoxList createNewBox={this.createNewBox}>
          {firebaseBoxes.map(({accepts,droppedItemNames, lastDroppedItem, name, weight, pastItems, remainingWeight}, index)=>
                <Box
                boxes={boxes}
                name={name}
                weight={weight}
                remainingWeight={remainingWeight}
                pastItems={pastItems}
                accepts={accepts}
                lastDroppedItem={lastDroppedItem}
                droppedItemNames={droppedItemNames}
                onDrop={item=>this.handleDrop(index, item)}
                key={index}
                itemsInBox={itemsInBox}
                removeBoxedItem={this.removeBoxedItem}/>
        
          )}
          </BoxList>
      </div>
      </span>
    )

    if(this.state.viewForm){
      listView=(
        <div className="formDisplay">
        <CreateItem 
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            closeForm={this.closeForm}
            newItem={this.state.newItem}/>
          </div>        
      )
    }

    if(this.state.viewBoxForm){
      listView=(
        <div className="formDisplay">
        <CreateBox
            handleChange={this.handleChange}        
            closeBoxForm={this.closeBoxForm}
            handleBoxSubmit={this.handleBoxSubmit}/>
        </div>
      )
    }

    return (
      <div className="App">
        <header className="App-header">
        <div className="topBar"><div className="userInfo">Signed in as user: <b>{this.state.user.id}</b></div></div>
        <h2>Welcome {this.state.user.name}!</h2>
          <h1 className="App-title">PACKTOR TRAILERS</h1>
          <h3>Trucking, Tracking and Packing</h3>
          <p>{this.state.item}</p>
          
        </header>

        {listView}
        <Users/>
      </div>
    );
  }
  
  handleDrop(index, item){
    let {name}=item
    let boxWeight=(this.state.firebaseBoxes[index].remainingWeight)-item.weight
    if(boxWeight<0){
      alert("Unfortunately there is no room for this item.")
      return;
    }

    let droppedItemNames = name ? {$push: [name]} : {}
    let thisBox = this.state.firebaseBoxes[index]
    //adding box information to item
    let itemInBox = update(item, {$merge: {inBox: thisBox.name, type: "item"}})

    //adding information to the box's state
    
    this.setState(
      update(this.state,{
        firebaseBoxes: {
          [index]: {
            remainingWeight: {$set: boxWeight},
            lastDroppedItem: {
              $set: item
            },
            pastItems: droppedItemNames
          }
        },
        droppedItemNames: droppedItemNames,
      })
    )

    let result= this.state.firebaseItems.find(thisItem=>thisItem.id===item.id)
    let indexResult = this.state.firebaseItems.findIndex(x=> x.id===result.id)

    //update the box information on firebase
    let boxRef=db.ref().child('allBoxes').child(String(thisBox.id)).update(this.state.firebaseBoxes[index])

    //update the item information on firebase
      let oneRef = db.ref().child('allItems').child(String(item.id)).update(itemInBox);
      this.setState(update(this.state,{
        firebaseItems:{
          [indexResult]:{
            $set: itemInBox
          }
        }
      })
      )

    }

  }


export default DragDropContext(HTML5Backend)(App);
