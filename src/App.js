import React, { Component } from "react";
import { Game } from "./game/Game";
import { GameStart } from "./game/GameStart";
import { GameInfo } from "./game/GameInfo";
import "antd/dist/antd.css";
import { H1 } from "./components/H1";
import { Provider } from "react-redux";
import { store } from "./store/store";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <H1>Customers</H1>
        <GameInfo />
        <GameStart />
        <Game />
      </Provider>
    );
  }
}

export default App;
