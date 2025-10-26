import {AMISPageSchema} from './renderers/Page';
export type {AMISSchema, AMISSchemaType} from 'amis-core';

declare module 'amis-core' {
  interface AMISSchemaRegistry {
    page: AMISPageSchema;
  }
}

export type RootRenderer = AMISPageSchema;
