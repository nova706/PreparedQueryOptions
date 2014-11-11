/*
 * Predicate
 * version: 1.1.0
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
     * @param {String} property The property to filter by.
     * @param {Function} [parser] A function that returns the predicate string.
     */
    function Predicate(property, parser) {
        this.property = property;
        this.parser = parser;
        return this;
    }

    /**
     * Takes a predicate's value and if it is a string, adds single quotes around it.
     *
     * @method escapeValue
     * @param {String|Boolean|Number} value
     * @returns {string} The string value
     */
    Predicate.escapeValue = function (value) {
        return (typeof value === 'string') ? "'" + value + "'" : value.toString();
    };

    /**
     * Returns the raw value of the predicate string
     *
     * @method convertValueToType
     * @param {String} value
     * @returns {String|Boolean|Number}
     */
    Predicate.convertValueToType = function (value) {
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
     * Modifies an existing predicate setting the operator to 'eq' and the value to the input parameter
     *
     * @method equals
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.equals = function (value) {
        this.parser = function () {
            return this.property + ' eq ' + Predicate.escapeValue(value);
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
            return this.property + ' ne ' +  Predicate.escapeValue(value);
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
            return this.property + ' gt ' +  Predicate.escapeValue(value);
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
            return this.property + ' ge ' +  Predicate.escapeValue(value);
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
            return this.property + ' lt ' +  Predicate.escapeValue(value);
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
            return this.property + ' le ' +  Predicate.escapeValue(value);
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
            return 'substringof(' +  Predicate.escapeValue(value) + ', ' + this.property + ')';
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
            return 'startswith(' + this.property + ', ' +  Predicate.escapeValue(value) + ')';
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
            return 'endswith(' + this.property + ', ' +  Predicate.escapeValue(value) + ')';
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

            this.joinedPredicates = newPredicates;
            this.groupOperator = (groupOperator === 'or') ? 'or' : 'and';
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
        return buildFilterGroup(predicateString);
    };

    /**
     * Creates a predicate from a single condition eg: "property eq 'value'"
     *
     * @param {String} condition
     * @return {Predicate} The predicate built from the condition
     */
    var getPredicateFromSegment = function (condition) {
        var parenPos = condition.indexOf('(');
        var predicate;
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
                value = Predicate.convertValueToType(conditionParams[1]);
                predicate = new Predicate(conditionParams[0]).startsWith(value);
                break;
            case 'endswith':
                value = Predicate.convertValueToType(conditionParams[1]);
                predicate = new Predicate(conditionParams[0]).endsWith(value);
                break;
            default:
                value = Predicate.convertValueToType(conditionParams[0]);
                predicate = new Predicate(conditionParams[1]).contains(value);
                break;
            }

            return predicate;
        }

        conditionParams = condition.split(' ');
        operator = conditionParams[1];
        value = Predicate.convertValueToType(conditionParams.slice(2).join(' '));

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
        default:
            predicate.equals(value);
            break;
        }
        return predicate;
    };

    /**
     * Creates a predicate using the $filter URL parameter
     *
     * @param {String} filterString The string representing the $filter URL parameter.
     * @param {Boolean} [first = true] Recursively builds a set of predicates from a string.
     * @param {Predicate} [outerPredicate = null] The predicate that nested predicates should be joined to.
     * @param {Predicate} [firstPredicate = null] The root predicate used for joining.
     * @returns {Predicate|null} Returns null if the predicate could not be built
     */
    var buildFilterGroup = function (filterString, first, outerPredicate, firstPredicate) {
        first = (first !== false);

        var andIndex = filterString.indexOf(' and ');
        var orIndex = filterString.indexOf(' or ');
        var parenIndex = filterString.indexOf('(');
        var predicate;

        if ((andIndex && andIndex >= 0) || (orIndex && orIndex >= 0)) {
            var isAnd = (andIndex >= 0 && (andIndex < orIndex || orIndex === -1));
            var expressionStartIndex = (parenIndex === 0) ? 1 : 0;
            var expressionEndIndex = isAnd ? andIndex : orIndex;
            var nextExpressionStartIndex = isAnd ? andIndex + 5 : orIndex + 4;

            predicate = getPredicateFromSegment(filterString.substring(expressionStartIndex, expressionEndIndex));
            if (first) {
                firstPredicate = predicate;
            }
            predicate.groupOperator = isAnd ? 'and' : 'or';

            if (outerPredicate) {
                if (outerPredicate.groupOperator === 'and') {
                    outerPredicate.join(predicate, 'and');
                } else {
                    outerPredicate.join(predicate, 'or');
                }
            }

            if (first || parenIndex === 0) {
                outerPredicate = predicate;
            }

            if (nextExpressionStartIndex < filterString.length) {
                buildFilterGroup(filterString.substring(nextExpressionStartIndex), false, outerPredicate, firstPredicate);
            }

        } else {
            predicate = getPredicateFromSegment(filterString);
            if (first) {
                firstPredicate = predicate;
            }

            if (outerPredicate) {
                if (outerPredicate.groupOperator === 'and') {
                    outerPredicate.join(predicate, 'and');
                } else {
                    outerPredicate.join(predicate, 'or');
                }
            }
        }

        return firstPredicate;
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