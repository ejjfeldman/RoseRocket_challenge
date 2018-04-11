import React, {Component} from 'react';

class CreateBox extends Component{
    render(){
        return(
<div>
    <form onSubmit={this.props.handleBoxSubmit}>
        <h2>Add New Box</h2>
            <input className="formInput" required type="text" name="boxName" placeholder="Name of Box" onChange={this.props.handleChange}/>
            <input className="formInput" required type="number" name="boxWeight" placeholder="Weight (lbs)" onChange={this.props.handleChange}/>
            <input className="formInput" disabled type="text" name="boxAccepts" placeholder="Type" value="item"/>
            <input className="formBtn" type="submit" value="SUBMIT"/>
            <button className="formBtn" onClick={()=>this.props.closeBoxForm()}>CLOSE</button>
    </form>
</div>
        )
    }
}

export default CreateBox;