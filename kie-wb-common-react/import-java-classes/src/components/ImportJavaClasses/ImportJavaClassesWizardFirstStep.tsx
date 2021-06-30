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
import { Title, SearchInput } from "@patternfly/react-core";
import CubesIcon from "@patternfly/react-icons/dist/js/icons/cubes-icon";
import { useImportJavaClassesWizardI18n } from "../../i18n";
import { useCallback, useState } from "react";
import { EmptyStateWidget } from "../EmptyStateWidget";
import { ImportJavaClassesWizardClassListTable } from "./ImportJavaClassesWizardClassListTable";

export const ImportJavaClassesWizardFirstStep: React.FunctionComponent = () => {
  const EMPTY_SEARCH_VALUE = "";
  const { i18n } = useImportJavaClassesWizardI18n();
  const [searchValue, setSearchValue] = useState(EMPTY_SEARCH_VALUE);
  const [retrievedJavaClassesLSP, setRetrievedJavaClassesLSP] = useState<string[]>([]);
  const onSearchValueChange = useCallback((value: string) => lspGetClassServiceMocked(value), []);
  /* This function temporary mocks a call to the LSP service method getClasses */
  const lspGetClassServiceMocked = (value: string) => {
    /* Mocked data retrieved from LSP Service */
    const booClassesList = ["org.kie.test.kogito.Book", "org.kie.test.kogito.Boom"];
    const bookClassesList = ["org.kie.test.kogito.Book"];
    const boomClassesList = ["org.kie.test.kogito.Boom"];

    setSearchValue(value);
    setRetrievedJavaClassesLSP([]);
    /* Temporary mocks managing */
    if (value === "Boo") {
      setRetrievedJavaClassesLSP(booClassesList);
    } else if (value === "Book") {
      setRetrievedJavaClassesLSP(bookClassesList);
    } else if (value === "Boom") {
      setRetrievedJavaClassesLSP(boomClassesList);
    }
  };

  const EmptyStep: React.FunctionComponent = () => {
    return (
      <EmptyStateWidget
        emptyStateIcon={CubesIcon}
        emptyStateTitleHeading={"h6"}
        emptyStateTitleSize={"md"}
        emptyStateTitleText={i18n.modalWizard.firstStep.emptyState.title}
        emptyStateBodyText={i18n.modalWizard.firstStep.emptyState.body}
      />
    );
  };

  return (
    <>
      <Title headingLevel="h6" size="md">
        {i18n.modalWizard.firstStep.input.title}
      </Title>
      <SearchInput
        placeholder={i18n.modalWizard.firstStep.input.placeholder}
        value={searchValue}
        onChange={onSearchValueChange}
        onClear={() => onSearchValueChange(EMPTY_SEARCH_VALUE)}
        autoFocus
      />
      {retrievedJavaClassesLSP.length > 0 ? (
        <ImportJavaClassesWizardClassListTable selectedData={[]} data={retrievedJavaClassesLSP} />
      ) : (
        <EmptyStep />
      )}
    </>
  );
};
