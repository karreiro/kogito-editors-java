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
import { DataList, DataListCell, DataListCheck, DataListItem, DataListItemRow } from "@patternfly/react-core";

export interface ImportJavaClassesWizardFirstStepDataListProps {
  /** Text to apply to the Modal button */
  data: string[];
}

export const ImportJavaClassesWizardFirstStepDataList: React.FunctionComponent<ImportJavaClassesWizardFirstStepDataListProps> =
  ({ data }: ImportJavaClassesWizardFirstStepDataListProps) => {
    return (
      <DataList aria-label={"class-data-list"} isCompact>
        {data.map((value, index) => (
          <DataListItem key={index} aria-labelledby={"check-action-item" + index}>
            <DataListItemRow>
              <DataListCheck aria-labelledby={"check-action-item" + index} name={"check-action-check1" + index} />
              <DataListCell key="primary content">
                <span id={"check-action-item" + index}>{value}</span>
              </DataListCell>
            </DataListItemRow>
          </DataListItem>
        ))}
      </DataList>
    );
  };
