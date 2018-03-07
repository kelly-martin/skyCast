import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import './styles/SearchBar.css';
/* global google */

// This component is in charge of:
//    - fetching user's search history from server
//    - updating user's search history by calling server
//    - autocompleting user's query (via Google Places API)
//    - geocoding user's query
//    - passing the geocoordinates back to the parent App

// This array is updated throughout the user's session as
// they make searches
var recentSearches = [];
var searchBarHintText = "Enter a city, zip, or location";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.populateMenuData = this.populateMenuData.bind(this);
    this.updateRecentSearches = this.updateRecentSearches.bind(this);
    this.getSearchHistory = this.getSearchHistory.bind(this);
    this.setSearchHistory = this.setSearchHistory.bind(this);
    this.geocoder = new google.maps.Geocoder();
    this.service = new google.maps.places.AutocompleteService();
    this.getLatLng = this.getLatLng.bind(this);

    // load user's most recent searches, pre-load UI accordingly
    const outerScope = this;
    this.getSearchHistory().then(function(result) {
      if (result.length > 0) {
        recentSearches = result;
        // pre-load the UI with the user's most recently searched location
        var coords = outerScope.getLatLng(result[0]);
        setTimeout(outerScope.props.appCallback, 1000, result[0], coords);
      }
      // pre-load the UI with Denver weather if new user
      else {
        outerScope.props.appCallback("Denver, CO, USA", [39.7392358, -104.990251]);
      }
    });

    this.state = {
      searchText: '',
      menuData: recentSearches
    };
  }

  getSearchHistory = async () => {
    // for local dev
    //const url = 'http://localhost:5000/getSearchHistory?userID=' + this.props.userID;
    const url = '/getSearchHistory?userID=' + this.props.userID;
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

// Called as user types in search bar
  handleUpdateInput = (searchText) => {
    this.setState({
      searchText: searchText,
    });
    // populate the menu with Google Place predictions when they have
    // typed more than one letter
    if (searchText.length > 1) {
      const outerScope = this;
      this.service.getPlacePredictions({ input: searchText, types: ['(cities)'] },
        function(predictions, status) {
          if (status === 'OK') {
            outerScope.populateMenuData(predictions);
          }
        });
    }
    // if the user backspaced all the way, populate the menu with
      // their recent searches
    else {
      this.populateMenuData(recentSearches);
      if (recentSearches.length > 0) {
        searchBarHintText = "Your most recent searches are shown below";
      }
    }
  }

  populateMenuData = (array) => {
    var data = [];
    for (var i=0; i<array.length; i++) {
      // if array passed in contains Google Places
      if (array[i].description) {
        data[i] = array[i].description;
      } else { data[i] = array[i]; }
    }
    this.setState({ menuData: data });
  }

// called when user clicks on an autocomplete suggestion or hits enter
  handleNewRequest = (searchText) => {
    this.setState({
      searchText: '',
    });
    // get geocoordinates and pass them back to parent app
    var coords = this.getLatLng(searchText);
    setTimeout(this.props.appCallback, 1000, searchText, coords);

    this.updateRecentSearches(searchText);
    // user's search history will be set with updated array of recent searches
    this.setSearchHistory(searchText);
    this.populateMenuData(recentSearches);
  }

  updateRecentSearches = (searchText) => {
    // add most recent search to the beginning of the array
    if (recentSearches.length > 0) {
      // if they have made the same search before, remove it from the
      // array, but still add search to the beginning
      if (recentSearches.indexOf(searchText) > -1) {
        recentSearches.splice(recentSearches.indexOf(searchText), 1);
      }
      recentSearches.unshift(searchText);
    } else {
      recentSearches[0] = searchText;
    }
  }

  setSearchHistory = async (searchText) => {
    // for local dev
    //const url = 'http://localhost:5000/setSearchHistory?userID=' + this.props.userID + "&search=" + searchText;
    const url = '/setSearchHistory?userID=' + this.props.userID + "&search=" + searchText;;
    const response = await fetch(url, {
      method: 'POST',
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getLatLng = (searchText) => {
    var coords = [];
    this.geocoder.geocode({ 'address': searchText }, function(results, status) {
      if (status === 'OK') {
        coords[0] = results[0].geometry.location.lat();
        coords[1] = results[0].geometry.location.lng();
      }
    });
    return coords;
  }

  render() {
    return (
      <div className="searchBar">
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <AutoComplete
          hintText={searchBarHintText}
          floatingLabelText="Show me the weather in..."
          searchText={this.state.searchText}
          disableFocusRipple={true}
          maxSearchResults={5}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleNewRequest}
          dataSource={this.state.menuData}
          filter={AutoComplete.noFilter}
          openOnFocus={true}
          fullWidth={true}
        />
      </MuiThemeProvider>
    </div>
    );
  }
}

export default SearchBar;
