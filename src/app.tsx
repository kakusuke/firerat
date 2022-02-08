import React from 'react';
import * as ReactDOM from 'react-dom';
import { RecoilRoot } from "recoil";
import Preferences from "./components/Preferences";
import Header from "./components/Header";

function render() {
  ReactDOM.render(
    <RecoilRoot>
      <Header/>
      <hr/>
      <Preferences/>
    </RecoilRoot>
    , document.getElementById('container'));
}

render();
