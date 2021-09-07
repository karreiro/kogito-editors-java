/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.appformer.kogito.bridge.client.keyboardshortcuts;

import javax.enterprise.inject.Produces;
import javax.inject.Inject;

import elemental2.dom.DomGlobal;
import org.appformer.kogito.bridge.client.interop.WindowRef;
import org.jboss.errai.ioc.client.api.ManagedInstance;

/**
 * Produces {@link KeyboardShortcutsService} beans according to whether the envelope API is available or not
 */
public class KeyboardShortcutsServiceProducer {

    @Inject
    @KogitoKeyboardShortcutsApi
    private ManagedInstance<KeyboardShortcutsApi> customKeyboardShortcutsInstances;

    @Produces
    public KeyboardShortcutsApi produce() {

        if (WindowRef.isEnvelopeAvailable()) {
            return new KeyboardShortcutsService();
        }

        DomGlobal.console.debug("[KeyboardShortcutsServiceProducer] Envelope API is not available.");

        if (this.customKeyboardShortcutsInstances.isUnsatisfied()) {
            return new NoOpKeyboardShortcutsService();
        }

        return this.customKeyboardShortcutsInstances.get();
    }
}
