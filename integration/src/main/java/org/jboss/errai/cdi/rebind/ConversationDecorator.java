/*
 * Copyright 2009 JBoss, a divison Red Hat, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.jboss.errai.cdi.rebind;

import com.google.gwt.core.ext.typeinfo.JField;
import org.jboss.errai.cdi.client.api.ConversationContext;
import org.jboss.errai.ioc.client.api.CodeDecorator;
import org.jboss.errai.ioc.rebind.ioc.Decorator;
import org.jboss.errai.ioc.rebind.ioc.InjectionContext;
import org.jboss.errai.ioc.rebind.ioc.InjectionPoint;

/**
 * @author: Heiko Braun <hbraun@redhat.com>
 * @date: Oct 29, 2010
 */
@CodeDecorator
public class ConversationDecorator extends Decorator<ConversationContext> {
    public ConversationDecorator(Class<ConversationContext> decoratesWith) {
        super(decoratesWith);
    }

    public String generateDecorator(InjectionPoint<ConversationContext> injectionPoint) {
        final InjectionContext ctx = injectionPoint.getInjectionContext();

        final JField field = injectionPoint.getField();
        final ConversationContext context = field.getAnnotation(ConversationContext.class);

        String varName = injectionPoint.getInjector().getVarName();

        String expression = varName + "." +field.getName() +
                " = org.jboss.errai.cdi.client.api.CDI.createConversation(\""+context.value()+"\");";
                
        return expression;
    }
}