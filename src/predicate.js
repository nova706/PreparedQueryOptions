/*
 * Predicate
 * version: 1.2.2
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
     * @param {Function} [getValue] A function that returns the predicate string.
     */
    function Predicate(property, getValue) {
        this.property = property;
        this.getValue = getValue;
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
        this.getValue = function () {
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
        this.getValue = function () {
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
        this.getValue = function () {
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
        this.getValue = function () {
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
        this.getValue = function () {
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
        this.getValue = function () {
            return this.property + ' le ' +  escapeValue(value);
        };
        return this;
    };

    /**
     * Modifies an existing predicate setting the operation to contains and the value to the input parameter
     *
     * @method contains
     * @param {String|Number|Boolean} (value) The value to match.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.contains = function (value) {
        this.getValue = function () {
            return 'contains(' +  this.property + ', ' + escapeValue(value) + ')';
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
        this.getValue = function () {
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
        this.getValue = function () {
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

        if (this.property && typeof this.getValue === 'function') {
            initialPredicate = new Predicate(this.property, this.getValue);
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
            delete this.getValue;
            delete this.property;

            this.joinedPredicates = (this.joinedPredicates) ? this.joinedPredicates.concat(newPredicates) : newPredicates;
            if (groupOperator || !this.groupOperator) {
                this.groupOperator = (groupOperator && groupOperator.toLowerCase() === Predicate.GROUP_OPERATOR.OR) ? Predicate.GROUP_OPERATOR.OR : Predicate.GROUP_OPERATOR.AND;
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
        return this.join(predicates, Predicate.GROUP_OPERATOR.AND);
    };

    /**
     * Joins an existing predicate with additional predicates using the 'or' group operator
     *
     * @method or
     * @param {Predicate|Predicate[]} predicates A single predicate or an array of predicates to join to the existing one.
     * @return {Predicate} Used for chaining function calls
     */
    Predicate.prototype.or = function (predicates) {
        return this.join(predicates, Predicate.GROUP_OPERATOR.OR);
    };

    /**
     * Evaluate an object to see if it matches the predicate filter conditions.
     *
     * @method test
     * @param {Object} object The object to test against the predicate.
     * @return {Boolean} True if the object matches the filter conditions.
     */
    Predicate.prototype.test = function (object) {
        return testPredicate(this, object);
    };

    /**
     * Builds and returns a URL parameter string based on the predicate.
     *
     * @method toString
     * @param {Boolean} [nested = false] Used for building the nested group during recursion
     * @returns {String}
     */
    Predicate.prototype.toString = function (nested) {
        nested = (nested === true);
        var urlString = '';

        if (this.property && typeof this.getValue === 'function') {
            return this.getValue();
        }

        if (this.joinedPredicates && this.joinedPredicates.length > 0) {
            var i;
            var predicate;
            var predicateString;
            for (i = 0; i < this.joinedPredicates.length; i++) {
                predicate = this.joinedPredicates[i];
                predicateString = predicate.toString(true);
                urlString += (i > 0) ? ' ' + this.groupOperator + ' ' + predicateString : predicateString;
            }
        }

        return nested ? '(' + urlString + ')' : urlString;
    };

    /**
     * Utility method for preparedQueryOptions class
     * @returns {Boolean} True
     * @private
     */
    Predicate.prototype._isPredicate = function () {
        return true;
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
        var conditionMatcher = new RegExp("(contains\\(.+?\\)|startswith\\(.+?\\)|endswith\\(.+?\\)|[\\w\\.]+?\\s(?:eq|ne|gt|ge|lt|le)\\s(?:\\w+|\\'.+?\\'))", "g");
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
            if (predicateString.replace(/[0-9]|\s|and|or/gi, "") !== "") {
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
            if (groupString.replace(/[0-9]|\s|and|or/gi, "") !== "") {
                return null;
            }

            // If the group uses both 'and' and 'or' then return null as an invalid predicate string.
            if (groupString.toLowerCase().indexOf(Predicate.GROUP_OPERATOR.AND) >= 0 && groupString.toLowerCase().indexOf(Predicate.GROUP_OPERATOR.OR) >= 0) {
                return null;
            }

            filterIndexes = groupString.match(/[0-9]+/g);
            groupFilters = [];
            for (i = 0; i < filterIndexes.length; i++) {
                groupFilters.push(filters[Number(filterIndexes[i])]);
            }
            operator = groupString.toLowerCase().indexOf(Predicate.GROUP_OPERATOR.OR) >= 0 ? Predicate.GROUP_OPERATOR.OR : Predicate.GROUP_OPERATOR.AND;
            groupPredicate = new Predicate().join(groupFilters, operator);
            filters.push(groupPredicate);
        }

        return groupPredicate;
    };

    Predicate.GROUP_OPERATOR = {
        'OR': 'or',
        'AND': 'and'
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
     * Tests an object to see if the filter conditions match a given predicate. Used for recursive tests.
     *
     * @param {Predicate} predicate
     * @param {Object} object
     */
    var testPredicate = function (predicate, object) {
        var i;
        if (predicate.joinedPredicates && predicate.joinedPredicates.length > 0) {
            var result;
            for (i = 0; i < predicate.joinedPredicates.length; i++) {
                result = testPredicate(predicate.joinedPredicates[i], object);

                // If the operator is 'and' and any of the filters do not match, return false.
                if (predicate.groupOperator === Predicate.GROUP_OPERATOR.AND && result === false) {
                    return false;
                }

                // If the operator is 'or' and any of the filters match, return true.
                if (predicate.groupOperator === Predicate.GROUP_OPERATOR.OR && result === true) {
                    return true;
                }
            }

            // The operator was 'and' and all of the filters matched or the operator was 'or' and none of the filters matched.
            return predicate.groupOperator === Predicate.GROUP_OPERATOR.AND;
        }
        if (predicate.property) {
            var propertyPath = predicate.property.split('.');
            var objectValue = object;
            for (i = 0; i < propertyPath.length; i++) {
                if (objectValue.hasOwnProperty(propertyPath[i])) {
                    objectValue = objectValue[propertyPath[i]];
                } else {
                    return false;
                }
            }
            var condition = predicate.toString();
            var operator;
            var conditionParams;
            var value;

            if (condition.indexOf('(') >= 0) {
                operator = condition.substr(0, condition.indexOf('('));
                var start = condition.indexOf('(') + 1;
                var end = condition.indexOf(')') - start;
                conditionParams = condition.substr(start, end);
                conditionParams = conditionParams.replace(/\'/g, '').split(', ');

                objectValue = objectValue.toString().toLowerCase();

                switch (operator) {
                case 'startswith':
                    value = conditionParams[1].toLowerCase();
                    return (objectValue.indexOf(value) === 0);
                case 'endswith':
                    value = conditionParams[1].toLowerCase();
                    return (objectValue.indexOf(value) === objectValue.length - 1 - value.length);
                case 'contains':
                    value = conditionParams[1].toLowerCase();
                    return (objectValue.indexOf(value) >= 0);
                }

                return false;
            }

            conditionParams = condition.split(' ');
            operator = conditionParams[1];

            value = conditionParams.slice(2);
            value = value.join(' ');
            if (value.indexOf("'") >= 0) {

                // The value is a string
                value = value.replace(/\'/g, '');
            } else if (!isNaN(value)) {

                // The value is a number
                value = Number(value);
            } else if (value.toLowerCase() === 'false') {

                // The value is a boolean
                value = false;
            } else if (value.toLowerCase() === 'true') {

                // The value is a boolean
                value = true;
            }

            var resultValue = objectValue;
            if (resultValue instanceof Date && !isNaN(Date.parse(value))) {
                value = Date.parse(value);
            } else if (typeof resultValue === 'string' && !isNaN(Date.parse(resultValue) && !isNaN(Date.parse(value)))) {
                resultValue = Date.parse(resultValue);
                value = Date.parse(value);
            }

            switch (operator) {
            case 'lt':
                return resultValue < value;
            case 'gt':
                return resultValue > value;
            case 'le':
                return resultValue <= value;
            case 'ge':
                return resultValue >= value;
            case 'ne':
                return resultValue != value;
            case 'eq':
                return resultValue == value;
            }
        }

        return false;
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
            case 'contains':
                value = convertValueToType(conditionParams[1]);
                predicate = new Predicate(conditionParams[0]).contains(value);
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