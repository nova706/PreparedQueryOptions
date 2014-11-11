/*
 * PreparedQueryOptions
 * version: 1.1.0
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
    function PreparedQueryOptions() {
        /**
         * Stores the query options that have been set.
         * @property options
         * @type Object
         * @default {}
         */
        this.options = {};
    }

    var isPredicate = function (object) {
        return typeof object === "object" && typeof object.parsePredicate === "function";
    };

    /**
     * Sets the number of results to retrieve.
     *
     * @method $top
     * @param {Number} top Number of results to query for.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.$top = function (top) {
        if (typeof top === 'number' && top >= 0) {
            this.options.$top = top;
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
            this.options.$skip = skip;
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
            this.options.$orderby = orderBy;
        }
        return this;
    };

    /**
     * Sets expand string.
     *
     * @method $expand
     * @param {String | Array} foreignKey The foreignKey to expand when retrieving the results.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.$expand = function (foreignKey) {
        if (typeof foreignKey === 'string') {
            this.options.$expand = foreignKey;
        } else if (foreignKey instanceof Array) {
            this.options.$expand = foreignKey.join(',');
        }
        return this;
    };

    /**
     * Sets select string.
     *
     * @method $select
     * @param {String | Array} property A single property name or array of property names to select.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.$select = function (property) {
        if (typeof property === 'string') {
            this.options.$select = property;
        } else if (property instanceof Array) {
            this.options.$select = property.join(',');
        }
        return this;
    };

    /**
     * Enables or disables inline count.
     *
     * @method $inlineCount
     * @param {Boolean} [enable=true] Flag to enable or disable inline count.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.$inlineCount = function (enable) {
        if (enable !== false) {
            this.options.$inlinecount = "allpages";
        } else {
            delete this.options.$inlinecount;
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
        if (filter && typeof filter === 'string') {
            this.options.$filter = filter;
        } else if (isPredicate(filter)) {
            this.options.$filter = filter.parsePredicate();
        }
        return this;
    };

    /**
     * Sets a custom query option parameter.
     *
     * @method custom
     * @param {String} optionName The name of the option. Must not start with '$'.
     * @param {String} value The string value of the option.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.custom = function (optionName, value) {
        if (optionName && typeof optionName === 'string' && optionName.indexOf('$') !== 0 && value && typeof value === 'string') {
            this.options[optionName] = value;
        }
        return this;
    };

    /**
     * Extend existing query with options from another query. Only the original query will be modified. Any
     * matching options will be overridden in the original query.
     *
     * @method extend
     * @param {PreparedQueryOptions} preparedQueryOptions The prepared query objects with the properties to be added.
     * @return {PreparedQueryOptions} PreparedQueryOptions object.
     */
    PreparedQueryOptions.prototype.extend = function (preparedQueryOptions) {
        var key;
        for (key in preparedQueryOptions.options) {
            if (preparedQueryOptions.options.hasOwnProperty(key)) {
                this.options[key] = preparedQueryOptions.options[key];
            }
        }
        return this;
    };

    /**
     * Builds and returns a URL parameter string based on the query options.
     *
     * @method parseOptions
     * @returns {String}
     * @example '$top=25&$skip=0'
     */
    PreparedQueryOptions.prototype.parseOptions = function () {
        var parameters = '';

        var appendSeparator = function () {
            parameters += (parameters === '') ? '?' : '&';
        };

        var option;
        for (option in this.options) {
            if (this.options.hasOwnProperty(option)) {
                appendSeparator();
                if (isPredicate(this.options[option])) {
                    parameters += option + '=' + this.options[option].parsePredicate();
                } else {
                    parameters += option + '=' + this.options[option];
                }
            }
        }

        return parameters;
    };

    /**
     * Class method to create a new PreparedQueryOptions object from a simple object
     *
     * @method fromObject
     * @param {Object} object the object to build from
     * @returns {PreparedQueryOptions}
     */
    PreparedQueryOptions.fromObject = function (object) {
        var preparedQueryOptions = new PreparedQueryOptions();
        var property;
        for (property in object) {
            if (object.hasOwnProperty(property) && typeof preparedQueryOptions[property] === "function") {
                preparedQueryOptions[property](object[property]);
            }
        }
        return preparedQueryOptions;
    };

    /*globals module, define*/
    if (typeof module !== 'undefined' && module.exports) {

        // Expose this class for node.js
        module.exports = PreparedQueryOptions;

    } else if (typeof define === 'function' && define.amd) {

        // Expose this class for requireJS
        define(function () {
            return PreparedQueryOptions;
        });

    } else {

        // Expose this class as a global variable
        this.PreparedQueryOptions = PreparedQueryOptions;
    }

}).call(this);