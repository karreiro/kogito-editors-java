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
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import "./SelectionBox.css";

export interface SelectionBoxProps {
  onDragStart?: (startPosition: SelectionStart) => void;
  onDragStop?: (endRect: SelectionReact) => void;
}

interface SelectionStart {
  x: number;
  y: number;
}

export interface SelectionReact extends SelectionStart {
  width: number;
  height: number;
}

type SelectionStartState = SelectionStart | null;
type SelectionReactState = SelectionReact | null;
type SelectionStyleState = React.CSSProperties | null;

export const SelectionBox: React.FunctionComponent<SelectionBoxProps> = ({
  onDragStart,
  onDragStop,
}: SelectionBoxProps) => {
  const [selectionBoxStyle, setSelectionBoxStyle] = useState<SelectionStyleState>(null);
  const [selectionStart, setSelectionStart] = useState<SelectionStartState>(null);
  const [selectionRect, setSelectionRect] = useState<SelectionReactState>(null);

  useEffect(() => {
    const pxValue = (value: number) => `${value}px`;
    let style = {};
    if (selectionRect) {
      style = {
        width: pxValue(selectionRect.width),
        height: pxValue(selectionRect.height),
        top: pxValue(selectionRect.y),
        left: pxValue(selectionRect.x),
      };
    }
    setSelectionBoxStyle(style);
  }, [selectionRect]);

  const moveHandler = useCallback(
    (event: MouseEvent) => {
      if (!selectionStart) {
        return;
      }

      const x = Math.min(selectionStart.x, event.clientX);
      const y = Math.min(selectionStart.y, event.clientY);
      const width = Math.abs(event.clientX - selectionStart.x);
      const height = Math.abs(event.clientY - selectionStart.y);

      setSelectionRect({ x, y, width, height });
    },
    [selectionStart, setSelectionRect]
  );

  const downHandler = useCallback(
    (event: MouseEvent) => {
      const startPosition = { x: event.clientX, y: event.clientY };
      setSelectionStart(startPosition);
      onDragStart?.(startPosition);
    },
    [setSelectionStart]
  );

  const upHandler = useCallback(() => {
    onDragStop?.(selectionRect!);
    setSelectionStart(null);
    setSelectionRect(null);
  }, [selectionRect, setSelectionStart, setSelectionRect]);

  useLayoutEffect(() => {
    const mouseMoveType = "mousemove";
    const mouseDownType = "mousedown";
    const mouseUpType = "mouseup";

    document.addEventListener(mouseMoveType, moveHandler);
    document.addEventListener(mouseDownType, downHandler);
    document.addEventListener(mouseUpType, upHandler);
    return () => {
      document.removeEventListener(mouseMoveType, moveHandler);
      document.removeEventListener(mouseDownType, downHandler);
      document.removeEventListener(mouseUpType, upHandler);
    };
  }, [moveHandler, downHandler, upHandler]);

  return useMemo(() => {
    return <div style={{ ...selectionBoxStyle }} className="kie-selection-box"></div>;
  }, [selectionBoxStyle]);
};
