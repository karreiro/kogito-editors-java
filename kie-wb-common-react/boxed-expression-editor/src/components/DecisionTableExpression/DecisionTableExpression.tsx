/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "./DecisionTableExpression.css";
import {
  BuiltinAggregation,
  DataType,
  DecisionTableProps,
  GroupOperations,
  HitPolicy,
  TableOperation,
} from "../../api";
import * as React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Table } from "../Table";
import { ColumnInstance } from "react-table";
import { HitPolicySelector } from "./HitPolicySelector";
import * as _ from "lodash";
import { useBoxedExpressionEditorI18n } from "../../i18n";

enum DecisionTableColumnType {
  InputClause = "input",
  OutputClause = "output",
  Annotation = "annotation",
}

export const DecisionTableExpression: React.FunctionComponent<DecisionTableProps> = ({
  uid,
  hitPolicy = HitPolicy.Unique,
  aggregation = BuiltinAggregation["<None>"],
  input = [{ name: "input-1", dataType: DataType.Undefined }],
  output = [{ name: "output-1", dataType: DataType.Undefined }],
  annotations = ["annotation-1"],
}) => {
  const { i18n } = useBoxedExpressionEditorI18n();

  const generateColumnConfiguration = useCallback(
    (groupName: string) => [
      {
        group: groupName,
        items: [
          { name: i18n.columnOperations.insertLeft, type: TableOperation.ColumnInsertLeft },
          { name: i18n.columnOperations.insertRight, type: TableOperation.ColumnInsertRight },
          { name: i18n.columnOperations.delete, type: TableOperation.ColumnDelete },
        ],
      },
      {
        group: i18n.decisionRule,
        items: [
          { name: i18n.rowOperations.insertAbove, type: TableOperation.RowInsertAbove },
          { name: i18n.rowOperations.insertBelow, type: TableOperation.RowInsertBelow },
          { name: i18n.rowOperations.delete, type: TableOperation.RowDelete },
          { name: i18n.rowOperations.duplicate, type: TableOperation.RowDuplicate },
        ],
      },
    ],
    [i18n]
  );

  const getHandlerConfiguration = useMemo(() => {
    const configuration: { [columnGroupType: string]: GroupOperations[] } = {};
    configuration[DecisionTableColumnType.InputClause] = generateColumnConfiguration(i18n.inputClause);
    configuration[DecisionTableColumnType.OutputClause] = generateColumnConfiguration(i18n.outputClause);
    configuration[DecisionTableColumnType.Annotation] = generateColumnConfiguration(i18n.ruleAnnotation);
    return configuration;
  }, [generateColumnConfiguration, i18n.inputClause, i18n.outputClause, i18n.ruleAnnotation]);

  const [selectedHitPolicy, setSelectedHitPolicy] = useState(hitPolicy);
  const [selectedAggregation, setSelectedAggregation] = useState(aggregation);

  const onHitPolicySelect = useCallback((itemId: string) => setSelectedHitPolicy(itemId as HitPolicy), []);

  const onBuiltInAggregatorSelect = useCallback(
    (itemId) => setSelectedAggregation((BuiltinAggregation as never)[itemId]),
    []
  );

  const evaluateColumns = () => {
    const inputColumns = _.map(
      input,
      (inputClause) =>
        ({
          label: inputClause.name,
          accessor: inputClause.name,
          dataType: inputClause.dataType,
          groupType: DecisionTableColumnType.InputClause,
        } as ColumnInstance)
    );
    const outputColumns = _.map(
      output,
      (outputClause) =>
        ({
          label: outputClause.name,
          accessor: outputClause.name,
          dataType: outputClause.dataType,
          groupType: DecisionTableColumnType.OutputClause,
        } as ColumnInstance)
    );
    const annotationColumns = _.map(
      annotations,
      (annotation) =>
        ({
          label: annotation,
          accessor: annotation,
          groupType: DecisionTableColumnType.Annotation,
        } as ColumnInstance)
    );

    return [...inputColumns, ...outputColumns, ...annotationColumns];
  };

  const columns = useRef<ColumnInstance[]>(evaluateColumns());

  return (
    <div className={`decision-table-expression ${uid}`}>
      <Table
        handlerConfiguration={getHandlerConfiguration}
        columns={columns.current}
        rows={[{}]}
        controllerCell={useMemo(
          () => (
            <HitPolicySelector
              selectedHitPolicy={selectedHitPolicy}
              selectedBuiltInAggregator={selectedAggregation}
              onHitPolicySelect={onHitPolicySelect}
              onBuiltInAggregatorSelect={onBuiltInAggregatorSelect}
            />
          ),
          [onBuiltInAggregatorSelect, onHitPolicySelect, selectedAggregation, selectedHitPolicy]
        )}
      />
    </div>
  );
};
