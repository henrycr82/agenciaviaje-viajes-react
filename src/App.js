import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://127.0.0.1:8000/api/viajes";

class App extends Component {

  state={
    data:[],
    modalInsertar: false,
    form:{
      numero_plazas: '',
      plazas_disponibles: '',
      origen: '',
      destino: '',
      precio: '',
      id: '',
      tipoModal: ''
    }
  }

  peticionGet=()=>{
    axios.get(url).then(response=>{
      this.setState({data: response.data});
      console.log(response.data);
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPost=async()=>{
    await axios.post(url,this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionPut=()=>{
    axios.put(url+'/'+this.state.id, this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete=()=>{
    axios.delete(url+'/'+this.state.id).then(response=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    }).catch(error=>{
      console.log(error);
    })
  }

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  seleccionarViaje=(viaje)=>{
    console.log(viaje);
    this.setState({
      tipoModal: 'actualizar',
      id: viaje.id,
      form: {
        numero_plazas: viaje.numero_plazas,
        plazas_disponibles: viaje.plazas_disponibles,
        origen: viaje.origen,
        destino: viaje.destino,
        precio: viaje.precio,
      }
    })
  }

  handleChange=async e=>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  componentDidMount() {
    this.peticionGet();
  }

  render()
  {
    const {form}=this.state;
    return (
      <div className="App">
        <br/>
        <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}} >Agregar Viaje</button>
        <br/><br/>

        {/* LISTA DE VIAJES */}
        <table className="table">
          <thead>
            <tr>
              <th>Numero de Plazas</th>
              <th>Plazas Disponibles</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(viaje=>{
              return(
                <tr>
                  <td>{viaje.numero_plazas}</td>
                  <td>{viaje.plazas_disponibles}</td>
                  <td>{viaje.origen}</td>
                  <td>{viaje.destino}</td>
                  <td>{new Intl.NumberFormat("en-EN").format(viaje.precio)}</td>
                  <td>
                    <button className="btn btn-primary" onClick={()=>{this.seleccionarViaje(viaje); this.modalInsertar()}} ><FontAwesomeIcon icon={faEdit}/></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={()=>{this.seleccionarViaje(viaje); this.setState({modalEliminar: true})}} ><FontAwesomeIcon icon={faTrashAlt}/></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* FIN LISTA DE VIAJES */}

        {/* MODAL PARA INSERTAR Y ACTUALIZAR VIAJES */}
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{display: 'block'}} onClick={()=>this.modalInsertar()}>
            <span style={{float: 'right'}}>x</span>
            <p>Requerde, todos los campos son requeridos</p>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="numero_plazas">Numero de Plazas</label>
              <input placeholder="Ejemplo: 10" className="form-control" type="text" name="numero_plazas" id="numero_plazas" onChange={this.handleChange} value={form?form.numero_plazas: ''}/>
              <br />
              <label htmlFor="plazas_disponibles">Plazas Disponibles</label>
              <input placeholder="Ejemplo: 10" className="form-control" type="text" name="plazas_disponibles" id="plazas_disponibles" onChange={this.handleChange} value={form?form.plazas_disponibles: ''} />
              <br />
              <label htmlFor="origen">Origen</label>
              <input placeholder="Ejemplo: Caracas" className="form-control" type="text" name="origen" id="origen" onChange={this.handleChange} value={form?form.origen: ''} />
              <br />
              <label htmlFor="destino">Destino</label>
              <input placeholder="Ejemplo: Maracaibo" className="form-control" type="text" name="destino" id="destino" onChange={this.handleChange} value={form?form.destino: ''} />
              <br />
              <label htmlFor="precio">Precio</label>
              <input placeholder="Ejemplo: 500" className="form-control" type="text" name="precio" id="precio" onChange={this.handleChange} value={form?form.precio: ''} />
            </div>
          </ModalBody>

          <ModalFooter>
              {this.state.tipoModal=='insertar'?
                  <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
              }
              <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>
        {/* FIN DE MODAL PARA INSERTAR Y ACTUALIZAR VIAJES */}

        {/* MODAL PARA ELIMINAR VIAJES */}
        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
             Estás seguro que deseas eliminar el viaje : ({form && form.origen}-{form && form.destino})
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
          </ModalFooter>
        </Modal>
        {/* FIN DEL MODAL PARA ELIMINAR VIAJES */}

      </div>
    );
  }
}

export default App;
