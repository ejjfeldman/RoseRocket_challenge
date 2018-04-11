import React, {Component} from "react";
import {DropTarget} from 'react-dnd';
import {ItemTypes} from '../ItemTypes';


//The drag target (where the item can be dropped)
const boxTarget={
    drop(props, monitor){
        props.onDrop(monitor.getItem())        
    }
}

function collect(connect, monitor){
    return{
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    }
}

class Box extends Component{

render(){
    const{name, weight,remainingWeight,isOver,canDrop,connectDropTarget,lastDroppedItem}=this.props
    const isActive = isOver && canDrop
    let backgroundColor = "white"
    if(isActive){
        backgroundColor="lightgrey"
    }else if (canDrop){
        backgroundColor="green"
    }

    let thisBox=this.props.itemsInBox.filter(thisItem=>thisItem.inBox===name)

    return connectDropTarget(

        <div className="oneBox" style={{backgroundColor}}>
            <div><b>{name}</b></div>
            <hr/>
            <div>Remaining Space: <b>{remainingWeight}</b> out of {weight} lbs</div>
                {isActive
                    ? 'Release to drop'
                : ''}

            {lastDroppedItem &&
                (
                    <ul>
                <li className="itemsInBox" >Last Addition: {lastDroppedItem.name} ({(lastDroppedItem.weight)} lbs)</li>
                </ul>
            )}

            {thisBox.map(item=>
                <div className="packagedBox" onClick={()=>this.props.removeBoxedItem(item)}> {item.name}</div>
            )}

        </div>

        )
    }
}


export default DropTarget(ItemTypes.ITEM, boxTarget, collect)(Box);