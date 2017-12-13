'use strict';

const dictionary = ['ace', 'acf', 'ade', 'adf', 'bce', 'bcf', 'bde', 'bdf'];
const search_bar = document.getElementById('search-bar');
const search_dropdown = document.getElementById('search-dropdown');
const query_proto = 'https://www.google.com.tw/search?q=';

let search_result = [];

class TrieNode {
	constructor() {
		this.end = false;
		this.word = '';
		// 26 nulls for trie children, corresponding to a-z
		this.children = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
	}

	has_end() {
		return this.end;
	}

	is_end() {
		this.end = true;
	}

	addNode(index) {
		this.children[index] = new TrieNode();
	}

	traverse() {
		if(this.has_end()) {
			search_result.push(this.word);
		}
		this.children.forEach(node => {
			if(node !== null) {
				node.traverse();
			}
		});
	}
}

class Trie {
	constructor() {
		this.root = new TrieNode();
	}

	insert(word) {
		const word_length = word.length;
		let current_trie_node = this.root;

		for (var i = 0; i < word_length; i++) {
			let index = word[i].toLowerCase().charCodeAt() - 97;
			if(current_trie_node.children[index] === null)
				current_trie_node.addNode(index);
			current_trie_node = current_trie_node.children[index];
		}
		current_trie_node.is_end();
		current_trie_node.word = word;
	}

	search(word) {
		const word_length = word.length;
		let current_trie_node = this.root;

		for (var i = 0; i < word_length; i++) {
			let index = word[i].toLowerCase().charCodeAt() - 97;
			if(current_trie_node.children[index] !== null) {
				current_trie_node = current_trie_node.children[index];
			}
			else {
				return false;
			}
		}
		search_result = [];
		current_trie_node.traverse();
		return true;
	}
}

const dictTrie = new Trie();

dictionary.forEach(word => {
	dictTrie.insert(word);
});

function createSearchDropdownItem(query) {
	let a = `<a class="search-dropdown-item" target="_blank" href="${query_proto}${query}">${query}</a>`;
	return a;
}

search_bar.addEventListener('input', e => {
	search_dropdown.innerHTML = '';
	const query = search_bar.value;
	let found = dictTrie.search(query);
	if(found) {
		search_result.forEach(word => {
			search_dropdown.innerHTML += createSearchDropdownItem(word);
		});
	}
	else {
		search_dropdown.innerHTML += createSearchDropdownItem('404 Not Found');
	}
});
