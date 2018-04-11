import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';


//The drag source (passing the data decribing the dragged item)
const itemSource = {
    beginDrag(props){
        return{
            name: props.name,
            id: props.id,
            weight: props.weight,
        };
    },
    canDrag(props, monitor){
        return props.canDrag;
    },
    endDrag(props, monitor, component){
        if(!monitor.didDrop()){
            return;
        }
        const item=monitor.getItem();
        const dropResult = monitor.getDropResult();
    }

};

function collect(connect, monitor){
    return{
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class Item extends Component{
    
    render(){
        const {name, type, weight, inBox, isDropped, isDragging, connectDragSource}= this.props;
        const viewItem = !isDropped || (isDropped && inBox=="undefined");

        let color= "black";
        let cursor= "move";
        let clickThis=null
        if(type==="notReady"){
            color="grey"
            cursor="auto"
            clickThis=()=>this.props.makeActive(name)
        }
        return connectDragSource(

            <div className="oneItem" style={{color, cursor}} onClick={clickThis}>

            {viewItem? (
                    <div>
                        <div><b>{name}</b></div>
                        <hr/>
                        <div>{weight} lbs</div>
                        
            </div>):null}
            </div>

        )
    }
}

Item.propTypes={
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    isDropped: PropTypes.bool.isRequired
};

export default DragSource(props=>props.type, itemSource, collect)(Item);

