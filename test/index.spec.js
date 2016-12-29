let should = require('should');

let self = require('../');
let VirtualRecord = require('../lib/virtual-record');

describe('self', ()=> {

	it('should be VirtualRecord', ()=> {
		should(self).equal(VirtualRecord);
	});

});