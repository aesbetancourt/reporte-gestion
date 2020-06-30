/* eslint eqeqeq: 0 */
/* eslint-disable import/first */
import React, {Component} from "react";
const axios = require('axios').default;
const trelloToken = ""//Token de trello
const trelloKey = ""//Key de trello
const ClockifyToken ="" //Token de Clockify
class Integration extends Component {
  constructor(props) {
    super(props);
    this.state = {
        workspaceId: '5c79aee1b079877a63415e08',
            //Trello requests
            boardName: '',
            boardID: '',

            // Clockify requests
            // Project Requests
            projectName: '',
            projectID: '',

            // Task Requests
            taskName: '',
            taskID: '',
            proID: '',
        };
        this.getProjectID = this.getProjectID.bind(this);
        this.getTaskID = this.getTaskID.bind(this);
        this.getBoardID = this.getBoardID.bind(this);
        this.handleproID = this.handleproID.bind(this);
        this.handletaskName = this.handletaskName.bind(this);
        this.handleprojectName = this.handleprojectName.bind(this);
        this.handleboardName = this.handleboardName.bind(this);
    };
    getProjectID(name) {
        axios.defaults.baseURL = 'https://api.clockify.me/api/v1'
        axios.defaults.headers.common['X-Api-Key'] = ClockifyToken
        axios.defaults.headers.common['content-type'] = 'application/json'
        /*recibe parametro name(nombre del proyecto) y client(nombre del cliente), busca en la lista de proyectos,
        devuelve el resultado filtrado y se retorna el ID en la funcion
        (si los parametros coinciden en su totalidad es la posicion 0 en la lista)*/
        return new Promise(async (resolve,reject) => {
            try {
                const result = await axios.get(`/workspaces/${this.state.workspaceId}/projects?name=${name}`);
                this.setState({projectID: result.data[0].id})
            } catch (error) {
                reject(error)
            }
        });
    }
    getTaskID(name, projectId) {
        axios.defaults.baseURL = 'https://api.clockify.me/api/v1'
        axios.defaults.headers.common['X-Api-Key'] = ClockifyToken
        axios.defaults.headers.common['content-type'] = 'application/json'
        /*recibe parametro name(nombre de la tarea) y projectId(ID del proyecto), busca en la lista de tareas dentro del proyecto,
        devuelve el resultado filtrado y se retorna el ID en la funcion
        (si los parametros coinciden en su totalidad es la posicion 0 en la lista)*/
        return new Promise(async (resolve,reject) => {
            try {
                const result = await axios.get(`/workspaces/${this.state.workspaceId}/projects/${projectId}/tasks?name=${name}`);
                this.setState({taskID: result.data[0].id})
            } catch (error) {
                reject(error)
            }
        });
    }
    getBoardID(name){
        let names = []; let ids= []; let index = 0;
        axios.defaults.baseURL = 'https://api.trello.com/1'
        const add = '?key='+trelloKey+'&token='+trelloToken
        return new Promise(async (resolve,reject) => {
            try {
                let result = await axios.get(`/members/me/boards${add}`);
                result = result.data;
                console.log(result)
                for (let i = 0; i < result.length; i++) {
                    names.push(result[i].name);
                    ids.push(result[i].id);
                }
                console.log("Names", names)
                console.log("IDS", ids)

                index = names.indexOf(name)
                console.log(index)

                if (index === -1) {
                    this.setState({boardID: 'No encontrado'})
                    this.boardID = 'No encontrado'
                } else {
                    this.setState({boardID: ids[index]})
                    this.boardID = ids[index]
                }


            } catch (error) {
                reject(error)
            }
        });
    }
    handleboardName(event){
        this.setState({boardName:event.target.value})
    }
    handleprojectName(event){
        this.setState({projectName:event.target.value})
    }
    handletaskName(event){
        this.setState({taskName:event.target.value})
    }
    handleproID(event){
        this.setState({proID:event.target.value})
    }
    render() {
        return (
          <div className="App"> 
          <div className="container pt-5 pb-5 pl-5 pr-5" id="info">
        <div className="row pb-3">
            <div className="col"><input value={this.state.boardName} type="text" className="form-control" placeholder="Nombre del Tablero" onChange={this.handleboardName}></input></div>
            <div className="col"><button className="btn btn-primary" onClick={()=> this.getBoardID(this.state.boardName)}>Buscar BoardID</button></div>
            <div className="col"><p>ID: {this.state.boardID}</p></div>
        </div>
        <hr></hr>
        <div className="row pb-3">
            <div className="col"><input value={this.state.projectName} type="text" className="form-control" placeholder="Nombre de proyecto" onChange={this.handleprojectName}></input></div>
            <div className="col"><button className="btn btn-primary" onClick={()=> this.getProjectID(this.state.projectName)} >Buscar ProjectID</button></div>
            <div className="col"><p>ID: {this.state.projectID}</p></div>
        </div>
        <hr></hr>
        <div className="row pb-3">
            <div className="col">
                <input value={this.state.taskName} type="text" className="form-control" placeholder="Nombre del Task" onChange={this.handletaskName}></input>
                <input value={this.state.proID} type="text" className="form-control" placeholder="ProjectID" onChange={this.handleproID}></input>
            </div>
            <div className="col"><button className="btn btn-primary" onClick={()=> this.getProjectID(this.getTaskID(this.state.taskName, this.state.proID))}>Buscar TaskID</button></div>
            <div className="col"><p>ID: {this.state.taskID}</p></div>
        </div>
        
        
    </div>
          </div>
        );
      }
    }
  
export default Integration;
