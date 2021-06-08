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
import {fireEvent, render, screen} from "@testing-library/react";
import { ModalWizard } from "../../components/ModalWizard";
import { WizardStep } from "@patternfly/react-core";
import { ImportIcon } from "@patternfly/react-icons";

describe("ModalWizard component tests", () => {

    describe("ModalWizard Button component tests", () => {

        test("should render ModalWizard Button component", () => {
            const wizardSteps: WizardStep[] = [];

            const { container } = render(<ModalWizard buttonStyle={"primary"} buttonText={"bText"} wizardDescription={"wDescription"} wizardSteps={wizardSteps} wizardTitle={"wTitle"} />);

            expect(container).toMatchSnapshot();
        });

        test("should render ModalWizard Button component with Icon", () => {
            const wizardSteps: WizardStep[] = [];

            const { container } = render(<ModalWizard buttonStyle={"primary"} buttonText={"bText"} wizardDescription={"wDescription"} wizardSteps={wizardSteps} wizardTitle={"wTitle"} buttonIcon={<ImportIcon />} />)

            expect(container).toMatchSnapshot();
        });
    });

    describe("ModalWizard Wizard tests", () => {

        test("should render ModalWizard Button component and open the Wizard", async () => {
            const wizardSteps: WizardStep[] = [];

            const { findByText } = render(<ModalWizard buttonStyle={"primary"} buttonText={"bText"}
                                                     wizardDescription={"wDescription"} wizardSteps={wizardSteps}
                                                     wizardTitle={"wTitle"}/>);

            fireEvent.click(screen.getByText("bText"));
            //console.log(container.innerHTML)
            //fireEvent.click(container.querySelector("button")! as HTMLButtonElement);
            //(container.querySelector("button") as HTMLButtonElement)!.click();

        });
    });

});