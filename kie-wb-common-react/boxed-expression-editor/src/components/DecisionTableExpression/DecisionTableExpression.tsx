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
import { BuiltinAggregation, DataType, DecisionTableProps, HitPolicy } from "../../api";
import * as React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Table } from "../Table";
import { ColumnInstance } from "react-table";
import { HitPolicySelector } from "./HitPolicySelector";
import * as _ from "lodash";

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
