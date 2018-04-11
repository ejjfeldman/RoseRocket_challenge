import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';


class Users extends Component{
    render(){
    //checking for sockets
    const socket = socketIOClient("http://localhost:8080");
    let clients= []
    //collecting users logged in    
        socket.on('newclientconnect', (data)=>{
            if(data.description){
              clients.push(data.users)
              document.getElementById('clientId').innerHTML=clients;
              document.getElementById('clientNumbers').innerHTML=clients.length;
              
            }
          })
        return(
            <div className="userDisplay">
                <h4>Users Currently Online</h4>
                <p><span id="clientNumbers"></span> users currently logged in</p>
                <p>User(s): <span id="clientId"></span></p>
            </div>
        )
    }
}

export default Users;