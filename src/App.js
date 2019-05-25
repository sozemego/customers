import React, { Component } from "react";
import { Game } from "./game/Game";
import { GameStart } from "./game/GameStart";
import { GameInfo } from "./game/GameInfo";
import "antd/dist/antd.css";
import { H1 } from "./components/H1";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { LevelEditor } from "./levelEditor/LevelEditor";
import { getPathname } from "./history";

class App extends Component {
  componentDidMount() {
    this.pathname = getPathname();
    //poor man's history listener
    setInterval(() => {
      const pathname = getPathname();
      if (this.pathname !== pathname) {
        this.pathname = pathname;
        this.setState({});
      }
    }, 50);
  }

  render() {
    const pathname = getPathname();
    let component = (
      <>
        <GameInfo />
        <GameStart />
        <Game />
      </>
    );

    if (pathname === "/leveleditor") {
      component = <LevelEditor />;
    }

    return (
      <Provider store={store}>
        <H1>Customers</H1>
        {component}
      </Provider>
    );
  }
}

export default App;
