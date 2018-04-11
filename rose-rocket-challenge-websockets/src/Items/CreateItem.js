import React, {Component} from 'react';

class CreateItem extends Component{
    render(){
        return(
<div>
    <form onSubmit={this.props.handleSubmit}>
    <h2>Add New Item</h2>
        <input className="formInput" required type="text" name="itemName" placeholder="Name of Item" onChange={this.props.handleChange}/>
        <input className="formInput" required type="number" name="itemWeight" placeholder="Weight (lbs)" onChange={this.props.handleChange}/>
        <select className="formSelect" name="itemType" onChange={this.props.handleChange}>
            <option disabled selected value="">Select Item's State</option>
            <option value="item">Ready for packing</option>
            <option value="notReady">Not ready for packaging</option>
        </select>
        <input className="formBtn" type="submit" value="SUBMIT"/>
        <button className="formBtn" onClick={()=>this.props.closeForm()}>CLOSE</button>
    </form>
</div>
       
        )

    }

}

export default CreateItem;