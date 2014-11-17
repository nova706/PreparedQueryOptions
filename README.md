[![Build Status](https://travis-ci.org/nova706/PreparedQueryOptions.svg?branch=1.1.1)](https://travis-ci.org/nova706/PreparedQueryOptions)
PreparedQueryOptions
=======================

A simple set of JS classes to help build and parse OData queries

##New in 1.1.x
- Get and Clear values stored in PreparedQueryOptions. Passing no value returns the current value. Passing null clears the current value.
```javascript
options.$top(); // Return the current $top value
options.$top(null); // Clears the current $top value
```
- Predicate.fromString(filterString): create a predicate from a filter query string.
- Evaluate an object to see if it matches a predicates filter conditions
```javascript
var testObject = { age: 25 };
var predicate = new Predicate('age').greaterThan(21);
predicate.test(testObject); // Returns true.
```
- predicate.startsWith(value): parses as "startswith(property, 'value'")
- predicate.endsWith(value): parses as "endswith(property, 'value'")
- predicate.contains(value): parses as "substringof('value', property")

##Breaking Changes in 1.1.0

The predicate class has been significantly updated for better management of the predicate structure. You can now create a predicate object from a filter string in the URL. On the client side, this means you can take an existing PreparedQueryOptions object and modify/extend the filter string that is stored. On the server side, you now have the ability to take an incoming query string and parse a predicate from it making it easier to parse into SQL or into an ORM for querying the database. 

Furthermore, the Predicate class now supports the OData standard startswith, endswith and substringof methods. These are accessed via the startsWith(), endsWith() and contains() methods respectivly.

To accomodate these changes, there is one breaking change:

The signature of the constructor for a Predicate has changed and no longer takes the operator or value. It instead just takes the property (and a parser method that is used internally for cloning a predicate). To set the operator and value, you should now use the methods on the Predicate to set the operator and value (equals(), notEqualTo(), greaterThan()...).

```javascript
new Predicate('age', 'gt', 21);
```
Should now be:
```javascript
new Predicate('age').greaterThan(21);
```

##PreparedQueryOptions.js

PreparedQueryOptions are used to set, store and parse OData query parameters. Instead of passing multiple arguments to methods for each query option, simply pass the preparedQueryOptions object. Use the parseOptions method on the object to return an OData string for a query.

###Get Started

- Include preparedQueryOptions.js in your index.html file or if using RequireJS, just require the file as a dependency.

- Create a new preparedQueryOptions object
```javascript
var options = new PreparedQueryOptions();
```

- Set new options
```javascript
options.$top(10);
// Parsed result looks like "?$top=10"
```

- Chain any number of options
```javascript
var options = new PreparedQueryOptions().$top(10).$orderBy("name asc");
options.$expand("address").$filter("age gt 16");
```

- Parse the options into a query string
```javascript
var options = new PreparedQueryOptions().$top(10).$orderBy("name asc");
var urlParameters = options.parseOptions();
// Parsed result looks like "?$top=10&$orderby=name asc"
```

- Get and clear the current values
```javascript
var options = new PreparedQueryOptions().$top(10).$orderBy("name asc");
options.$top(); // Returns 10
options.$top(null); // Clears the top value
```

##Predicate.js

Predicates are used to define complex filter clauses for use in an OData query string.

###Get Started

- Include predicate.js in your index.html file or if using RequireJS, just require the file as a dependency.

- Create a new predicate object passing the property, operator, and value
```javascript
var predicate = new Predicate('age').greaterThan(21);
```

- Optionally pass the property and use chained operation methods
```javascript
var predicate = new Predicate('age').greaterThan(21);
```

- Join existing predicates with an 'and' separator
```javascript
var pred1 = new Predicate('age').greaterThan(21);
var pred2 = new Predicate('age').lessThan(50);
pred1.join(pred2);
// Parsed result looks like "age gt 21 and age lt 50"
```

- Optionally use the Predicate class to join an array of predicates
```javascript
var pred1 = new Predicate('age').greaterThan(21);
var pred2 = new Predicate('age').lessThan(50);
var joinedPredicate = Predicate.join([pred1, pred2]);
```

- Parse the predicate into a query string
```javascript
var predicate = new Predicate('age').greaterThan(21);
var urlString = predicate.parsePredicate();
// urlString result looks like "age gt 21"
```
