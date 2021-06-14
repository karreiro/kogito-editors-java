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

import { BuiltinAggregation, HitPolicy } from "../../api";
import * as React from "react";
import { useCallback, useContext } from "react";
import { PopoverMenu } from "../PopoverMenu";
import { Menu, MenuItem, MenuList } from "@patternfly/react-core";
import * as _ from "lodash";
import { useBoxedExpressionEditorI18n } from "../../i18n";
import { BoxedExpressionGlobalContext } from "../../context";

export interface HitPolicySelectorProps {
  /** Pre-selected hit policy */
  selectedHitPolicy: HitPolicy;
  /** Pre-selected built-in aggregator */
  selectedBuiltInAggregator: BuiltinAggregation;
  /** Callback invoked when hit policy selection changes */
  onHitPolicySelect: (hitPolicy: HitPolicy) => void;
  /** Callback invoked when built-in aggregator selection changes */
  onBuiltInAggregatorSelect: (builtInAggregator: BuiltinAggregation) => void;
}

export const HitPolicySelector: React.FunctionComponent<HitPolicySelectorProps> = ({
  onBuiltInAggregatorSelect,
  onHitPolicySelect,
  selectedBuiltInAggregator,
  selectedHitPolicy,
}) => {
  const { i18n } = useBoxedExpressionEditorI18n();

  const globalContext = useContext(BoxedExpressionGlobalContext);

  const hitPolicySelectionCallback = useCallback(
    (hide: () => void) => (event: MouseEvent, itemId: string) => {
      onHitPolicySelect(itemId as HitPolicy);
      hide();
    },
    [onHitPolicySelect]
  );

  const renderHitPolicyItems = useCallback(
    () =>
      _.map(Object.values(HitPolicy), (key) => (
        <MenuItem key={key} itemId={key} data-ouia-component-id={key}>
          {key}
        </MenuItem>
      )),
    []
  );

  const builtInAggregatorSelectionCallback = useCallback(
    (hide: () => void) => (event: MouseEvent, itemId: string) => {
      onBuiltInAggregatorSelect(itemId as BuiltinAggregation);
      hide();
    },
    [onBuiltInAggregatorSelect]
  );

  const renderBuiltInAggregationItems = useCallback(
    () =>
      _.map(Object.keys(BuiltinAggregation), (key) => (
        <MenuItem key={key} itemId={key} data-ouia-component-id={key}>
          {key}
        </MenuItem>
      )),
    []
  );

  return (
    <PopoverMenu
      title={i18n.editHitPolicy}
      appendTo={globalContext.boxedExpressionEditorRef?.current ?? undefined}
      className="hit-policy-popover"
      hasAutoWidth
      body={(hide: () => void) => (
        <React.Fragment>
          <Menu onSelect={hitPolicySelectionCallback(hide)}>
            <MenuList>{renderHitPolicyItems()}</MenuList>
          </Menu>
          <Menu onSelect={builtInAggregatorSelectionCallback(hide)}>
            <MenuList>{renderBuiltInAggregationItems()}</MenuList>
          </Menu>
        </React.Fragment>
      )}
    >
      <div className="selected-function-kind">{`${_.first(selectedHitPolicy)}${selectedBuiltInAggregator}`}</div>
    </PopoverMenu>
  );
};
