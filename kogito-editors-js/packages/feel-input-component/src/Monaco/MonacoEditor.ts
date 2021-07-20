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
import {
  initializeFeelCompletionItemProvider,
  initializeMonacoTheme,
  initializeFeelLanguage,
  initializeFeelTokensProvider,
  SuggestionProvider,
  MONACO_FEEL_LANGUAGE
} from ".";
import { createConfig } from "./MonacoConfigs";

declare global {
  interface Window {
    __KIE__MONACO__EDITOR__?: FEELMonacoEditor;
  }
}

export class FEELMonacoEditor {
  private standaloneEditor?: Monaco.editor.IStandaloneCodeEditor;

  private domElement?: HTMLElement;

  private onChange?: (event: Monaco.editor.IModelContentChangedEvent, value: string, preview: string) => void;

  private onKeyDown?: (event: Monaco.IKeyboardEvent, value: string) => void;

  private options?: Monaco.editor.IStandaloneEditorConstructionOptions;

  private onBlur?: (value: string) => void;

  static getEditorBuilder(suggestionProvider?: SuggestionProvider) {
    if (window.__KIE__MONACO__EDITOR__ === undefined) {
      initializeFeelLanguage();
      initializeMonacoTheme();
      initializeFeelTokensProvider();
      initializeFeelCompletionItemProvider(suggestionProvider);
      window.__KIE__MONACO__EDITOR__ = new FEELMonacoEditor();
    }
    return window.__KIE__MONACO__EDITOR__;
  }

  static getStandaloneEditor() {
    return this.getEditorBuilder().standaloneEditor;
  }

  static dispose() {
    this.getEditorBuilder().standaloneEditor?.dispose();
    this.getEditorBuilder().standaloneEditor = undefined;
  }

  static isInitialized() {
    return this.getEditorBuilder().standaloneEditor !== undefined;
  }

  mo() {
    return Monaco;
  }

  withDomElement(domElement: HTMLElement) {
    this.domElement = domElement;
    return this;
  }

  withOnChange(onChange?: (event: Monaco.editor.IModelContentChangedEvent, content: string, preview: string) => void) {
    this.onChange = onChange;
    return this;
  }

  withOnKeyDown(onKeyDown?: (event: Monaco.IKeyboardEvent, value: string) => void) {
    this.onKeyDown = onKeyDown;
    return this;
  }

  withOnBlur(onBlur?: (value: string) => void) {
    this.onBlur = onBlur;
    return this;
  }

  withOptions(options?: Monaco.editor.IStandaloneEditorConstructionOptions) {
    this.options = options;
    return this;
  }

  createEditor() {
    this.dispose();
    return this.createStandaloneEditor();
  }

  colorize(value: string) {
    return Monaco.editor.colorize(value, MONACO_FEEL_LANGUAGE, {});
  }

  private dispose() {
    this.standaloneEditor?.dispose();
  }

  private createStandaloneEditor() {

    const onChange = (event: Monaco.editor.IModelContentChangedEvent) => {
      const value = this.standaloneEditor?.getValue() || "";
      this.colorize(value).then((preview) => {
        console.log("---- ojceca8s");
        this.onChange!(event, value, preview);
      });
    };

    if (!this.domElement) {
      throw new Error("FEEL Monaco editor cannot be created without a 'domElement'.");
    }

    this.standaloneEditor = Monaco.editor.create(this.domElement!, createConfig(this.options));

    if (this.onChange) {
      this.standaloneEditor.onDidChangeModelContent(onChange);
      onChange({
        changes: [],
        eol: "",
        versionId: 0,
        isUndoing: false,
        isRedoing: false,
        isFlush: false
      });
    }

    if (this.onBlur) {
      this.standaloneEditor.onDidBlurEditorText(() => {
        this.onBlur!(this.standaloneEditor?.getValue() || "");
      });
    }

    if (this.onKeyDown) {
      this.standaloneEditor.onKeyDown((e) => this.onKeyDown!(e, this.standaloneEditor?.getValue() || ""));
    }

    this.standaloneEditor.focus();

    return this.standaloneEditor!;
  }
}
