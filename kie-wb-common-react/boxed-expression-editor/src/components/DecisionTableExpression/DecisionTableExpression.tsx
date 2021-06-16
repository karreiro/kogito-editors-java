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
  Annotation,
  BuiltinAggregation,
  Clause,
  DataType,
  DecisionTableProps,
  DecisionTableRule,
  GroupOperations,
  HitPolicy,
  LogicType,
  TableOperation,
} from "../../api";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Table } from "../Table";
import { ColumnInstance, DataRecord } from "react-table";
import { HitPolicySelector } from "./HitPolicySelector";
import * as _ from "lodash";
import { useBoxedExpressionEditorI18n } from "../../i18n";

enum DecisionTableColumnType {
  InputClause = "input",
  OutputClause = "output",
  Annotation = "annotation",
}

const DASH_SYMBOL = "-";
const EMPTY_SYMBOL = "";
export const DecisionTableExpression: React.FunctionComponent<DecisionTableProps> = ({
  uid,
  isHeadless,
  onUpdatingRecursiveExpression,
  hitPolicy = HitPolicy.Unique,
  aggregation = BuiltinAggregation["<None>"],
  input = [{ name: "input-1", dataType: DataType.Undefined }],
  output = [{ name: "output-1", dataType: DataType.Undefined }],
  annotations = [{ name: "annotation-1" }],
  rules = [{ inputEntries: [DASH_SYMBOL], outputEntries: [EMPTY_SYMBOL], annotationEntries: [EMPTY_SYMBOL] }],
}) => {
  const { i18n } = useBoxedExpressionEditorI18n();

  const getColumnPrefix = useCallback((groupType: string) => {
    switch (groupType) {
      case DecisionTableColumnType.InputClause:
        return "input-";
      case DecisionTableColumnType.OutputClause:
        return "output-";
      case DecisionTableColumnType.Annotation:
        return "annotation-";
      default:
        return "column-";
    }
  }, []);

  const generateHandlerConfigurationByColumn = useCallback(
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
    configuration[EMPTY_SYMBOL] = generateHandlerConfigurationByColumn(i18n.ruleAnnotation);
    configuration[DecisionTableColumnType.InputClause] = generateHandlerConfigurationByColumn(i18n.inputClause);
    configuration[DecisionTableColumnType.OutputClause] = generateHandlerConfigurationByColumn(i18n.outputClause);
    configuration[DecisionTableColumnType.Annotation] = generateHandlerConfigurationByColumn(i18n.ruleAnnotation);
    return configuration;
  }, [generateHandlerConfigurationByColumn, i18n.inputClause, i18n.outputClause, i18n.ruleAnnotation]);

  const getEditColumnLabel = useMemo(() => {
    const editColumnLabel: { [columnGroupType: string]: string } = {};
    editColumnLabel[DecisionTableColumnType.InputClause] = i18n.editClause.input;
    editColumnLabel[DecisionTableColumnType.OutputClause] = i18n.editClause.output;
    return editColumnLabel;
  }, [i18n.editClause.input, i18n.editClause.output]);

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
          width: inputClause.width,
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
          width: outputClause.width,
          groupType: DecisionTableColumnType.OutputClause,
        } as ColumnInstance)
    );
    const annotationColumns = _.map(
      annotations,
      (annotation) =>
        ({
          label: annotation.name,
          accessor: annotation.name,
          width: annotation.width,
          groupType: DecisionTableColumnType.Annotation,
        } as ColumnInstance)
    );

    return [...inputColumns, ...outputColumns, ...annotationColumns];
  };

  const evaluateRows = () =>
    _.map(rules, (rule) => {
      const rowArray = [...rule.inputEntries, ...rule.outputEntries, ...rule.annotationEntries];
      return _.reduce(
        columns.current,
        (tableRow: DataRecord, column, columnIndex) => {
          tableRow[column.accessor] = rowArray[columnIndex] || EMPTY_SYMBOL;
          return tableRow;
        },
        {}
      );
    });

  const columns = useRef<ColumnInstance[]>(evaluateColumns());
  const rows = useRef<DataRecord[]>(evaluateRows());

  const spreadDecisionTableExpressionDefinition = useCallback(() => {
    const groupedColumns = _.groupBy(columns.current, (column) => column.groupType);
    const input: Clause[] = _.map(groupedColumns[DecisionTableColumnType.InputClause], (inputClause) => ({
      name: inputClause.accessor,
      dataType: inputClause.dataType,
      width: inputClause.width,
    }));
    const output: Clause[] = _.map(groupedColumns[DecisionTableColumnType.OutputClause], (outputClause) => ({
      name: outputClause.accessor,
      dataType: outputClause.dataType,
      width: outputClause.width,
    }));
    const annotations: Annotation[] = _.map(groupedColumns[DecisionTableColumnType.Annotation], (annotation) => ({
      name: annotation.accessor,
      width: annotation.width,
    }));
    const rules: DecisionTableRule[] = _.map(rows.current, (row: DataRecord) => ({
      inputEntries: _.map(input, (inputClause) => row[inputClause.name] as string),
      outputEntries: _.map(output, (outputClause) => row[outputClause.name] as string),
      annotationEntries: _.map(annotations, (annotation) => row[annotation.name] as string),
    }));

    const expressionDefinition: DecisionTableProps = {
      logicType: LogicType.DecisionTable,
      uid,
      hitPolicy: selectedHitPolicy,
      aggregation: selectedAggregation,
      input,
      output,
      annotations,
      rules,
    };

    isHeadless
      ? onUpdatingRecursiveExpression?.(expressionDefinition)
      : window.beeApi?.broadcastDecisionTableExpressionDefinition?.(expressionDefinition);
  }, [isHeadless, onUpdatingRecursiveExpression, selectedAggregation, selectedHitPolicy, uid]);

  const onColumnsUpdate = useCallback(
    (updatedColumns) => {
      columns.current = [...updatedColumns];
      spreadDecisionTableExpressionDefinition();
    },
    [spreadDecisionTableExpressionDefinition]
  );

  const fillMissingCellValues = useCallback(
    (updatedRows: DataRecord[]) =>
      _.map(updatedRows, (row) =>
        _.reduce(
          columns.current,
          (filledRow: DataRecord, column: ColumnInstance) => {
            if (_.isNil(row[column.accessor])) {
              filledRow[column.accessor] =
                column.groupType === DecisionTableColumnType.InputClause ? DASH_SYMBOL : EMPTY_SYMBOL;
            } else {
              filledRow[column.accessor] = row[column.accessor];
            }
            return filledRow;
          },
          {}
        )
      ),
    []
  );

  const onRowsUpdate = useCallback(
    (updatedRows) => {
      rows.current = fillMissingCellValues(updatedRows);
      spreadDecisionTableExpressionDefinition();
    },
    [fillMissingCellValues, spreadDecisionTableExpressionDefinition]
  );

  const onRowAdding = useCallback(() => {
    return _.reduce(
      columns.current,
      (tableRow: DataRecord, column: ColumnInstance) => {
        tableRow[column.accessor] =
          column.groupType === DecisionTableColumnType.InputClause ? DASH_SYMBOL : EMPTY_SYMBOL;
        return tableRow;
      },
      {} as DataRecord
    );
  }, []);

  useEffect(() => {
    /** Function executed only the first time the component is loaded */
    spreadDecisionTableExpressionDefinition();
  }, [spreadDecisionTableExpressionDefinition]);

  return (
    <div className={`decision-table-expression ${uid}`}>
      <Table
        getColumnPrefix={getColumnPrefix}
        editColumnLabel={getEditColumnLabel}
        handlerConfiguration={getHandlerConfiguration}
        columns={columns.current}
        rows={rows.current}
        onColumnsUpdate={onColumnsUpdate}
        onRowsUpdate={onRowsUpdate}
        onRowAdding={onRowAdding}
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
