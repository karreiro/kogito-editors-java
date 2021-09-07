/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.kie.workbench.common.dmn.showcase.client.alternatives;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;

import elemental2.dom.DomGlobal;
import elemental2.dom.EventTarget;
import elemental2.dom.KeyboardEvent;
import org.appformer.client.keyboardShortcuts.KeyboardShortcutsApiOpts;
import org.appformer.kogito.bridge.client.keyboardshortcuts.KeyboardShortcutsApi;
import org.appformer.kogito.bridge.client.keyboardshortcuts.KogitoKeyboardShortcutsApi;

import static com.google.gwt.dom.client.BrowserEvents.KEYDOWN;

@ApplicationScoped
@KogitoKeyboardShortcutsApi
public class KogitoTestingKeyboardShortcutsApi implements KeyboardShortcutsApi {

    final Map<String, Action> actionsByCombination = new HashMap<>();

    @PostConstruct
    public void setup() {
        setupListener();
        setupExtraShortcuts();
    }

    private void setupExtraShortcuts() {
        actionsByCombination.put("ctrl+z", (e) -> {
            DomGlobal.console.log("UNDO HERE!");
        });

        actionsByCombination.put("ctrl+shift+z", (e) -> {
            DomGlobal.console.log("REDO HERE!");
        });
    }

    @Override
    public int registerKeyPress(final String combination,
                                final String label,
                                final Action onKeyDown,
                                final KeyboardShortcutsApiOpts opts) {
        actionsByCombination.put(combination, onKeyDown);
        return 0;
    }

    @Override
    public int registerKeyDownThenUp(final String combination,
                                     final String label,
                                     final Action onKeyDown,
                                     final Action onKeyUp,
                                     final KeyboardShortcutsApiOpts opts) {
        actionsByCombination.put(combination, onKeyDown);
        return 0;
    }

    @Override
    public void deregister(int id) {
    }

    private void setupListener() {
        DomGlobal.document.body.addEventListener(KEYDOWN, (event) -> {
            final KeyboardEvent keyboardEvent = (KeyboardEvent) event;

            modifierKey(keyboardEvent).ifPresent((modifier) -> {
                final String combination = String.join("", modifier, "+", keyboardEvent.key).toLowerCase();
                final Action action = actionsByCombination.get(combination);
                Optional.ofNullable(action)
                        .ifPresent(a -> a.execute((EventTarget) event));
            });
        });
    }

    private Optional<String> modifierKey(final KeyboardEvent keyboardEvent) {
        final List<String> modifier = new ArrayList<>();
        if (keyboardEvent.ctrlKey || keyboardEvent.metaKey) {
            modifier.add("ctrl");
        }
        if (keyboardEvent.altKey) {
            modifier.add("alt");
        }
        if (keyboardEvent.shiftKey) {
            modifier.add("shift");
        }
        return modifier.isEmpty() ? Optional.empty() : Optional.of(String.join("+", modifier));
    }
}
