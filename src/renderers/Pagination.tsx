import React from 'react';
import {Renderer, RendererProps} from '../factory';
import {BaseSchema} from '../Schema';
import {
  BasicPaginationProps,
  PaginationState as BasicPaginationState,
  Pagination as BasicPagination
} from '../components/Pagination';

export interface PaginationSchema extends BasicPaginationProps, BaseSchema {
  type: 'pagination';
}

export interface PaginationProps
  extends RendererProps,
    Omit<PaginationSchema, 'type' | 'className'> {
}

export interface PaginationState extends BasicPaginationState{}

export default class Pagination extends React.Component<
  PaginationProps,
  PaginationState
> {

  render() {
    return (
      <BasicPagination {...this.props} />
    );
  }
}

@Renderer({
  type: 'pagination'
})
export class PaginationRenderer extends Pagination { }
