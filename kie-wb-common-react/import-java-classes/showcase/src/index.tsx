import "@patternfly/react-core/dist/styles/base.css";
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './GWTBridge';
import { ImportJavaClasses } from "./components/ImportJavaClasses/ImportJavaClasses";

ReactDOM.render(
  <ImportJavaClasses buttonStyle="secondary" />,
  document.getElementById('root')
);