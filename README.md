[![Build Status](https://travis-ci.org/nova706/PreparedQueryOptions.png?branch=master)](https://travis-ci.org/nova706/PreparedQueryOptions)
PreparedQueryOptions
=======================

A simple set of JS classes to help build and parse OData queries

##PreparedQueryOptions.js

PreparedQueryOptions are used to set, store and parse OData query parameters. Instead of passing multiple arguments to methods for each query option, simply pass the preparedQueryOptions object. Use the parseOptions method on the object to return an OData string for a query.

###Get Started

1. Include preparedQueryOptions.js in your index.html file or if using RequireJS, just require the file as a dependency.

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

##Predicate.js

Predicates are used to define complex filter clauses for use in an OData query string.

###Get Started

1. Include predicate.js in your index.html file or if using RequireJS, just require the file as a dependency.

2. Create a new predicate object passing the property, operator, and value
```javascript
var predicate = new Predicate('age', 'gt', 21);
```

3. Optionally pass the property and use chained operation methods
```javascript
var predicate = new Predicate('age').greaterThan(21);
```

4. Join existing predicates with an 'and' separator
```javascript
var pred1 = new Predicate('age').greaterThan(21);
var pred2 = new Predicate('age').lessThan(50);
pred1.join(pred2);
// Parsed result looks like "age gt 21 and age lt 50"
```

5. Optionally use the Predicate class to join an array of predicates
```javascript
var pred1 = new Predicate('age').greaterThan(21);
var pred2 = new Predicate('age').lessThan(50);
var joinedPredicate = Predicate.join([pred1, pred2]);
```

6. Parse the predicate into a query string
```javascript
var predicate = new Predicate('age').greaterThan(21);
var urlString = predicate.parsePredicate();
// urlString result looks like "age gt 21"
```
