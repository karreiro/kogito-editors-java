/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
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
import { ChangeEvent, useCallback, useState } from "react";

export interface EditTextInlineProps {
  /** Text value */
  value: string;
  /** Callback executed when text changes */
  onTextChange: (updatedValue: string) => void;
}

export const EditTextInline: React.FunctionComponent<EditTextInlineProps> = ({ onTextChange, value }) => {
  const [toggle, setToggle] = useState(true);

  const onValueBlur = useCallback((event: ChangeEvent<HTMLInputElement>) => onTextChange(event.target.value), [
    onTextChange,
  ]);

  return toggle ? (
    <p
      onDoubleClick={() => {
        setToggle(false);
      }}
    >
      {value}
    </p>
  ) : (
    <input
      type="text"
      defaultValue={value}
      onBlur={onValueBlur}
      autoFocus
      style={{ borderRadius: "0.5em" }}
      onKeyDown={(event) => {
        const pressedEnter = event.key === "Enter";
        const pressedEscape = event.key === "Escape";
        if (pressedEnter) {
          event.currentTarget.blur();
        }
        if (pressedEnter || pressedEscape) {
          setToggle(true);
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    />
  );
};
