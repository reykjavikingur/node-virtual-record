let should = require('should');

let VirtualRecord = require('../lib/virtual-record');

describe('VirtualRecord', ()=> {

	it('should be defined', ()=> {
		should(VirtualRecord).be.ok();
	});

	describe('.create', ()=> {

		describe('with no argument', ()=> {
			it('should throw error', ()=> {
				should(() => VirtualRecord.create()).throw();
			});
		});

		describe('with empty array', ()=> {

			var Items;

			beforeEach(()=> {
				Items = VirtualRecord.create([]);
			});

			it('should be defined', ()=> {
				should(Items).be.ok();
			});

			describe('.find', ()=> {

				it('should exist', ()=> {
					should(Items.find).be.a.Function();
				});

				describe('given no argument', ()=> {
					it('should throw error', ()=> {
						should(()=>Items.find()).throw();
					});
				});

				describe('given empty criteria', ()=> {

					describe('promise', ()=> {
						var promise;
						beforeEach(()=> {
							promise = Items.find({});
						});
						it('should be defined', ()=> {
							should(promise).be.ok();
						});

						describe('resolution', ()=> {
							var hasResolved, result;
							beforeEach((done)=> {
								hasResolved = false;
								promise.then((r) => {
									result = r;
									hasResolved = true;
									done();
								}, (e) => done(e));
							});

							it('should happen', ()=> {
								should(hasResolved).be.ok();
							});

							it('should be falsy', ()=> {
								should(result).not.be.ok();
							});
						});

					});

				});

			});

			describe('.where', ()=> {

				it('should exist', ()=> {
					should(Items.where).be.a.Function();
				});

				describe('given no argument', ()=> {
					it('should throw error', ()=> {
						should(()=>Items.where()).throw();
					});
				});

				describe('given empty criteria', ()=> {

					describe('promise', ()=> {
						var promise;
						beforeEach(()=> {
							promise = Items.where({});
						});

						it('should exist', ()=> {
							should(promise).be.ok();
						});

						describe('resolution', ()=> {
							var result;
							beforeEach((done) => {
								promise.then((r) => {
									result = r;
									done();
								}, (e) => done(e));
							});
							it('should be empty array', ()=> {
								should(result).eql([]);
							});
						});
					});

				});

			});

			describe('.count', ()=> {

				describe('given no argument', ()=> {
					it('should throw error', ()=> {
						should(()=>Items.count()).throw();
					});
				});

				describe('given empty criteria', ()=> {

					describe('promise', ()=> {
						var promise;
						beforeEach(()=> {
							promise = Items.count({});
						});
						it('should exist', ()=> {
							should(promise).be.ok();
						});

						describe('result', ()=> {
							var result;
							beforeEach((done)=> {
								promise.then((r) => {
									result = r;
									done();
								}, (e) => done(e));
							});
							it('should be 0', ()=> {
								should(result).equal(0);
							});
						});
					});

				});
			});

		});

		describe('with populated array', ()=> {

			var list, Items;

			beforeEach(()=> {
				list = [
					{id: 1, name: 'foo', cat: 'eu'},
					{id: 2, name: 'bar', cat: 'oi'},
					{id: 3, name: 'baz', cat: 'eu'},
					{id: 4, name: 'quux', cat: 'eu'}
				];
				Items = VirtualRecord.create(list);
			});

			describe('.find', ()=> {

				describe('given empty criteria', ()=> {
					var result;
					beforeEach((done) => {
						Items.find({})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should be first item', ()=> {
						should(result).equal(list[0]);
					});
				});

				describe('given matching criteria', ()=> {

					var promise;

					beforeEach(()=> {
						promise = Items.find({id: 1});
					});

					it('should return', ()=> {
						should(promise).be.ok();
					});

					describe('resolution', ()=> {
						var result;
						beforeEach((done) => {
							promise.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
						});

						it('should be correct item', ()=> {
							should(result).equal(list[0]);
						});
					});

				});

				describe('given non-matching criteria', ()=> {

					var promise;

					beforeEach(()=> {
						promise = Items.find({id: 'idnotexistanywhere'});
					});

					describe('resolution', ()=> {
						var result;
						beforeEach((done) => {
							promise.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
						});
						it('should be falsy', ()=> {
							should(result).not.be.ok();
						});
					});

				});

			});

			describe('.where', ()=> {

				describe('given singly matching criteria', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({id: 4})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve correctly', ()=> {
						should(result).eql([list[3]]);
					});
				});

				describe('given multi-matching criteria', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({cat: 'eu'})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve correctly', ()=> {
						should(result).eql([list[0], list[2], list[3]]);
					});
				});

				describe('given empty criteria', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve correctly', ()=> {
						should(result).eql(list);
					});
				});

			});

			describe('.count', ()=> {

				describe('given empty criteria', ()=> {
					var result;
					beforeEach((done) => {
						Items.count({})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to 4', () => {
						should(result).equal(4);
					});
				});

				describe('given non-matching criteria', ()=> {
					var result;
					beforeEach((done) => {
						Items.count({
							noway: 'doesnotcompute'
						})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to 0', ()=> {
						should(result).equal(0);
					});
				});

				describe('given criteria matching N of the items', ()=> {
					var result;
					beforeEach((done) => {
						Items.count({
							cat: 'eu'
						})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should be N', ()=> {
						should(result).equal(3);
					});
				})
			});

		});

		describe('with array having items with searchable fields', () => {

			var list, Items;

			beforeEach(()=> {
				list = [
					{id: 1, name: 'foo', title: 'on my chair', desc: 'lorem ipsum sit amet'},
					{id: 2, name: 'bar', title: 'on the table', desc: 'dolor sit consectetur'},
					{id: 3, name: 'baz', title: 'at my table', desc: 'exercitum ad elit esse'},
					{id: 4, name: 'quux', title: 'in the chair', desc: 'ipsum pro'}
				];

				Items = VirtualRecord.create(list);
			});

			describe('.where', ()=> {

				describe('given non-matching search', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, 'nevermentioned')
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to empty array', ()=> {
						should(result).eql([]);
					});
				});

				describe('given empty search', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, '')
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to full list', ()=> {
						should(result).eql([list[0], list[1], list[2], list[3]]);
					});
				});

				describe('given singly matching search', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, 'at')
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to matching item', ()=> {
						should(result).eql([list[2]]);
					});
				});

				describe('given multi-matching search', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, 'chair')
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to matching items', ()=> {
						should(result).eql([list[0], list[3]]);
					});
				});

				describe('given matching multi-word search', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, 'ipsum dolor')
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to matching items', ()=> {
						should(result).eql([list[0], list[1], list[3]]);
					});
				});

				describe('given multi-matched filtered search', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({name: 'foo'}, 'chair')
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to matching items', ()=> {
						should(result).eql([list[0]]);
					});
				});

				describe('given search without full-word matches', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, 'ch')
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to matching items', ()=> {
						should(result).eql([]);
					});
				});

			});

			describe('.count', ()=> {

				describe('given non-matching search', ()=> {
					var result;
					beforeEach((done) => {
						Items.count({}, 'nevermentioned')
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to 0', ()=> {
						should(result).eql(0);
					});
				});

			});

		});

		describe('with long array', ()=> {

			var list, Items;

			beforeEach(()=> {
				list = [
					{id: 1, name: 'first', parity: true, type: 'unity'},
					{id: 2, name: 'second', parity: false, type: 'prime'},
					{id: 3, name: 'third', parity: true, type: 'prime'},
					{id: 4, name: 'fourth', parity: false, type: 'composite'},
					{id: 5, name: 'fifth', parity: true, type: 'prime'},
					{id: 6, name: 'sixth', parity: false, type: 'composite'},
					{id: 7, name: 'seventh', parity: true, type: 'prime'},
					{id: 8, name: 'eighth', parity: false, type: 'composite'},
					{id: 9, name: 'ninth', parity: true, type: 'composite'},
					{id: 10, name: 'tenth', parity: false, type: 'composite'},
					{id: 11, name: 'eleventh', parity: true, type: 'prime'},
					{id: 12, name: 'twelfth', parity: false, type: 'composite'},
					{id: 13, name: 'thirteenth', parity: true, type: 'prime'}
				];

				Items = VirtualRecord.create(list);
			});

			describe('.where', ()=> {

				describe('with empty criteria and sort by name', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, {sort: {name: 1}})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to correctly sorted list', ()=> {
						// 8, 11, 5, 1, 4, 9, 2, 7, 6, 10, 3, 13, 12
						should(result).eql([list[7], list[10], list[4], list[0], list[3], list[8], list[1], list[6], list[5], list[9], list[2], list[12], list[11]]);
					});
				});

				describe('with empty criteria and sort by name descending', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, {sort: {name: -1}})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to correctly sorted list', ()=> {
						// reverse of 8, 11, 5, 1, 4, 9, 2, 7, 6, 10, 3, 13, 12
						should(result).eql([list[7], list[10], list[4], list[0], list[3], list[8], list[1], list[6], list[5], list[9], list[2], list[12], list[11]].reverse());
					});
				});

				describe('with empty criteria and sort by name and offset and limit', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, {sort: {name: 1}, offset: 4, limit: 2})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to correctly sorted list', ()=> {
						should(result).eql([list[3], list[8]]);
					});
				});

				describe('with empty criteria and sort by multiple fields', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, {
							sort: {
								type: 1,
								name: 1
							}
						})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});

					it('should have all items', ()=> {
						should(result.length).equal(list.length);
					});

					it('should affect primary order', ()=> {
						for (let i in result) {
							if (i > 0) {
								let current = result[i];
								let previous = result[i - 1];
								let types = [previous.type, current.type];
								should(types).eql(types.slice().sort());
							}
						}
					});

					it('should affect secondary order', ()=> {
						for (let i in result) {
							if (i > 0) {
								let current = result[i];
								let previous = result[i - 1];
								if (previous.type === current.type) {
									let names = [previous.name, current.name];
									should(names).eql(names.slice().sort());
								}
							}
						}
					});
				});

				describe('with matching criteria and sort option', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({type: 'prime'}, {sort: {name: 1}})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should have correct length', ()=> {
						should(result.length).equal(6);
					});
					it('should affect order', ()=> {
						for (let i in result) {
							if (i > 0) {
								let current = result[i];
								let previous = result[i - 1];
								let names = [previous.name, current.name];
								should(names).eql(names.slice().sort());
							}
						}
					});
				});

				describe('with empty criteria and offset option', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, {offset: 5})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to list offset by 5', ()=> {
						should(result).eql([list[5], list[6], list[7], list[8], list[9], list[10], list[11], list[12]]);
					});
				});

				describe('with empty criteria and limit 5', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, {limit: 5})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to list limited to 5', ()=> {
						should(result).eql([list[0], list[1], list[2], list[3], list[4]]);
					});
				});

				describe('with empty criteria and offset 5 and limit 5', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, {offset: 5, limit: 5})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to list offset by 5 and limited to 5', ()=> {
						should(result).eql([list[5], list[6], list[7], list[8], list[9]]);
					});
				});

				describe('with empty criteria and offset 10 and limit 5', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, {offset: 10, limit: 5})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to list offset by 10 and limited to 5', ()=> {
						should(result).eql([list[10], list[11], list[12]]);
					});
				});

				describe('with empty criteria and offset 15 and limit 5', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, {offset: 15, limit: 5})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to empty list', ()=> {
						should(result).eql([]);
					});
				});

				describe('with empty criteria and offset -5 and limit 5', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({}, {offset: -5, limit: 5})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to empty list', ()=> {
						should(result).eql([]);
					});
				});

				describe('with matching criteria and limit', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({parity: false}, {limit: 3})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to correct list', ()=> {
						should(result).eql([list[1], list[3], list[5]]);
					});
				});

				describe('with matching criteria and search and limit', ()=> {
					var result;
					beforeEach((done) => {
						Items.where({parity: false}, 'composite', {limit: 3})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to correct list', ()=> {
						// 4, 6, 8
						should(result).eql([list[3], list[5], list[7]]);
					});
				});

			});

			describe('.count', ()=> {

				describe('with empty criteria and limit 5', ()=> {
					var result;
					beforeEach((done) => {
						Items.count({}, {limit: 5})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to 5', ()=> {
						should(result).equal(5);
					});
				});

				describe('with empty criteria and offset 15 and limit 5', ()=> {
					var result;
					beforeEach((done) => {
						Items.count({}, {offset: 15, limit: 5})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to 0', ()=> {
						should(result).eql(0);
					});
				});

				describe('with matching criteria and limit', ()=> {
					var result;
					beforeEach((done) => {
						Items.count({parity: false}, {limit: 3})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to correct number', ()=> {
						should(result).eql(3);
					});
				});

				describe('with matching criteria and search and limit', ()=> {
					var result;
					beforeEach((done) => {
						Items.count({parity: false}, 'composite', {limit: 3})
							.then((r) => {
								result = r;
								done();
							}, (e) => done(e));
					});
					it('should resolve to correct list', ()=> {
						// 4, 6, 8
						should(result).eql(3);
					});
				});

			});

		});

	});

});