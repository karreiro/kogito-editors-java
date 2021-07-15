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

import * as Monaco from "monaco-editor";
import * as React from "react";
import { useEffect, useMemo, useRef } from "react";
import { FEELMonacoEditor, SuggestionProvider } from "../Monaco";

export interface FeelInputProps {
  suggestionProvider?: SuggestionProvider;
  onBlur?: () => void;
  onChange?: (event: Monaco.editor.IModelContentChangedEvent, content: string) => void;
  options?: Monaco.editor.IStandaloneEditorConstructionOptions;
}

export const FeelInput: React.FunctionComponent<FeelInputProps> = ({
  suggestionProvider,
  onBlur,
  onChange,
  options,
}: FeelInputProps) => {
  const textarea = useRef(null);

  useEffect(() => {
    const monacoElement = textarea.current!;

    FEELMonacoEditor.getEditorBuilder(suggestionProvider)
      .withDomElement(monacoElement)
      .withOnBlur(onBlur)
      .withOnChange(onChange)
      .withOptions(options)
      .createEditor();
  }, [suggestionProvider, onBlur, onChange, options]);

  return useMemo(
    () => (
      <div className="feel-input">
        <div ref={textarea}></div>
      </div>
    ),
    []
  );
};
