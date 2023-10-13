import React, { useState, useEffect, useRef, useContext, ReactNode } from 'react';
import {Card, Stack, ResourceList as ResourceListShopify, Pagination, InlineError, EmptyState} from '@shopify/polaris';
import {SearchContext, PagingContext, FormContext, useReducerForm, useReducerRequest, FetchStateProps} from '@thinkwell/react.common';

type Props = {
  fetchItemsLoading?: boolean;
  renderItem: (item: any, id: string, index: number) => ReactNode;
  name?: string | string[],
  order?: string,
  limit?: number,
  items: any[],
  withoutSort?: boolean,
  url?: string,
  fetchItems?: ((url:string, params?) => void),
  resourceName?: {singular: string, plural: string},
  selectable?: boolean,
  fetchItemsState?: FetchStateProps,
  fetchItemsError?: string
}

export default function ResourceList(props:Props) {
  const form = useContext(FormContext)
  const [page_info, previous_page_info, next_page_info, setPageInfo] = useContext(PagingContext)
  const [search] = useContext(SearchContext)
  const orderProp = props.order || 'updated_at'
  const [order, setOrder] = useState(`${orderProp} desc`)
  const limit = props.limit || 10;

  const itemsSorted = [].concat(props.items)
  if (!props.withoutSort && order) {
    const [field, type] = order.split(' ')
    itemsSorted.sort((a, b) => {
      if (type == 'desc') {
        return new Date(b[field]).valueOf() - new Date(a[field]).valueOf()
      } else {
        return new Date(a[field]).valueOf() - new Date(b[field]).valueOf()
      }
    })
  }

  const doSearch = async(params) => {
    if (search) {
      params.query = search
    }
    params.limit = params.limit || limit
    params.order = params.order || order
    const results = await props.fetchItems(props.url, params)
  };

  const handleSortChange = (order) => {
    setOrder(order);
    doSearch({order: order})
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
  const sortOptions =
    !props.withoutSort && !!props.url ? [
      {label: 'Newest update', value: `${orderProp} desc`},
      {label: 'Oldest update', value: `${orderProp} asc`},
    ] : null;

  const emptyStateMarkup = !props.items || !props.items.length ?  <EmptyState image="" heading={`No ${resourceName.plural} found`}></EmptyState> : null

  return (
    <Stack vertical={true}>
      { props.fetchItemsState && props.fetchItemsState.error ? <InlineError message={props.fetchItemsState && props.fetchItemsState.error} fieldID="resourceListError" /> : null }
      { props.fetchItemsError ? <InlineError message={props.fetchItemsError} fieldID="resourceListError" /> : null }
      <ResourceListShopify
      selectedItems={props.selectable && form.field && form.field(props.name)}
      onSelectionChange={props.selectable && form.onData && form.onData(props.name)}
      selectable={props.selectable}
      resourceName={resourceName}
      emptyState={emptyStateMarkup}
      items={itemsSorted}
      renderItem={props.renderItem}
      sortValue={order}
      sortOptions={sortOptions}
      onSortChange={handleSortChange}
      loading={props.fetchItemsState && props.fetchItemsState.loading || props.fetchItemsLoading}
      />
      {paginationMarkup}
    </Stack>
  );
}
