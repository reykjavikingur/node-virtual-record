# Virtual Record

Node utility to create objects with active record interfaces using arrays as mock data.

## Usage

```
let VirtualRecord = require('virtual-record');

let Items = VirtualRecord.create([item1, item2, item2]);

Items.find({id: 1234})
.then((item) => {
    if (item) 
        console.log('found item:', item);
    else
        console.error('could not find item');
})
```

## Static Methods

### create(list: Array<*>)

Instantiates a virtual record.

## Instance Methods

### find(criteria: Object) : Promise<*>

The `criteria` is the set of key-value pairs by which to filter items.

### where(criteria: Object, searchQuery?: String|Array<String>, parameters?: Object) : Promise<Array<*>>

The `parameters` object has: {sort?: Object, offset?: Number, limit?: Number}

### count(criteria: Object, searchQuery?: String|Array<String>, parameters?: Object) : Promise<Number>
