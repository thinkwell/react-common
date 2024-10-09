var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useContext } from 'react';
import { LegacyStack, ResourceList as ResourceListShopify, Pagination, InlineError, EmptyState } from '@shopify/polaris';
import { SearchContext, PagingContext, FormContext } from '@thinkwell/react.common';
export default function ResourceList(props) {
    const form = useContext(FormContext);
    const [page_info, previous_page_info, next_page_info, setPageInfo] = useContext(PagingContext);
    const [search] = useContext(SearchContext);
    const orderProp = props.order || 'updated_at';
    const [order, setOrder] = useState(`${orderProp} desc`);
    const limit = props.limit || 10;
    const itemsSorted = [].concat(props.items);
    if (!props.withoutSort && order) {
        const [field, type] = order.split(' ');
        itemsSorted.sort((a, b) => {
            if (type == 'desc') {
                return new Date(b[field]).valueOf() - new Date(a[field]).valueOf();
            }
            else {
                return new Date(a[field]).valueOf() - new Date(b[field]).valueOf();
            }
        });
    }
    const doSearch = (params) => __awaiter(this, void 0, void 0, function* () {
        if (search) {
            params.query = search;
        }
        params.limit = params.limit || limit;
        params.order = params.order || order;
        const results = yield props.fetchItems(props.url, params);
    });
    const handleSortChange = (order) => {
        setOrder(order);
        doSearch({ order: order });
    };
    const handlePreviousPage = () => {
        setPageInfo(previous_page_info);
        doSearch({ page_info: previous_page_info });
    };
    const handleNextPage = () => {
        setPageInfo(next_page_info);
        doSearch({ page_info: next_page_info });
    };
    const resourceName = props.resourceName || {
        singular: 'customer',
        plural: 'customers',
    };
    const paginationMarkup = props.items.length > 0 && (!!previous_page_info || !!next_page_info) ? (_jsx(Pagination, { hasPrevious: !!previous_page_info, hasNext: !!next_page_info, onPrevious: handlePreviousPage, onNext: handleNextPage })) : null;
    const sortOptions = !props.withoutSort && !!props.url ? [
        { label: 'Newest update', value: `${orderProp} desc` },
        { label: 'Oldest update', value: `${orderProp} asc` },
    ] : null;
    const emptyStateMarkup = !props.items || !props.items.length ? _jsx(EmptyState, { image: "", heading: `No ${resourceName.plural} found` }) : null;
    return (_jsxs(LegacyStack, { vertical: true, children: [props.fetchItemsState && props.fetchItemsState.error ? _jsx(InlineError, { message: props.fetchItemsState && props.fetchItemsState.error, fieldID: "resourceListError" }) : null, props.fetchItemsError ? _jsx(InlineError, { message: props.fetchItemsError, fieldID: "resourceListError" }) : null, _jsx(ResourceListShopify, { selectedItems: props.selectable && form.field && form.field(props.name), onSelectionChange: props.selectable && form.onData && form.onData(props.name), filterControl: props.filterControl, selectable: props.selectable, resourceName: resourceName, emptyState: emptyStateMarkup, items: itemsSorted, renderItem: props.renderItem, sortValue: order, sortOptions: sortOptions, onSortChange: handleSortChange, loading: props.fetchItemsState && props.fetchItemsState.loading || props.fetchItemsLoading }), paginationMarkup] }));
}
