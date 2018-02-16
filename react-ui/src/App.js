import React, { Component } from 'react';
import './styles/App.css';
import cookie from 'react-cookies';
import randomID from 'random-id';
import SearchBar from './SearchBar';
import CurrentWeatherCard from './CurrentWeatherCard';
import FutureForecastCard from './FutureForecastCard';
import HistoricalWeatherCard from './HistoricalWeatherCard';

// This is the parent component in charge of a few things:
//    - idenitifying user via cookie and passing id to SearchBar
//    - loading user's previous searches
//    - adding searches to user's search history
//    - updating components when user enters a new search

class App extends Component {
  constructor(props) {
    super(props);
    // create cookie for user if one does not exist for them
    if (cookie.load('user') === undefined) {
      const userID = randomID(20, "aA0");
      cookie.save('user', userID, { maxAge: 1000*60*60*24*1000 });
    }
    this.state = {
      search: "",
      coords: [],
      user: cookie.load('user')
    };
    this.searchBarCallback = this.searchBarCallback.bind(this);
  }

  // SearchBar lets App know when a user has entered a new search
  searchBarCallback(search, coords) {
    this.setState({
      search: search,
      coords: coords
    });
  }

  render() {
    return (
      <div className="App">
        <div className="header row">
          <h1 className="col-md-3"><a href="">SkyCast</a></h1>
          <SearchBar className="col-md-9" userID={this.state.user} appCallback={this.searchBarCallback}/>
        </div>
        <div className="container">
          <div className="row weatherRow">
            <div className="currentWeatherDiv col-lg-4">
              <CurrentWeatherCard search={this.state.search} coords={this.state.coords}/>
            </div>
            <div className="col-lg-8">
              <FutureForecastCard search={this.state.search} coords={this.state.coords}/>
            </div>
          </div>
          <HistoricalWeatherCard search={this.state.search} coords={this.state.coords}/>
        </div>
      </div>
    );
  }
}

export default App;
