import React, { Component } from 'react';
import api from "./service/api";
import "./App.css";


export class App extends Component {
  state = {
    din: 10000,
    empresa: "MSFT",
    value: 0,
    qnt: 0,
    oper: 'compra',
    mode: "DAILY",
    info: null,
    SMA: null,
    carteira: [
      {
        "symbol":"MSFT",
        "value":100,
        "qnt": 5
      },{
        "symbol":"FB",
        "value":200,
        "qnt": 5
      }
    ]
  }
  
  async getTimeSeries() {
    console.log("AQUI")
    const key = "WLJB1PBIOFAOMG55"
    const res = await api.get(`query?function=TIME_SERIES_${this.state.mode}&symbol=${this.state.empresa}&apikey=${key}`)
    console.log(res.data)
    this.setState({...this.state, info: res.data})
  }

  fazedouro(props) {
    console.log("FOOI");
    const empName = props[0]['symbol']
    console.log(empName)
  }

  executa() {
    var {din} = this.state
    const emp = this.state.empresa.toUpperCase()
    const v = this.state.value
    const q = this.state.qnt
    const md = this.state.oper
    const {carteira} = this.state
    var ind = false
    console.log(v)
    console.log(q)
    console.log(md)
    console.log(carteira)
    console.log(carteira[0]['symbol'])
    console.log(emp)
    console.log(din)
    if (md==='compra'){
      for (var i =0; i < carteira.length; i++){
        if (carteira[i]['symbol'] === emp){
          carteira[i]['symbol'] = emp
          carteira[i]['value'] = carteira[i]['value'] + (v*q)
          carteira[i]['qnt']= carteira[i]['qnt'] + q
          din -= (v*q)
          ind = true
        }
        else{carteira[i] = carteira[i]}
      }
      if(ind === false){
        din-= (v*q)
        carteira[carteira.length+1] = {
          'symbol': emp,
          'value': v*q,
          'qnt':q    
        }
      }
      console.log(carteira)
      console.log(din)
      if (md==='venda'){
        for (var i =0; i < carteira.length; i++){
          if (carteira[i]['symbol'] === emp){
            carteira[i]['symbol'] = emp
            carteira[i]['value'] = carteira[i]['value'] - (v*q)
            carteira[i]['qnt']= carteira[i]['qnt'] - q
            din += (v*q)
            ind = true
          }
          else{carteira[i] = carteira[i]}
        }
        if(ind === false){window.alert("ERROR, você não possui essa ação")}
    }
    this.setState({carteira})
    this.setState({din})
  }
}
  
  render() {
    const info = this.state.info
    const carteira = this.state.carteira
    
    return (
      <div>
        <header style={{
                  background:"black",
                  display: "flex",
                  color:"white",
                  fontSize: "40px",  
                  justifyContent: "flex-start", 
                  flexFlow: "column nowrap", 
                  alignItems:"center", 
                  alignContent: "space-between"}
                  }>TegTrade Pro</header>
        <div style={{padding:"15px 15px"}}>
          Carteira: ${this.state.din}
        </div>
        
        <div style={{background:"gray",borderRadius: "10px",boxShadow: "5px 5px 10px rgba(0,0,0,0.5)",marginLeft:"15px",width:"150px",fontSize: "13px"}}>
          teste
        </div>



        <div style={{marginLeft:"300px", position:"absolute", top: "150px"}}>
          <input type="text" onChange={(e) => this.setState({...this.state, empresa: e.target.value})} placeholder="Código da Empresa"></input>
          <button onClick={this.getTimeSeries.bind(this)}>Consultar</button>
          {
          info != null ? 
          <div style={{background:"gray", width:"500px",borderRadius: "10px",boxShadow: "5px 5px 10px rgba(0,0,0,0.5)"}}> 
            <h3 style={{textAlign:"center"}}>{info["Meta Data"]["2. Symbol"].toUpperCase()}</h3>
            <select name="modeOpe" id="modeOpe" onChange={(e) => this.setState({...this.state, oper: e.target.value})}>
              <option value="compra">Compra</option>
              <option value="venda">Venda</option>
            </select>
            
            <input type="number" placeholder={"Valor"} id="val" onChange={(e) => this.setState({...this.state, value: e.target.value})}></input>
            <input type="number" placeholder={"Quantidade"} id="qnt" onChange={(e) => this.setState({...this.state, qnt: e.target.value})}></input>
            <button onClick={this.executa.bind(this)}>Executar</button>
            
            <div style={{fontSize: "15px",padding:"5pxs",marginLeft:"10px"}}>
              <p>OPEN: {info["Time Series (Daily)"][info["Meta Data"]["3. Last Refreshed"]]["1. open"]}</p>
              <p>HIGH: {info["Time Series (Daily)"][info["Meta Data"]["3. Last Refreshed"]]["2. high"]}</p>
              <p>LOW: {info["Time Series (Daily)"][info["Meta Data"]["3. Last Refreshed"]]["3. low"]}</p>
              <p>CLOSE: {info["Time Series (Daily)"][info["Meta Data"]["3. Last Refreshed"]]["4. close"]}</p>
              <p>VOLUME: {info["Time Series (Daily)"][info["Meta Data"]["3. Last Refreshed"]]["4. close"]}</p>
              <div style={{position:"absolute",top:"130px", left:"250px"}}>
                <p>SMA: </p>
                <p>TESTE</p>
                <p>TESTE</p>
                <p>TESTE</p>
                <p>TESTE</p>
              </div>
            </div>
            
          </div>
            
            : null}
        </div>


      <footer style={{textAlign: "center", fontStyle: "italic",position:"absolute",bottom:"0",marginLeft:"45%",padding:"5px"}}>© gDuarteg pro</footer>
      </div>
    )
  }
}

export default App