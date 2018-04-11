import React, {Component} from 'react';
// import Item from './Item';

class ItemsList extends Component{
    render(){
        let totalWeight = 0
        let isEmpty=null
        
        if(this.props.children){
            this.props.children.map(item=>{
                totalWeight+=Number(item.props.weight)

                if(item.props.isDropped){
                    totalWeight-=item.props.weight
                }
            })
        }        
        if(totalWeight==0){
         
            isEmpty=<h4>All available items have been packaged</h4>
        }
        return(
            <div>
                <h2 className="subTitles">Items Ready For Packaging</h2>
                <button className="addBtn" onClick={()=>this.props.createNewItem()}>+ New</button>
                <p>*click inactive item when it is ready for packaging</p>
                {isEmpty}
                <h3>{totalWeight} lbs to distribute</h3>
                <hr/>
               {this.props.children}
                
            </div>
        )
    }
}

export default ItemsList;