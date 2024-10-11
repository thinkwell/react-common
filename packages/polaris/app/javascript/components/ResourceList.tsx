import React, { useState, useEffect, useRef, useContext, ReactNode } from 'react';
import {LegacyStack, ResourceList as ResourceListShopify, Pagination, InlineError, EmptyState, LegacyCard} from '@shopify/polaris';
import {SearchContext, PagingContext, FormContext, SortContext, useReducerForm, useReducerRequest, FetchStateProps, useSearch} from '@thinkwell/react.common';

type Props = {
  fetchItemsLoading?: boolean;
  renderItem: (item: any, id: string, index: number) => ReactNode;
  name?: string | string[],
  limit?: number,
  items: any[],
  onSearch?: ((params?) => void),
  resourceName?: {singular: string, plural: string},
  selectable?: boolean,
  fetchItemsState?: FetchStateProps,
  fetchItemsError?: string,
  filterControl?: ReactNode,
  alternateTool?: ReactNode
}

export default function ResourceList(props:Props) {
  const form = useContext(FormContext)
  const [sort] = useContext(SortContext)
  const [page_info, previous_page_info, next_page_info, setPageInfo] = useContext(PagingContext)
  const [onSearchChange, onSortChange] = useSearch(props.onSearch || function(){})
  const limit = props.limit || 10;

  const doSearch = async(params) => {
    params.limit = params.limit || limit
    await props.onSearch(params)
  };

  const handlePreviousPage = () => {
    setPageInfo(previous_page_info)
    doSearch({page_info: previous_page_info})
  };
  const handleNextPage = () => {
    setPageInfo(next_page_info)
    doSearch({page_info: next_page_info})
  };

  const resourceName = props.resourceName || {
    singular: 'customer',
    plural: 'customers',
  };
  const paginationMarkup =
    props.items.length > 0 && (!!previous_page_info || !!next_page_info) ? (
      <Pagination
        hasPrevious={!!previous_page_info}
        hasNext={!!next_page_info}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      />
    ) : null;

  const emptyStateMarkup = !props.items || !props.items.length ?  <EmptyState image="" heading={`No ${resourceName.plural} found`}></EmptyState> : null

  return (
    <LegacyStack vertical={true}>
      { props.fetchItemsState && props.fetchItemsState.error ? <InlineError message={props.fetchItemsState && props.fetchItemsState.error} fieldID="resourceListError" /> : null }
      { props.fetchItemsError ? <InlineError message={props.fetchItemsError} fieldID="resourceListError" /> : null }
      <LegacyCard>
      <ResourceListShopify
      selectedItems={props.selectable && form.field && form.field(props.name)}
      onSelectionChange={props.selectable && form.onData && form.onData(props.name)}
      filterControl={props.filterControl}
      alternateTool={props.alternateTool}
      selectable={props.selectable}
      resourceName={resourceName}
      emptyState={emptyStateMarkup}
      items={props.items}
      renderItem={props.renderItem}
      loading={props.fetchItemsState && props.fetchItemsState.loading || props.fetchItemsLoading}
      />
      </LegacyCard>
      {paginationMarkup}
    </LegacyStack>
  );
}
