import React, {Component} from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './styles/FutureForecastCard.css';

var today = new Date().getDay();
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];
var thisWeek = [];
for (var i = 0; i < 8; i++) {
  thisWeek[i] = weekdays[today];
  if (today < 6) { today++; }
  else { today = 0; }
}

class FutureForecastCard extends Component {
  constructor(props) {
    super(props);
    this.callForecastApi = this.callForecastApi.bind(this);
    this.state = {
      dayOne: [],
      dayTwo: [],
      dayThree: [],
      dayFour: [],
      dayFive: [],
      daySix: [],
      daySeven: []
    };
  }

  componentDidMount() {
    this.getWeatherData();
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.getWeatherData();
  }

  callForecastApi = async () => {
    // for local dev
    //const url = 'http://localhost:5000/futureForecastApi?coords=' + this.props.coords[0] + "," + this.props.coords[1];
    const url = '/futureForecastApi?coords=' + this.props.coords[0] + "," + this.props.coords[1];
    const response = await fetch(url, {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getWeatherData = () => {
    const outerScope = this;
    this.callForecastApi().then(function(result) {
      if (result.latitude) {
        outerScope.setState({
          dayOne: [Math.round(result.daily.data["1"].apparentTemperatureHigh), Math.round(result.daily.data["1"].apparentTemperatureLow), result.daily.data["1"].icon],
          dayTwo: [Math.round(result.daily.data["2"].apparentTemperatureHigh), Math.round(result.daily.data["2"].apparentTemperatureLow), result.daily.data["2"].icon],
          dayThree: [Math.round(result.daily.data["3"].apparentTemperatureHigh), Math.round(result.daily.data["3"].apparentTemperatureLow), result.daily.data["3"].icon],
          dayFour: [Math.round(result.daily.data["4"].apparentTemperatureHigh), Math.round(result.daily.data["4"].apparentTemperatureLow), result.daily.data["4"].icon],
          dayFive: [Math.round(result.daily.data["5"].apparentTemperatureHigh), Math.round(result.daily.data["5"].apparentTemperatureLow), result.daily.data["5"].icon],
          daySix: [Math.round(result.daily.data["6"].apparentTemperatureHigh), Math.round(result.daily.data["6"].apparentTemperatureLow), result.daily.data["6"].icon],
          daySeven: [Math.round(result.daily.data["7"].apparentTemperatureHigh), Math.round(result.daily.data["7"].apparentTemperatureLow), result.daily.data["7"].icon],
        });
      }
    });
  }

  render() {
    return (
      <div className="futureForecastCard">
        <MuiThemeProvider>
          <Card>
            <CardTitle title="Looking Ahead" subtitle={"Next 7 days in " + this.props.search} />
              <CardText className="row">
                <div className="futureForecast col-sm">
                  {thisWeek[1]}<br></br>
                  <div className="iconDiv">
                    <img className="futureForecastIcon"
                    src={"/images/" + this.state.dayOne[2] + ".png"}
                    alt={this.state.dayOne[2]}></img>
                  </div>
                  <br></br>
                  {this.state.dayOne[0] + "°F / " + this.state.dayOne[1] + "°F"}
                </div>
                <div className="futureForecast col-sm">
                  {thisWeek[2]}<br></br>
                  <div className="iconDiv">
                    <img className="futureForecastIcon"
                    src={"/images/" + this.state.dayTwo[2] + ".png"}
                    alt={this.state.dayTwo[2]}></img>
                  </div>
                  <br></br>
                  {this.state.dayTwo[0] + "°F / " + this.state.dayTwo[1] + "°F"}
                </div>
                <div className="futureForecast col-sm">
                  {thisWeek[3]}<br></br>
                  <div className="iconDiv">
                    <img className="futureForecastIcon"
                      src={"/images/" + this.state.dayThree[2] + ".png"}
                      alt={this.state.dayThree[2]}></img>
                  </div>
                  <br></br>
                  {this.state.dayThree[0] + "°F / " + this.state.dayThree[1] + "°F"}
                </div>
                <div className="futureForecast col-sm">
                  {thisWeek[4]}<br></br>
                  <div className="iconDiv">
                    <img className="futureForecastIcon"
                    src={"/images/" + this.state.dayFour[2] + ".png"}
                    alt={this.state.dayFour[2]}></img>
                  </div>
                  <br></br>
                  {this.state.dayFour[0] + "°F / " + this.state.dayFour[1] + "°F"}
                </div>
                <div className="futureForecast col-sm">
                  {thisWeek[5]}<br></br>
                  <div className="iconDiv">
                    <img className="futureForecastIcon"
                    src={"/images/" + this.state.dayFive[2] + ".png"}
                    alt={this.state.dayFive[2]}></img>
                  </div>
                  <br></br>
                  {this.state.dayFive[0] + "°F / " + this.state.dayFive[1] + "°F"}
                </div>
                <div className="futureForecast col-sm">
                  {thisWeek[6]}<br></br>
                  <div className="iconDiv">
                    <img className="futureForecastIcon"
                    src={"/images/" + this.state.daySix[2] + ".png"}
                    alt={this.state.daySix[2]}></img>
                  </div>
                  <br></br>
                  {this.state.daySix[0] + "°F / " + this.state.daySix[1] + "°F"}
                </div>
                <div className="futureForecast col-sm">
                  {thisWeek[7]}<br></br>
                  <div className="iconDiv">
                    <img className="futureForecastIcon"
                    src={"/images/" + this.state.daySeven[2] + ".png"}
                    alt={this.state.daySeven[2]}></img>
                  </div>
                  <br></br>
                  {this.state.daySeven[0] + "°F / " + this.state.daySeven[1] + "°F"}
                </div>
              </CardText>
          </Card>
        </MuiThemeProvider>
      </div>
    );
  }

}

export default FutureForecastCard;
