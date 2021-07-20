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

import { FeelInput } from "feel-input-component";
import * as Monaco from "monaco-editor";
import * as React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { CellProps } from "../../api";
import "./EditableCell.css";

export const READ_MODE = "editable-cell--read-mode";
export const EDIT_MODE = "editable-cell--edit-mode";

const MONACO_OPTIONS: Monaco.editor.IStandaloneEditorConstructionOptions = {
  fixedOverflowWidgets: true,
  lineNumbers: "off",
  fontSize: 13,
  renderLineHighlight: "none",
  lineDecorationsWidth: 1,
};

const focusTextArea = (textarea?: HTMLTextAreaElement | null) => {
  const value = textarea?.value || "";
  textarea?.focus();
  textarea?.setSelectionRange(value.length, value.length);
};

const blurActiveElement = () => {
  const activeElement = document.activeElement ? (document.activeElement as HTMLElement) : null;
  activeElement?.blur();
};

const focusNextTextArea = (currentTextArea: HTMLTextAreaElement | null) => {
  if (!currentTextArea) {
    return;
  }

  const textAreas = document.querySelectorAll("textarea");
  const indexOfCurrent: number = [].slice.call(textAreas).indexOf(currentTextArea);
  const indexOfNext = indexOfCurrent < textAreas.length - 1 ? indexOfCurrent + 1 : 0;

  textAreas.item(indexOfNext).focus();
};

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
  const [preview, setPreview] = useState("");
  const [previousValue, setPreviousValue] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [mode, setMode] = useState(READ_MODE);
  const textarea = useRef<HTMLTextAreaElement>(null);

  // Common Handlers ===========================================================

  const isEditMode = useCallback(() => mode === EDIT_MODE, [mode]);

  const triggerReadMode = useCallback(
    (newValue?: string) => {
      if (!isEditMode()) {
        return;
      }
      setMode(READ_MODE);
      onCellUpdate(index, id, newValue || value);
      focusTextArea(textarea.current);
    },
    [isEditMode, setMode, setIsSelected, onCellUpdate, index, value]
  );

  const triggerEditMode = useCallback(() => {
    setPreviousValue(value);
    blurActiveElement();
    setMode(EDIT_MODE);
  }, [setPreviousValue, value, setMode]);

  const cssClass = useCallback(() => {
    const selectedClass = isSelected ? "editable-cell--selected" : "";
    return `editable-cell ${selectedClass} ${mode}`;
  }, [isEditMode, isSelected, mode]);

  const focus = useCallback(() => {
    if (isEditMode()) {
      return;
    }

    setIsSelected(true);

    focusTextArea(textarea.current);
  }, [isEditMode, setIsSelected, textarea]);

  const onClick = useCallback(() => {
    if (document.activeElement !== textarea.current) {
      focus();
    }
  }, [focus]);

  const onDoubleClick = useCallback(triggerEditMode, [triggerEditMode]);

  // TextArea Handlers =========================================================

  const onTextAreaFocus = useCallback(focus, [focus]);

  const onTextAreaBlur = useCallback(() => setIsSelected(false), [setIsSelected]);

  const onTextAreaChange = useCallback(
    (event) => {
      setValue(event.target.value);
      triggerEditMode();
    },
    [setValue, triggerEditMode]
  );

  // Feel Handlers =============================================================

  const onFeelBlur = useCallback(
    (newValue: string) => {
      setValue(newValue);
      triggerReadMode(newValue);
    },
    [triggerReadMode]
  );

  const onFeelKeyDown = useCallback(
    (event: Monaco.IKeyboardEvent, newValue: string) => {
      const key = event.code.toLowerCase();
      const isModKey = event.altKey || event.ctrlKey || event.shiftKey;
      const isEnter = isModKey && key === "enter";
      const isTab = key === "tab";
      const isEsc = !!key.match("esc");

      if (isEnter || isTab || isEsc) {
        event.preventDefault();
      }

      if (isEnter || isTab) {
        setValue(newValue);
        triggerReadMode(newValue);
      }

      if (isEsc) {
        setValue(previousValue);
        triggerReadMode(previousValue);
      }

      if (isTab) {
        focusNextTextArea(textarea.current);
      }
    },
    [triggerReadMode, setValue, previousValue]
  );

  const onFeelChange = useCallback(
    (e, v, p) => {
      setPreview(p);
    },
    [setPreview]
  );

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log(Monaco.languages.getLanguages().length);
  //     Monaco.editor.colorize(value, "feel-language", {}).then((result: string) => {
  //       setPreview(result);
  //       console.log(result);
  //     });
  //   }, 1);
  // }, [value]);

  // Sub Components ============================================================

  const readOnlyElement = useMemo(() => {
    return <span className="editable-cell-value" dangerouslySetInnerHTML={{ __html: preview }}></span>;
  }, [preview]);

  const eventHandlerElement = useMemo(() => {
    return (
      <textarea
        className="editable-cell-textarea"
        ref={textarea}
        value={value}
        onChange={onTextAreaChange}
        onFocus={onTextAreaFocus}
        onBlur={onTextAreaBlur}
      />
    );
  }, [textarea, onTextAreaFocus, onTextAreaBlur]);

  const feelInputElement = useMemo(() => {
    return (
      <FeelInput
        enabled={isEditMode()}
        value={value}
        onKeyDown={onFeelKeyDown}
        onChange={onFeelChange}
        options={MONACO_OPTIONS}
        onBlur={onFeelBlur}
      />
    );
  }, [isEditMode, value, onFeelKeyDown, onFeelBlur]);

  return (
    <>
      <div onDoubleClick={onDoubleClick} onClick={onClick} className={cssClass()}>
        {readOnlyElement}
        {eventHandlerElement}
        {feelInputElement}
      </div>
    </>
  );
};
