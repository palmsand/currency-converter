import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import fx from 'money';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      bvalue: 'USD',
      evalue: 'CAD',
      valueAmount: 1,
      currency: [],
      rates: [],
      isLoading: true,
      errors: null, 
      conversion: null
    };

    this.handleChangeFrom = this.handleChangeFrom.bind(this);
    this.handleChangeTo = this.handleChangeTo.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.convertMoney = this.convertMoney.bind(this);
  }

  componentDidMount() {
    
    // call common-currency api
    axios.get('https://gist.githubusercontent.com/mddenton/062fa4caf150bdf845994fc7a3533f74/raw/27beff3509eff0d2690e593336179d4ccda530c2/Common-Currency.json')
      .then(response => 
        Object.keys(response.data).map(key => response.data[key])
      )
      .then(currency => {
        this.setState({
          currency
        });
      })
        
    // call exchangerates api 
    axios.get('https://api.exchangeratesapi.io/latest?base=USD')
      .then(response => 
        response.data.rates
      )
      .then(rates => {
        this.setState({
          rates,
          isLoading: false
        });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  handleChangeFrom(event) {
    this.setState({
      bvalue: event.target.value,
    });  
  }

  handleChangeTo(event) {
    this.setState({
      evalue: event.target.value
    });  
  }

  handleAmountChange(event){
    this.setState({
      valueAmount: event.target.value
    });
  }

  convertMoney(event) { 
    event.preventDefault();

    fx.base ="USD";
    const superRate = {...this.state.rates};
    
    fx.rates = superRate;
  
    let conversion1 = fx.convert(this.state.valueAmount, {from: this.state.bvalue, to: this.state.evalue});

    let newConversion = conversion1.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    this.setState({
      conversion: newConversion
    })
  }

  render() {

      if(!this.state.currency.length && !this.state.rates.length){
        return null;
      }

      return (
      
        <div className="container newTable newImage">
        <h2>Currency Converter</h2>
          
          <table>
            <tr>
              <td>Base Currency:</td>
              <td>
                <select value={this.state.bvalue} onChange={this.handleChangeFrom}>

                { this.state.currency.map((el, index) => <option key={index} value={el.code.toUpperCase()}>{el.code.toUpperCase()}</option>)}
              
                </select>
              </td>
              <td>Equivalency Currency:</td>
              <td>
                <select value={this.state.evalue} onChange={this.handleChangeTo}>

                { this.state.currency.map((el, index) => <option key={index} value={el.code.toUpperCase()}>{el.code.toUpperCase()}</option>)}
              
                </select>
              </td>
            </tr>
            <tr>
              <td>Enter Amount:</td>
              <td><input type="tex" value={this.state.valueAmount} onChange={this.handleAmountChange} size="5"/></td>
              <td>Converted Amount:</td>
              <td>{this.state.conversion}</td>
            </tr>       
          </table>

          <div className="convertButton">
            <button  onClick={this.convertMoney}>Convert</button>
          </div>
        </div>
    )
  }
}

export default App;
 