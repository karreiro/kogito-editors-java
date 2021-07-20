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
import "monaco-editor/dev/vs/editor/editor.main.css";
import { MONACO_FEEL_LANGUAGE, MONACO_FEEL_THEME, defaultSuggestions, tokensConfig } from ".";

export type SuggestionProvider = (
  feelExpression: string,
  row: number,
  col: number
) => Monaco.languages.CompletionItem[];

export const initializeFeelLanguage = () => {
  Monaco.languages.register({ id: MONACO_FEEL_LANGUAGE });
};

export const initializeMonacoTheme = () => {
  Monaco.editor.defineTheme(MONACO_FEEL_THEME, {
    base: "vs",
    inherit: true,
    rules: [
      { token: "feel-keyword", foreground: "26268C", fontStyle: "bold" },
      { token: "feel-numeric", foreground: "3232E7" },
      { token: "feel-boolean", foreground: "26268D", fontStyle: "bold" },
      { token: "feel-string", foreground: "2A9343" },
      { token: "feel-function", foreground: "3232E8" },
    ],
    colors: {
      "editorLineNumber.foreground": "#000000",
    },
  });
};

export const initializeFeelTokensProvider = () => {
  Monaco.languages.setMonarchTokensProvider(MONACO_FEEL_LANGUAGE, tokensConfig());
};

export const initializeFeelCompletionItemProvider = (suggestionProvider?: SuggestionProvider) => {
  Monaco.languages.registerCompletionItemProvider(MONACO_FEEL_LANGUAGE, {
    provideCompletionItems: function (model, position) {
      let completionItems = defaultSuggestions();

      if (suggestionProvider) {
        const items = suggestionProvider(model.getValue(), position.lineNumber, position.column - 1);
        if (items.length > 0) {
          completionItems = items;
        }
      }

      return {
        suggestions: completionItems,
      };
    },
  });
};
