install dependency:
`npm install`
the state of the whole application lives inside the store

install Redux
```
cd webpack-4-quickstart/

npm i redux --save-dev
```

# create store

## create a directory for the store

`mkdir -p src/js/store`

## Create a new file named index.js in src/js/store and finally initialize the store:
```
// src/js/store/index.js
import { createStore } from "redux";
import rootReducer from "../reducers/index";
const store = createStore(rootReducer);
export default store;
```

the state comes from reducers.
A reducer takes two parameters: the current state and an action

## Create a directory for the root reducer:
`mkdir -p src/js/reducers`
Then create a new file named index.js in the src/js/reducers:
```
// src/js/reducers/index.js
const initialState = {
  articles: []
};
const rootReducer = (state = initialState, action) => state;
export default rootReducer;
```

# Action
Reducers produce the state of the application.
The second principle of Redux says the only way to change the state is by sending a signal to the store.This signal is an action. “Dispatching an action” is the process of sending out a signal.

Create a directory for the actions:
`mkdir -p src/js/actions`

Then create a new file named index.jsin src/js/actions:

```
// src/js/actions/index.js
export const addArticle = article => ({ type: "ADD_ARTICLE", payload: article });
```

it’s better to have action types declared as constants.

`mkdir -p src/js/constants`

Then create a new file named action-types.js into the src/js/constants:

```
// src/js/constants/action-types.js
export const ADD_ARTICLE = "ADD_ARTICLE";
```

Now open up again src/js/actions/index.jsand update the action to use action types:

```
// src/js/actions/index.js
import { ADD_ARTICLE } from "../constants/action-types";
export const addArticle = article => ({ type: ADD_ARTICLE, payload: article });
```

# refactoring the reducer

the Redux store is like a brain: it’s in charge for orchestrating all the moving parts in Redux
the state of the application lives as a single, immutable object within the store
as soon as the store receives an action it triggers a reducer
the reducer returns the next state

The reducer calculates the next state depending on the action type. Moreover, it should return at least the initial state when no action type matches.

When the action type matches a case clause the reducer calculates the next state and returns a new object. 
Open up src/js/reducers/index.jsand update the reducer as follow:
```
import { ADD_ARTICLE } from "../constants/action-types";
const initialState = {
  articles: []
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ARTICLE:
      state.articles.push(action.payload);
      return state;
    default:
      return state;
  }
};
export default rootReducer;
```

With the spread operator we can make our reducer even better

```
import { ADD_ARTICLE } from "../constants/action-types";
const initialState = {
  articles: []
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ARTICLE:
      return { ...state, articles: [...state.articles, action.payload] };
    default:
      return state;
  }
};
export default rootReducer;
```

The object spread operator is still in stage 3. Install Object rest spread transform to avoid a SyntaxError Unexpected token when using the object spread operator in Babel:

`npm i --save-dev babel-plugin-transform-object-rest-spread`
Open up .babelrc  and update the configuration:

```
{
    "presets": ["env", "react"],
    "plugins": ["transform-object-rest-spread"]
}
```

Redux protip: the reducer will grow as your app will become bigger. You can split a big reducer into separate functions and combine them with combineReducers https://redux.js.org/api/combinereducers

# Redux store methods

The most important methods are:

getState for accessing the current state of the application
dispatch for dispatching an action
subscribe for listening on state changes

Start off by accessing the current state:
`store.getState()`
output
`{articles: Array(0)}`

The subscribe method accepts a callback that will fire whenever an action is dispatched. Dispatching an action means notifying the store that we want to change the state.
`store.subscribe(() => console.log('Look ma, Redux!!'))`

To change the state in Redux we need to dispatch an action. To dispatch an action you have to call the dispatch method.

`store.dispatch( addArticle({ name: 'React Redux Tutorial for Beginners', id: 1 }) )`

# connecting React with Redux
nstall react-redux by running
`npm i react-redux --save-dev`

To start off connecting Redux with React we’re going to use Provider.
Provider is an high order component coming from react-redux.

Create file src/js/index.js :

```
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./store/index";
import App from "./components/App";
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("app")
);
```

Now let’s create the App
Create a directory for holding the components:
`mkdir -p src/js/components`
and a new file named App.jsinside src/js/components

```
// src/js/components/App.js
import React from "react";
import List from "./List";
const App = () => (
  <div className="row mt-5">
    <div className="col-md-4 offset-md-1">
    <h2>Articles</h2>
      <List />
    </div>
  </div>
);
export default App;
```

Create a new file named List.js inside src/js/components

```
// src/js/components/List.js
import React from "react";
import { connect } from "react-redux";
const mapStateToProps = state => {
  return { articles: state.articles };
};
const ConnectedList = ({ articles }) => (
  <ul className="list-group list-group-flush">
    {articles.map(el => (
      <li className="list-group-item" key={el.id}>
        {el.title}
      </li>
    ))}
  </ul>
);
const List = connect(mapStateToProps)(ConnectedList);
export default List;
```

The List component receives the prop articleswhich is a copy of the articlesarray. Such array lives inside the Redux state we created earlier. It comes from the reducer:

```
const initialState = {
  articles: []
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ARTICLE:
      return { ...state, articles: [...state.articles, action.payload] };
    default:
      return state;
  }
};
```

Then it’s a matter of using the prop inside JSX for generating a list of articles:

```
{articles.map(el => (
  <li className="list-group-item" key={el.id}>
    {el.title}
  </li>
))}
```

React protip: take the habit of validating props with PropTypes

#Form component and Redux actions

Even when using Redux it is totally fine to have stateful components.

Not every piece of the application’s state should go inside Redux.

The component contains some logic for updating the local state upon a form submission.

Plus it receives a Redux action as prop. This way it can update the global state by dispatching the addArticle action.

Create a new file named Form.js inside src/js/components. It should look like the following:
```
// src/js/components/Form.js
import React, { Component } from "react";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { addArticle } from "../actions/index";
const mapDispatchToProps = dispatch => {
  return {
    addArticle: article => dispatch(addArticle(article))
  };
};
class ConnectedForm extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    const { title } = this.state;
    const id = uuidv1();
    this.props.addArticle({ title, id });
    this.setState({ title: "" });
  }
  render() {
    const { title } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={this.handleChange}
          />
        </div>
        <button type="submit" className="btn btn-success btn-lg">
          SAVE
        </button>
      </form>
    );
  }
}
const Form = connect(null, mapDispatchToProps)(ConnectedForm);
export default Form;

```

mapDispatchToProps connects Redux actions to React props. This way a connected component is able to dispatch actions.

You can see how the action gets dispatched in the handleSubmit method:

```
// ...
  handleSubmit(event) {
    event.preventDefault();
    const { title } = this.state;
    const id = uuidv1();
    this.props.addArticle({ title, id }); // Relevant Redux part!!
// ...
  }
// ...
```

Finally the component gets exported as Form. Form is the result of connecting ConnectedForm with the Redux store.

Side note: the first argument for connect must be nullwhen mapStateToProps is absent like in the Form example. Otherwise you’ll get TypeError: dispatch is not a function.

Our components are all set!

Update App to include the Form component:

```
import React from "react";
import List from "./List";
import Form from "./Form";
const App = () => (
  <div className="row mt-5">
    <div className="col-md-4 offset-md-1">
      <h2>Articles</h2>
      <List />
    </div>
    <div className="col-md-4 offset-md-1">
      <h2>Add a new article</h2>
      <Form />
    </div>
  </div>
);
export default App;
```

Install uuid with:

`npm i uuid --save-dev`
Now run webpack (or Parcel) with:

`npm start`

and head over to http://localhost:8080

