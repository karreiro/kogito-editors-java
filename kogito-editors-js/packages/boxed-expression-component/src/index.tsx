/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import { ExpressionProps } from "./api";
import { BoxedExpressionEditor } from "./components";

export * from "./api";
export * from "./components";

window.renderBoxedExpressionEditor = (selector: string, definition: ExpressionProps) => {
  ReactDOM.render(
    <BoxedExpressionEditor expressionDefinition={{ selectedExpression: definition }} />,
    document.getElementById(selector)
  );
};

document.body.ondrag = (e) => console.log(e);
document.body.ondragend = (e) => console.log(e);
document.body.ondragenter = (e) => console.log(e);
document.body.ondragleave = (e) => console.log(e);
document.body.ondragover = (e) => console.log(e);
document.body.ondragstart = (e) => console.log(e);
