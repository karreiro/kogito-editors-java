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
import { useCallback, useMemo, useRef } from "react";
import { SelectionBox, SelectionReact } from ".";
import { CELL_CSS_SELECTOR } from "../Resizer/dom/DOMSession";
import "./CellSelectionBox.css";

const SELECTED_CELL = "cell--selected";

const EDITABLE_CELL = "editable-cell";

export const CellSelectionBox: React.FunctionComponent = () => {
  const textarea = useRef<HTMLTextAreaElement>(null);

  const allEditableCells = useCallback((): Element[] => {
    const hasEditableCell = (cell: Element) => !!cell.querySelector(`.${EDITABLE_CELL}`);
    const allCells = document.querySelectorAll(CELL_CSS_SELECTOR);

    return [].slice.call(allCells).filter(hasEditableCell);
  }, []);

  const findCell = useCallback((x: number, y: number): Element | null => {
    const refElement = document.elementFromPoint(x, y);
    const closest = refElement?.closest(CELL_CSS_SELECTOR);

    if (closest) {
      return closest;
    }

    return refElement?.closest("td")?.querySelector(CELL_CSS_SELECTOR) || null;
  }, []);

  const findFirstCell = useCallback((rect): Element | null => {
    const x = rect.x;
    const y = rect.y;
    return findCell(x, y);
  }, []);

  const findLastCell = useCallback((rect): Element | null => {
    const x = rect.x + rect.width;
    const y = rect.y + rect.height;
    return findCell(x, y);
  }, []);

  const lowlightCells = useCallback(() => {
    document.querySelectorAll(`.${SELECTED_CELL}`).forEach((c) => c.classList.remove(SELECTED_CELL));
  }, []);

  const highlightCells = useCallback(
    (cells: Element[]) => {
      lowlightCells();
      cells.forEach((c) => c.classList.add(SELECTED_CELL));
    },
    [lowlightCells]
  );

  const enableSelection = useCallback(
    (rect: SelectionReact | null) => {
      if (!rect) {
        return;
      }

      const firstCell = findFirstCell(rect)?.getBoundingClientRect();
      const lastCell = findLastCell(rect)?.getBoundingClientRect();

      const xStart = firstCell?.x || rect.x;
      const xEnd = lastCell?.x || rect.x + rect.width;

      const yStart = firstCell?.y || rect.y;
      const yEnd = lastCell?.y || rect.y + rect.height;

      const selectedCells = allEditableCells().filter((cell: HTMLElement) => {
        const cellRect = cell.getBoundingClientRect();
        return cellRect.x >= xStart && cellRect.x <= xEnd && cellRect.y >= yStart && cellRect.y <= yEnd;
      });

      if (textarea.current) {
        highlightCells(selectedCells);
        textarea.current.focus();
      }
    },
    [findFirstCell, highlightCells, findLastCell, allEditableCells, textarea]
  );

  const disableSelection = useCallback(() => lowlightCells(), [lowlightCells]);

  return useMemo(
    () => (
      <div className="kie-cell-selection-box">
        <SelectionBox onDragStop={enableSelection} />
        <textarea ref={textarea} onBlur={disableSelection}></textarea>
      </div>
    ),
    [enableSelection, disableSelection]
  );
};
