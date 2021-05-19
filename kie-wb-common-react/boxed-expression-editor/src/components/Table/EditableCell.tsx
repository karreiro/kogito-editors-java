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

import "./EditableCell.css";
import * as React from "react";
import { ChangeEvent, useCallback, useState, useEffect, useRef } from "react";
import { CellProps } from "../../api";

const READ_MODE = "editable-cell--read-mode";
const EDIT_MODE = "editable-cell--edit-mode";

export interface EditableCellProps extends CellProps {
  /** Cell's value */
  value: string;
  /** Function executed each time a cell gets updated */
  onCellUpdate: (rowIndex: number, columnId: string, value: string) => void;
}

export const EditableCell: React.FunctionComponent<EditableCellProps> = ({
  value: initialValue,
  row: { index },
  column: { id },
  onCellUpdate,
}: EditableCellProps) => {
  const [value, setValue] = useState(initialValue);
  const [isSelected, setIsSelected] = useState(false);
  const [mode, setMode] = useState(READ_MODE);
  const textarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = useCallback((e) => {
    setMode(EDIT_MODE);
    setValue(e.target.value);
  }, []);

  const onBlur = useCallback(() => {
    setMode(READ_MODE);
    setIsSelected(false);

    onCellUpdate(index, id, value);
  }, [id, index, value, onCellUpdate]);

  const onSelect = useCallback(() => {
    setIsSelected(true);

    textarea.current?.focus();
    textarea.current?.setSelectionRange(value.length, value.length);
  }, [value]);

  const cssClass = useCallback(() => {
    const selectedClass = isSelected ? "editable-cell--selected" : "";
    return `editable-cell ${selectedClass} ${mode}`;
  }, [isSelected, mode]);

  return (
    <>
      <div onClick={onSelect} className={cssClass()}>
        <span>{value}</span>
        <textarea ref={textarea} value={value || ""} onChange={onChange} onBlur={onBlur} />
      </div>
    </>
  );
};
