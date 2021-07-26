/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { useState } from "react";
import * as ReactDOM from "react-dom";
import { ExpressionProps } from "../../../../dist/boxed-expression-component/boxed-expression-component/src/api/ExpressionProps";
import "./index.css";
// noinspection ES6PreferShortImport
import {
  BoxedExpressionEditor,
  ContextProps,
  DataType,
  DecisionTableProps,
  ExpressionContainerProps,
  FunctionProps,
  InvocationProps,
  ListProps,
  LiteralExpressionProps,
  RelationProps,
} from "./lib";

export const App: React.FunctionComponent = () => {
  //This definition comes directly from the decision node
  const selectedExpression: ExpressionProps = {
    uid: "id1",
    logicType: "Context",
    name: "Expression Name",
    dataType: "<Undefined>",
    contextEntries: [
      {
        entryInfo: {
          name: "ContextEntry-1",
          dataType: "<Undefined>",
        },
        entryExpression: {
          uid: "id2",
          logicType: "Decision Table",
          name: "ContextEntry-1",
          dataType: "<Undefined>",
          hitPolicy: "UNIQUE",
          aggregation: "",
          input: [
            {
              name: "input-1",
              dataType: "<Undefined>",
            },
            {
              name: "input-2",
              dataType: "<Undefined>",
            },
          ],
          output: [
            {
              name: "output-1",
              dataType: "<Undefined>",
              width: 150,
            },
          ],
          annotations: [
            {
              name: "annotation-1",
              width: 226,
            },
          ],
          rules: [
            {
              inputEntries: ['1 "A"', '2 "A"'],
              outputEntries: ['3 "A"'],
              annotationEntries: [""],
            },
            {
              inputEntries: ['11 "A"', '22 "A"'],
              outputEntries: ['33 "A"'],
              annotationEntries: [""],
            },
          ],
        },
        editInfoPopoverLabel: "Edit Context Entry",
        nameAndDataTypeSynchronized: true,
      },
    ],
    result: {
      uid: "id3",
      logicType: "Context",
      contextEntries: [
        {
          entryInfo: {
            name: "ContextEntry-1",
            dataType: "<Undefined>",
          },
          entryExpression: {
            uid: "id4",
            name: "ContextEntry-1",
            dataType: "<Undefined>",
            isHeadless: true,
            logicType: "Relation",
            columns: [
              {
                name: "column-1",
                dataType: "<Undefined>",
                width: 150,
              },
              {
                name: "column-3",
                dataType: "<Undefined>",
              },
              {
                name: "column-2",
                dataType: "<Undefined>",
                width: 150,
              },
            ],
            rows: [
              ['111 "B"', '222 "B"', '444 "B"'],
              ['888 "B"', '161616 "B"', '323232 "B"'],
            ],
          },
          editInfoPopoverLabel: "Edit Context Entry",
          nameAndDataTypeSynchronized: true,
        },
      ],
      result: {
        uid: "id5",
        name: "Expression Name",
        dataType: "<Undefined>",
        logicType: "Literal expression",
        content: '646464 "C"',
      },
      entryInfoWidth: 150,
      entryExpressionWidth: 530,
    },
    entryInfoWidth: 150,
    entryExpressionWidth: 758,
  } as ExpressionProps;

  const pmmlParams = [
    {
      document: "mining pmml",
      modelsFromDocument: [
        {
          model: "MiningModelSum",
          parametersFromModel: [
            { name: "input1", dataType: DataType.Any },
            { name: "input2", dataType: DataType.Any },
            { name: "input3", dataType: DataType.Any },
          ],
        },
      ],
    },
    {
      document: "regression pmml",
      modelsFromDocument: [
        {
          model: "RegressionLinear",
          parametersFromModel: [
            { name: "i1", dataType: DataType.Number },
            { name: "i2", dataType: DataType.Number },
          ],
        },
      ],
    },
  ];

  const [updatedExpression, setUpdatedExpression] = useState(selectedExpression);

  const expressionDefinition: ExpressionContainerProps = { selectedExpression };

  //Defining global function that will be available in the Window namespace and used by the BoxedExpressionEditor component
  window.beeApi = {
    resetExpressionDefinition: (definition: ExpressionProps) => setUpdatedExpression(definition),
    broadcastLiteralExpressionDefinition: (definition: LiteralExpressionProps) => setUpdatedExpression(definition),
    broadcastRelationExpressionDefinition: (definition: RelationProps) => setUpdatedExpression(definition),
    broadcastContextExpressionDefinition: (definition: ContextProps) => setUpdatedExpression(definition),
    broadcastListExpressionDefinition: (definition: ListProps) => setUpdatedExpression(definition),
    broadcastInvocationExpressionDefinition: (definition: InvocationProps) => setUpdatedExpression(definition),
    broadcastFunctionExpressionDefinition: (definition: FunctionProps) => setUpdatedExpression(definition),
    broadcastDecisionTableExpressionDefinition: (definition: DecisionTableProps) => setUpdatedExpression(definition),
  };

  return (
    <div className="showcase">
      <div className="boxed-expression">
        <BoxedExpressionEditor expressionDefinition={expressionDefinition} pmmlParams={pmmlParams} />
      </div>
      <div className="updated-json">
        <pre>{JSON.stringify(updatedExpression, null, 2)}</pre>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
