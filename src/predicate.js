/*
 * Predicate
 * version: 1.1.1
 * author: David Hamilton
 * license: https://github.com/nova706/PreparedQueryOptions/blob/master/LICENSE.txt (MIT)
 * https://github.com/nova706/PreparedQueryOptions
 *
 */

(function () {
    /**
     * A predicate is used for the $filter operator in a query. Predicates can be joined to query
     * using a group of filters with the 'and' operator.
     *
     * This is a helper class for the PreparedQueryOptions class to assist in building complex
     * filter clauses.
     *
     * @class Predicate
     * @constructor
     * @param {String} [property] The property to filter by.
     * @param {Function} [parser] A function that returns the predicate string.
     */
    function Predicate(property, parser) {
        this.property = property;
        this.parser = parser;
        return this;
    }

    /**
     * Joins a provided set of predicates using the group operator and returns a new Predicate
     *
     * @method join
     * @param {Predicate[]} predicates Array of predicates to join.
     * @param {String} [groupOperator] The operator for the filter set ('and' 'or').
     * @return {Predicate} Predicate object.
     */
    Predicate.join = function (predicates, groupOperator) {
        if (predicates instanceof Array && predicates.length > 0) {
            return new Predicate().join(predicates, groupOperator);
        }
        return null;
    };

    /**
     * Sets the predicate's property
     *
     * @method setProperty
     * @param {String} property
     * @return {Predicate} Predicate object.
     */
    Predicate.prototype.setProperty = function (property) {
        this.property = property;
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'eq' and the value to the input parameter
     *
     * @method equals
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.equals = function (value) {
        this.parser = function () {
            return this.property + ' eq ' + escapeValue(value);
        };
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'ne' and the value to the input parameter
     *
     * @method notEqualTo
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.notEqualTo = function (value) {
        this.parser = function () {
            return this.property + ' ne ' +  escapeValue(value);
        };
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'gt' and the value to the input parameter
     *
     * @method greaterThan
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.greaterThan = function (value) {
        this.parser = function () {
            return this.property + ' gt ' +  escapeValue(value);
        };
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'ge' and the value to the input parameter
     *
     * @method greaterThanOrEqualTo
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.greaterThanOrEqualTo = function (value) {
        this.parser = function () {
            return this.property + ' ge ' +  escapeValue(value);
        };
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'lt' and the value to the input parameter
     *
     * @method lessThan
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.lessThan = function (value) {
        this.parser = function () {
            return this.property + ' lt ' +  escapeValue(value);
        };
        return this;
    };

    /**
     * Modifies an existing predicate setting the operator to 'le' and the value to the input parameter
     *
     * @method lessThanOrEqualTo
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.lessThanOrEqualTo = function (value) {
        this.parser = function () {
            return this.property + ' le ' +  escapeValue(value);
        };
        return this;
    };

    /**
     * Modifies an existing predicate setting the operation to substringof and the value to the input parameter
     *
     * @method contains
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.contains = function (value) {
        this.parser = function () {
            return 'substringof(' +  escapeValue(value) + ', ' + this.property + ')';
        };
        return this;
    };

    /**
     * Modifies an existing predicate setting the operation to startswith and the value to the input parameter
     *
     * @method startsWith
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.startsWith = function (value) {
        this.parser = function () {
            return 'startswith(' + this.property + ', ' +  escapeValue(value) + ')';
        };
        return this;
    };

    /**
     * Modifies an existing predicate setting the operation to endswith and the value to the input parameter
     *
     * @method startsWith
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.endsWith = function (value) {
        this.parser = function () {
            return 'endswith(' + this.property + ', ' +  escapeValue(value) + ')';
        };
        return this;
    };

    /**
     * Joins an existing predicate with additional predicates using the group operator
     *
     * @method join
     * @param {Predicate|Predicate[]} predicates A single predicate or an array of predicates to join to the existing one.
     * @param {String} [groupOperator] The operator for the filter set ('and' 'or').
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.join = function (predicates, groupOperator) {
        var initialPredicate;

        if (this.property && typeof this.parser === 'function') {
            initialPredicate = new Predicate(this.property, this.parser);
        }

        var newPredicates = [];
        if (predicates instanceof Predicate) {
            newPredicates.push(predicates);
        } else if (predicates instanceof Array && predicates.length > 0) {
            var i;
            for (i = 0; i < predicates.length; i++) {
                if (predicates[i]) {
                    newPredicates.push(predicates[i]);
                }
            }
        }

        if (newPredicates.length > 0) {
            delete this.parser;
            delete this.property;

            this.joinedPredicates = (this.joinedPredicates) ? this.joinedPredicates.concat(newPredicates) : newPredicates;
            if (groupOperator || !this.groupOperator) {
                this.groupOperator = (groupOperator === 'or') ? 'or' : 'and';
            }
            if (initialPredicate) {
                this.joinedPredicates.unshift(initialPredicate);
            }
        }

        return this;
    };

    /**
     * Joins an existing predicate with additional predicates using the 'and' group operator
     *
     * @method and
     * @param {Predicate|Predicate[]} predicates A single predicate or an array of predicates to join to the existing one.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.and = function (predicates) {
        return this.join(predicates, 'and');
    };

    /**
     * Joins an existing predicate with additional predicates using the 'or' group operator
     *
     * @method or
     * @param {Predicate|Predicate[]} predicates A single predicate or an array of predicates to join to the existing one.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.or = function (predicates) {
        return this.join(predicates, 'or');
    };

    /**
     * Builds and returns a URL parameter string based on the predicate.
     *
     * @method parsePredicate
     * @param {Boolean} [nested = false] Used for building the nested group during recursion
     * @returns {String}
     */
    Predicate.prototype.parsePredicate = function (nested) {
        nested = (nested === true);
        var urlString = '';

        if (this.property && typeof this.parser === 'function') {
            return this.parser();
        }

        if (this.joinedPredicates && this.joinedPredicates.length > 0) {
            var i;
            var predicate;
            var predicateString;
            for (i = 0; i < this.joinedPredicates.length; i++) {
                predicate = this.joinedPredicates[i];
                predicateString = predicate.parsePredicate(true);
                urlString += (i > 0) ? ' ' + this.groupOperator + ' ' + predicateString : predicateString;
            }
        }

        return nested ? '(' + urlString + ')' : urlString;
    };

    /**
     * Creates a predicate structure from a string
     *
     * @method fromString
     * @param {String} predicateString
     * @return {Predicate|null} null if the predicate could not be built from the string
     */
    Predicate.fromString = function (predicateString) {
        if (typeof predicateString !== "string") {
            return null;
        }

        // Extract all the filters out of the predicate string
        var conditionMatcher = new RegExp("(substringof\\(.+?\\)|startswith\\(.+?\\)|endswith\\(.+?\\)|[\\w\\.]+?\\s(?:eq|ne|gt|ge|lt|le)\\s(?:\\w+|\\'.+?\\'))", "g");
        var filters = predicateString.match(conditionMatcher);

        if (!filters) {
            return null;
        }

        // Convert each filter into a predicate
        var i;
        for (i = 0; i < filters.length; i++) {
            filters[i] = getPredicateFromSegment(filters[i]);
            if (filters[i] === null) {
                return null;
            }
        }

        if (filters.length === 0) {
            return null;
        }

        // Remove all predicates from string
        i = 0;
        predicateString = predicateString.replace(conditionMatcher, function () {
            return i++;
        });

        if (filters.length === 1) {
            if (predicateString.replace(/[0-9]|\s|and|or/g, "") !== "") {
                return null;
            }
            return filters[0];
        }

        var closeParenthesisIndex;
        var openParenthesisIndex;
        var groupString;
        var filterIndexes;
        var groupPredicate = null;
        var groupFilters;
        var operator;
        var testNextLevel = true;

        while (testNextLevel) {
            closeParenthesisIndex = predicateString.indexOf(')');
            if (closeParenthesisIndex !== -1) {
                openParenthesisIndex = predicateString.lastIndexOf('(', closeParenthesisIndex);
                groupString = predicateString.substring(openParenthesisIndex + 1, closeParenthesisIndex);
                predicateString = predicateString.substring(0, openParenthesisIndex) + filters.length + predicateString.substring(closeParenthesisIndex + 1);
            } else {
                groupString = predicateString;
                testNextLevel = false;
            }

            // If the group contains invalid characters then return null as an invalid predicate string.
            if (groupString.replace(/[0-9]|\s|and|or/g, "") !== "") {
                return null;
            }

            // If the group uses both 'and' and 'or' then return null as an invalid predicate string.
            if (groupString.indexOf('and') >= 0 && groupString.indexOf('or') >= 0) {
                return null;
            }

            filterIndexes = groupString.match(/[0-9]+/g);
            groupFilters = [];
            for (i = 0; i < filterIndexes.length; i++) {
                groupFilters.push(filters[Number(filterIndexes[i])]);
            }
            operator = groupString.indexOf('or') >= 0 ? 'or' : 'and';
            groupPredicate = new Predicate().join(groupFilters, operator);
            filters.push(groupPredicate);
        }

        return groupPredicate;
    };

    /**
     * Takes a predicate's value and if it is a string, adds single quotes around it.
     *
     * @method escapeValue
     * @param {String|Boolean|Number} value
     * @returns {string} The string value
     */
    var escapeValue = function (value) {
        return (typeof value === 'string') ? "'" + value + "'" : value.toString();
    };

    /**
     * Returns the raw value of the predicate string
     *
     * @method convertValueToType
     * @param {String} value
     * @returns {String|Boolean|Number}
     */
    var convertValueToType = function (value) {
        if (value.indexOf("'") >= 0) {
            return value.replace(/\'/g, '');
        }
        if (value.toLowerCase() === 'true') {
            return true;
        }
        if (value.toLowerCase() === 'false') {
            return false;
        }
        if (!isNaN(value)) {
            return Number(value);
        }
        return value;
    };

    /**
     * Creates a predicate from a single condition eg: "property eq 'value'"
     *
     * @param {String} condition
     * @return {Predicate} The predicate built from the condition
     */
    var getPredicateFromSegment = function (condition) {
        var parenPos = condition.indexOf('(');
        var predicate = null;
        var conditionParams;
        var operator;
        var value;

        if (parenPos >= 0) {
            operator = condition.substring(0, parenPos);
            var start = parenPos + 1;
            var end = condition.indexOf(')');
            conditionParams = condition.substring(start, end);
            conditionParams = conditionParams.split(', ');

            switch (operator) {
            case 'startswith':
                value = convertValueToType(conditionParams[1]);
                predicate = new Predicate(conditionParams[0]).startsWith(value);
                break;
            case 'endswith':
                value = convertValueToType(conditionParams[1]);
                predicate = new Predicate(conditionParams[0]).endsWith(value);
                break;
            case 'substringof':
                value = convertValueToType(conditionParams[0]);
                predicate = new Predicate(conditionParams[1]).contains(value);
                break;
            }

            return predicate;
        }

        conditionParams = condition.split(' ');
        operator = conditionParams[1];
        value = convertValueToType(conditionParams.slice(2).join(' '));

        predicate = new Predicate(conditionParams[0]);

        switch (operator) {
        case 'eq':
            predicate.equals(value);
            break;
        case 'ne':
            predicate.notEqualTo(value);
            break;
        case 'gt':
            predicate.greaterThan(value);
            break;
        case 'ge':
            predicate.greaterThanOrEqualTo(value);
            break;
        case 'lt':
            predicate.lessThan(value);
            break;
        case 'le':
            predicate.lessThanOrEqualTo(value);
            break;
        }
        return predicate;
    };

    /*globals module, define*/
    if (typeof module !== 'undefined' && module.exports) {

        // Expose this class for node.js
        module.exports = Predicate;

    } else if (typeof define === 'function' && define.amd) {

        // Expose this class for requireJS
        define(function () {
            return Predicate;
        });

    } else {

        // Expose this class as a global variable
        this.Predicate = Predicate;
    }

}).call(this);