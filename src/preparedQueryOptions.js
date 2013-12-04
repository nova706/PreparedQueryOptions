/*
 * PreparedQueryOptions
 * version: 1.0
 * author: David Hamilton
 * license: https://github.com/nova706/PreparedQueryOptions/blob/master/LICENSE.txt (MIT)
 * https://github.com/nova706/PreparedQueryOptions
 *
 */

(function () {

    /**
     * PreparedQueryOptions are used to set, store and parse OData query parameters. Instead of passing
     * multiple arguments to methods for each query option, simply pass the preparedQueryOptions object.
     * Use the parseOptions method on the object to return an OData string for a query.
     *
     * @class PreparedQueryOptions
     * @constructor
     */
    function PreparedQueryOptions () {
        /**
         * Stores the query options that have been set.
         * @property arguments
         * @type Object
         * @default {}
         */
        this.arguments = {};
    }

    /**
     * Sets the number of results to retrieve.
     *
     * @method $top
     * @param {Number} top Number of results to query for.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.$top = function (top) {
        if (typeof top === 'number' && top >= 0) {
            this.arguments.$top = top;
        }
        return this;
    };

    /**
     * Sets the index of the first result to retrieve.
     *
     * @method $skip
     * @param {Number} skip The index of the first result to retrieve
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.$skip = function (skip) {
        if (typeof skip === 'number' && skip >= 0) {
            this.arguments.$skip = skip;
        }
        return this;
    };

    /**
     * Sets orderBy string.
     *
     * @method $orderBy
     * @param {String} orderBy The orderBy string used to retrieve the results in a sorted order.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.$orderBy = function (orderBy) {
        if (orderBy && typeof orderBy === 'string') {
            this.arguments.$orderBy = orderBy;
        }
        return this;
    };

    /**
     * Sets expand string.
     *
     * @method $expand
     * @param {String} foreignKey The foreignKey to expand when retrieving the results.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.$expand = function (foreignKey) {
        if (foreignKey && typeof foreignKey === 'string') {
            this.arguments.$expand = foreignKey;
        }
        return this;
    };

    /**
     * Sets the filter option. Include the Predicate class to assist in building complex filter clauses.
     *
     * @method $filter
     * @param {String | Predicate} filter The filter clause to use when retrieving the results.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.$filter = function (filter) {
        if (filter && (typeof filter === 'string' || (typeof Predicate !== "undefined" && filter instanceof Predicate))) {
            this.arguments.$filter = filter;
        }
        return this;
    };

    /**
     * Extend existing query with arguments from another query. Only the original query will be modified. Any
     * matching arguments will be overridden in the original query.
     *
     * @method extend
     * @param {PreparedQueryOptions} preparedQueryOptions The prepared query objects with the properties to be added.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.extend = function(preparedQueryOptions) {
        var key;
        for (key in preparedQueryOptions.arguments) {
            if (preparedQueryOptions.arguments.hasOwnProperty(key)) {
                this.arguments[key] = preparedQueryOptions.arguments[key];
            }
        }
        return this;
    };

    /**
     * Builds and returns a URL parameter string based on the query arguments.
     *
     * @method parseOptions
     * @returns {String}
     * @example '$top=25&$skip=0'
     */
    PreparedQueryOptions.prototype.parseOptions = function() {
        var parameters = '';

        var appendSeparator = function () {
            parameters += (parameters === '') ? '?' : '&';
        };

        var argument;
        for (argument in this.arguments) {
            if (this.arguments.hasOwnProperty(argument)) {
                appendSeparator();
                if (typeof Predicate !== "undefined" && this.arguments[argument] instanceof Predicate && typeof this.arguments[argument].parsePredicate === 'function') {
                    parameters += argument + '=' + this.arguments[argument].parsePredicate();
                } else {
                    parameters += argument + '=' + this.arguments[argument];
                }
            }
        }

        return parameters;
    };

    // Expose this class for node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PreparedQueryOptions;
    }

    // Expose this class for requireJS
    else if (typeof define === "function" && define.amd) {
        define(function () {
            return PreparedQueryOptions;
        });
    }

    // Expose this class as a global variable
    else {
        this['PreparedQueryOptions'] = PreparedQueryOptions;
    }

}).call(this);