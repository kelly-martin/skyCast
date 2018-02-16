import React, {Component} from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './styles/CurrentWeatherCard.css';

class CurrentWeatherCard extends Component {
  constructor(props) {
    super(props);
    this.callForecastApi = this.callForecastApi.bind(this);
    this.getWeatherData = this.getWeatherData.bind(this);
    this.state = {
      currentTemp: "",
      todaysLow: "",
      todaysHigh: "",
      icon: "",
      hourlySummary: "",
      minutelySummary: ""
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
    //const url = 'http://localhost:5000/forecastApi?coords=' + this.props.coords[0] + "," + this.props.coords[1];
    const url = '/forecastApi?coords=' + this.props.coords[0] + "," + this.props.coords[1];
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
          currentTemp: Math.round(result.currently.apparentTemperature),
          todaysLow: Math.round(result.daily.data["0"].apparentTemperatureLow),
          todaysHigh: Math.round(result.daily.data["0"].apparentTemperatureHigh),
          icon: result.currently.icon,
          hourlySummary: result.hourly.summary
        });
        if (result.minutely) {
          outerScope.setState({
            minutelySummary: result.minutely.summary
          });
        }
      }
    });
  }

  render() {
    return (
      <div className="currentWeatherCard">
        <MuiThemeProvider>
          <Card>
            <CardTitle
              title={"Current Weather"}
              subtitle={this.props.search}/>
            <div className="currentWeather row">
              <img className="currentWeatherIcon"
                src={"/images/" + this.state.icon + ".png"}
                alt={this.state.icon}></img>
              <CardTitle
                title={this.state.currentTemp + " °F"}
                subtitle=
                {this.state.todaysHigh + "°F / " + this.state.todaysLow + "°F"} />
            </div>
            <CardText>
              {this.state.minutelySummary + " " + this.state.hourlySummary}
            </CardText>
          </Card>
        </MuiThemeProvider>
      </div>
    );
  }

}

export default CurrentWeatherCard;
