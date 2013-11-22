PreparedQueryOptions
=======================

A simple set of JS classes to help build and parse OData queries

##PreparedQueryOptions.js

PreparedQueryOptions are used to set, store and parse OData query parameters. Instead of passing multiple arguments to methods for each query option, simply pass the preparedQueryOptions object. Use the parseOptions method on the object to return an OData string for a query.

###Get Started

1. Include preparedQueryOptions.js in your index.html file

2. Create a new preparedQueryOptions object
```javascript
var options = new PreparedQueryOptions();
```

3. Set new options
```javascript
options.$top(10);
// Parsed result looks like "?$top=10"
```

4. Chain any number of options
```javascript
var options = new PreparedQueryOptions().$top(10).$orderBy("name asc");
options.$expand("address").$filter("age gt 16");
```

5. Parse the options into a query string
```javascript
var options = new PreparedQueryOptions().$top(10).$orderBy("name asc");
var urlParameters = options.parseOptions();
// Parsed result looks like "?$top=10&$orderBy=name asc"
```
