import type { panelEntry } from '$lib/utils/types';
import { writable } from 'svelte/store';

// Create a search store with initial data
export const createSearchStore = (data: any) => {
	// Define the store with writable
	const { subscribe, set, update } = writable({
		data: data,
		filtered: data,
		search: '',
		tagFilter: 'none'
	});

	return {
		subscribe,
		set,
		update
	};
};

// Handler function for filtering search results based on search term and tag filter
export const dashboardSearchHandler = (store: {
	search: string;
	filtered: any;
	data: any[];
	tagFilter: string;
}) => {
	// Convert search term to lowercase and split into individual terms
	const searchTerm = store.search.toLowerCase() || '';
	const searchTerms = searchTerm.split(' ');

	// Filter the data based on search terms and tag filter
	store.filtered = store.data
		.filter((item: { name: string; description: string; tags: any[] }) => {
			// Check if all search terms are included in the item name, description, or tags
			return searchTerms.every((term: string) => {
				return (
					item.name.toLowerCase().includes(term) ||
					item.description.toLowerCase().includes(term) ||
					item.tags.join(' ').toLowerCase().includes(term)
				);
			});
		})
		// Filter by tag if tag filter is set to a specific tag
		.filter((item: { tags: any[] }) => {
			return store.tagFilter === 'none' || item.tags.includes(store.tagFilter);
		});
};

export const panelSearchHandler = (store: {
	search: string;
	filtered: any;
	data: any[];
	tagFilter: string;
}) => {
	// Convert search term to lowercase and split into individual terms
	const searchTerm = store.search.toLowerCase() || '';
	const searchTerms = searchTerm.split(' ');

	// Filter the data based on search terms and tag filter
	store.filtered = store.data.filter((item: panelEntry) => {
		// Check if all search terms are included in the item name, description, or tags
		return searchTerms.every((term: string) => {
			console.log(term);
			return item.title.toLowerCase().includes(term);
		});
	});
};
