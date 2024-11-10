import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
  ScmAuth,
} from '@backstage/integration-react';
import {
  AnyApiFactory,
  configApiRef,
  createApiFactory,
} from '@backstage/core-plugin-api';

import { ApiEntity } from '@backstage/catalog-model';
import {
  apiDocsConfigRef,
  ApiDefinitionWidget,
  defaultDefinitionWidgets,
} from '@backstage/plugin-api-docs';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
  createApiFactory({
    api: apiDocsConfigRef,
    deps: {},
    factory: () => {
      // load the default widgets
      const definitionWidgets = defaultDefinitionWidgets();
      return {
        getApiDefinitionWidget: (apiEntity: ApiEntity) => {
          // custom rendering for nats-subject
          if (apiEntity.spec.type === 'nats-subject') {
            let widget = definitionWidgets.find(d => d.type === 'openapi');
            return {
              type: 'nats-subject',
              title: 'NATS subject',
              component: widget?.component,
            } as ApiDefinitionWidget;
          }
          // fallback to the defaults
          return definitionWidgets.find(d => d.type === apiEntity.spec.type);
        },
      };
    },
  }),
];
