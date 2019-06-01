import React, { Component } from "react";
import { Game } from "./game/Game";
import { GameStart } from "./game/GameStart";
import { GameInfo } from "./game/GameInfo";
import "antd/dist/antd.css";
import { H1 } from "./components/H1";
import { LevelEditor } from "./levelEditor/LevelEditor";
import { getPathname } from "./history";
import { levelsLoaded } from "./game/actions";
import { connect } from "react-redux";
import { getLevelsFromLocalStorage } from "./levelEditor/business";
import settings from "../package.json";
import build from "./build.json";

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

    fetch("levels.json")
      .then(res => res.json())
      .then(res => {
        const levels = getLevelsFromLocalStorage();
        this.props.dispatch(
          levelsLoaded({
            ...res,
            ...levels
          })
        );
      });
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
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ flex: "1" }} />
          <H1 style={{ flex: "1" }}>Customers</H1>
          <div
            style={{
              fontSize: "0.6rem",
              color: "gray",
              flex: "1"
            }}
          >
            <div
              style={{
                marginRight: "25px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <span>{`build: ${build.build} at ${build.date}`}</span>
              <span>{`version: ${settings.version}`}</span>
            </div>
          </div>
        </div>
        {component}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  null
)(App);
