let _ = require('underscore');
let assert = require('assert');
let Promise = require('promise');

function VirtualRecord(list) {
	assert(Boolean(list), 'missing required argument');
	assert(_.isArray(list), 'invalid argument');
	this.list = list;
}

// STATIC METHODS

_.extend(VirtualRecord, {
	create: create
});

function create(list) {
	return new VirtualRecord(list);
}

// INSTANCE METHODS

VirtualRecord.prototype = {
	find: find,
	where: where,
	count: count
};

function find(criteria) {
	if (!criteria) {
		throw new Error('missing required argument');
	}
	let found = _.findWhere(this.list, criteria);
	return Promise.resolve(found);
}

function where(criteria, search, options) {
	if (!criteria) {
		throw new Error('missing required argument');
	}
	if (arguments.length === 2) {
		if (_.isObject(search)) {
			options = search;
			search = '';
		}
	}
	if (!options) {
		options = {};
	}
	let found = _.where(this.list, criteria);
	if (Boolean(search)) {
		found = _.filter(found, (item) => {
			return _.any(_.keys(item), (key) => {
				let x = item[key];
				if (_.isString(x)) {
					let terms = _.chain(search.split(/\b/))
							.map((term) => term.trim())
							.compact()
							.value()
						;
					let words = x.split(/\b/);
					return _.any(terms, (term) => {
						return words.indexOf(term) >= 0;
					});
				}
			});
		});
	}
	if (Boolean(options.sort)) {
		let sortKeys = _.keys(options.sort).reverse();
		_.each(sortKeys, (sortKey) => {
			found = _.sortBy(found, sortKey);
			if (options.sort[sortKey] < 0) {
				found.reverse();
			}
		});
	}
	if (!options.offset) {
		options.offset = 0;
	}
	if (!options.limit) {
		options.limit = found.length;
	}
	found = found.slice(options.offset, options.limit + options.offset);
	return Promise.resolve(found);
}

function count() {
	return this.where.apply(this, arguments)
		.then((r) => {
			return r.length;
		});
}

module.exports = VirtualRecord;
