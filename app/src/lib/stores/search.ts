import { writable } from 'svelte/store';

export const createSearchStore = (data: any) => {
	const { subscribe, set, update } = writable({
		data: data,
		filtered: data,
		search: '',
		teamFilter: 'none',
		tagFilter: 'none'
	});

	return {
		subscribe,
		set,
		update
	};
};

export const searchHandler = (store: {
	search: string;
	filtered: any;
	data: any[];
	teamFilter: string;
	tagFilter: string;
}) => {
	const searchTerm = store.search.toLowerCase() || '';
	const searchTerms = searchTerm.split(' ');
	store.filtered = store.data
		.filter((item: { name: string; description: string; tags: any[]; user: { team: string } }) => {
			return searchTerms.every((term: string) => {
				return (
					item.name.toLowerCase().includes(term) ||
					item.description.toLowerCase().includes(term) ||
					item.tags.join(' ').toLowerCase().includes(term) ||
					item.user.team.toLowerCase().includes(term)
				);
			});
		})
		.filter((item: { user: { team: string } }) => {
			return store.teamFilter === 'none' || item.user.team === store.teamFilter;
		})
		.filter((item: { tags: any[] }) => {
			return store.tagFilter === 'none' || item.tags.includes(store.tagFilter);
		});
};
