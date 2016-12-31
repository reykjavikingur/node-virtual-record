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

Returns promise resolving to the first item in the list matching the criteria, if any.

The `criteria` is the set of key-value pairs by which to filter items.

### where(criteria: Object, searchQuery?: String, options?: Object) : Promise<Array<*>>

Returns promise resolving to list of all items matching criteria and search query (if any)
and then sorted and/or paginated according to options (if any).

The `options` object has: {sort?: Object, offset?: Number, limit?: Number}

The `options.sort` object has keys corresponding to names of fields in list items
and values 1 for ascending order and -1 for descending order.

### count(criteria: Object, searchQuery?: String, parameters?: Object) : Promise<Number>

Returns promise resolving to the number of items in the list that would be resolved by the corresponding call to `where`.
