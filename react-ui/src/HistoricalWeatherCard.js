import React, { Component } from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { VictoryChart, VictoryLine, VictoryLabel, VictoryTheme } from 'victory';
import './styles/HistoricalWeatherCard.css';

const timeNow = Date.now();

class HistoricalWeatherCard extends Component {
  constructor(props) {
    super(props);
    this.callForecastApi = this.callForecastApi.bind(this);
    this.getWeatherData = this.getWeatherData.bind(this);
    this.state = {
      lows: [],
      highs: []
    };
  }

  componentDidMount() {
    this.getWeatherData();
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps;
    this.getWeatherData();
  }

  callForecastApi = async (historicalTime) => {
    // for local dev
    //const url = 'http://localhost:5000/historicalForecastApi?coords=' + this.props.coords[0] + "," + this.props.coords[1] + "&time=" + historicalTime;
    const url = '/historicalForecastApi?coords=' + this.props.coords[0] + "," + this.props.coords[1] + "&time=" + historicalTime;
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
    // starting a week ago
    var historicalTime = timeNow - 691200000;
    var lows = [];
    var highs = [];
    var index = 0;
    for (var i = 0; i < 7; i++) {
      var timeToPass = historicalTime + (86400000 * i);
      // divide by 1000 to pass seconds
      this.callForecastApi(Math.round(timeToPass/1000)).then(function(result) {
        if (result.daily) {
          var time = new Date(historicalTime + (86400000 * index));
          var date = (time.getMonth()+1) + "/" + time.getDate();
          lows.push({x: date, y: Math.round(result.daily.data["0"].apparentTemperatureLow)});
          highs.push({x: date, y: Math.round(result.daily.data["0"].apparentTemperatureHigh)});
          outerScope.setState({
            lows: lows,
            highs: highs
          });
          index++;
        }
      });
    }
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Card className="historicalWeatherCard">
            <CardTitle title="Last Week's Highs and Lows" subtitle={"in " + this.props.search} />
            <VictoryChart theme={VictoryTheme.material}>
              <VictoryLabel x={0} y={30} text={"Temperature (°F)"}
              style={{fontFamily: 'Roboto, sans-serif'}}/>
              <VictoryLabel x={320} y={300} text={"Date"}
              style={{fontFamily: 'Roboto, sans-serif'}}/>
              <VictoryLine
                style={{
                  data: { stroke: "#0BC4E1" },
                  parent: { border: "1px solid #ccc"}
                }}
                data={this.state.highs}
              />
              <VictoryLine
                style={{
                  data: { stroke: "#03909E" },
                  parent: { border: "1px solid #ccc"}
                }}
                data={this.state.lows}
              />
            </VictoryChart>
          </Card>
        </MuiThemeProvider>
      </div>
    );
  }

}

export default HistoricalWeatherCard;
