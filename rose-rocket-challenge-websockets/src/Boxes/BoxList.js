import React, {Component} from 'react';

class BoxList extends Component{
    render(){
        return(
            <div>
                <h2 className="subTitles">Here is the BoxList</h2>
                <button className="addBtn" onClick={()=>this.props.createNewBox()}>+ New</button>
                
                <p>*click item to remove from box</p>
                <hr/>

                {this.props.children}
            
            </div>
        )
    }
}

export default BoxList;