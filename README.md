OVERALL STRUCTURE
SkyCast is an app hosted on Heroku and is comprised of a ReactJS UI running on
a NodeJS server with ExpressJS. I chose this structure for my app because:
- ReactJS is ideal for single-page applications
- the NodeJS package manager, npm, has so many awesome open-source packages
  that assist with Node and React development
Heroku has a minimal build for a NodeJS server with ExpressJS in their dev
tutorials, and its very quick to set up. Fortunately, one of the Heroku
architects published a blog post about how to deploy a ReactJS front-end on
a NodeJS (https://blog.heroku.com/deploying-react-with-zero-configuration).
I used the community buildpack (https://github.com/mars/heroku-cra-node)
he developed to make sure everything was configured correctly.
All of the functionality of the server is contained in server/index.js.
Everything for the front-end is in the react-ui/ directory.


REQUIREMENTS
Historic Weather Data
To display historic weather information, I used the Victory visualization
library. I kept it pretty simple with a chart of the high and low temps
of the previous week; some more extensive visualization could be added to
the HistoricWeatherCard component in future iterations.
    More info on that library here: https://formidable.com/open-source/victory/
Search History
I used a combination of cookies and persistent server storage to keep track
of a user's search history. A cookie is issued on the front-end with a unique
ID for each user, and this cookie persists until the user clears their browser
cookies/cache/history.
    More info on the cookie package I used here:
    https://www.npmjs.com/package/react-cookies
This unique id is passed to the server and used as a key to get and set a
user's search history, which is stored in the file system for persistence.
Unfortunately, this package is still pretty buggy. While it never fails to
store a user's search, it occasionally fails fetching all of their searches
from storage. Tracking users and their search history in a database instead
of this persistent file storage would be the first enhancement I would stage
for future iterations.
    More info on the persistent storage package I used here:
    https://www.npmjs.com/package/node-persist


STYLE
ReactJS is a robust front-end framework based on Components. The great thing
about React is there are some great libraries out there with pre-built,
extensively styled Components. I chose to use the Material-UI library,
which consists of components styled after Google's Material Design.
Specifically, I used their AutoComplete component for the SkyCast search bar
and their Card component for displaying weather information.
Learn more about that library here: http://www.material-ui.com/#/


BONUS
Frameworks: This app was built using two JavaScript application frameworks -
ReactJS for the front-end client and NodeJS for the back-end server. I believe
there are advantages to both React and Node that give this set up an advantage
over "all-in-one" frameworks like Angular, especially for a relatively simple
application that a company will want to quickly iterate from.

Testing suites: I primarily used the Jest testing suite when developing
SkyCast; conveniently, it comes pre-packaged when creating a ReactJS app.
Admittedly, I was not very familiar with JavaScript testing prior to building
this app, however Jest seems to be a pretty comprehensive suite in my opinion.
I used it when building my React components to test that they would render
properly (in the react-ui/src/tests/ directory) but I believe it could be used
for much more robust unit and integration tests.

Resource Pre-Compilers: Babel is the main resource pre-compiler I used while
developing SkyCast since it compiles ES6 and JSX code to browser-ready
JavaScript. I used JSX and some ES6 features in place of regular JavaScript to
build the ReactJS components in the react-ui/src directory.
More about Babel: https://babeljs.io/
