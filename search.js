'use strict';

const $search_bar = $('#search-bar');
const $search_dropdown = $('#search-dropdown');
const query_proto = 'https://www.google.com.tw/search?q=';

function $searchWiki(term) {
    return $.ajax({
        url: 'http://en.wikipedia.org/w/api.php',
        dataType: 'jsonp',
        data: {
            action: 'opensearch',
            format: 'json',
            search: term
        }
    }).promise();
}

function $createSearchDropdownItem(query) {
	let item = $('<a></a>');
	item.addClass('search-dropdown-item')
		.attr({
			target: '_blank',
			rel: 'noopener',
			href: query_proto + query,
		});
	item.html(query);
	return item;
}

function $renderResultList(list) {
	$search_dropdown.html('');
	list.forEach(word => {
		let item = $createSearchDropdownItem(word);
		$search_dropdown.append(item);
	});
}

Rx.Observable.fromEvent($search_bar, 'input')
	.debounceTime(250)
	.map(e => e.target.value)
	.switchMap(value => {
		return value.length > 0 ?
			Rx.Observable.from($searchWiki(value)).map(res => res[1]) : Rx.Observable.of([])
	})
	.subscribe(data => {
		$renderResultList(data);
	});

Rx.Observable.fromEvent($search_dropdown, 'click')
	.filter(e => e.target.matches('a'))
	.map(e => e.target.innerHTML)
	.do(value => {
		$search_bar.val(value);
	})
	.switchMap(value => {
		return value.length > 0 ?
			Rx.Observable.from($searchWiki(value)).map(res => res[1]) : Rx.Observable.of([])
	})
	.subscribe(data => {
		$renderResultList(data);
	})
