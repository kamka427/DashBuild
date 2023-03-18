import { writable } from 'svelte/store';

export const createSearchStore = (data: any) => {
	const { subscribe, set, update } = writable({
		data: data,
		filtered: data,
		search: ''
	});

	return {
		subscribe,
		set,
		update
	};
};

export const searchHandler = (store: { search: string; filtered: any; data: any[] }) => {
	const searchTerm = store.search.toLowerCase() || '';
	const searchTerms = searchTerm.split(' ');
	store.filtered = store.data.filter(
		(item: { name: string; description: string; tags: any[]; user: { team: string } }) => {
			return searchTerms.every((term: string) => {
				return (
					item.name.toLowerCase().includes(term) ||
					item.description.toLowerCase().includes(term) ||
					item.tags.join(' ').toLowerCase().includes(term) ||
					item.user.team.toLowerCase().includes(term)
				);
			});
		}
	);
};
