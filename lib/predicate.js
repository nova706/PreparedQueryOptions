/**
 * A predicate is used for the $filter operator in a query. Predicates can be joined to query
 * using a group of filters with the 'and' operator.
 *
 * This is a helper class for the PreparedQueryOptions class to assist in building complex
 * filter clauses.
 *
 * @class Predicate
 * @constructor
 * @param {String} (property) The property to filter by.
 * @param {String} (operator) The operator used to filter.
 * @param {String|Number|Boolean} (value) The value to match.
 */
function Predicate (property, operator, value) {

    /**
     * The stored predicates if the predicate was create from a join.
     * @property joinedPredicates
     * @type Array
     * @default []
     */
    this.joinedPredicates = [];
    this.property = property;
    this.operator = operator;
    this.value = value;
}

/**
 * Joins a provided set of predicates using the 'and' operator and returns a new Predicate
 *
 * @method join
 * @param {Predicate[]} predicates Array of predicates to join.
 * @return {Predicate} Predicate object.
 */
Predicate.join = function (predicates) {
    if (predicates instanceof Array && predicates.length > 0) {
        var joinedPredicate = new Predicate();
        joinedPredicate.joinedPredicates = predicates;
        return joinedPredicate;
    }
    return null;
};

/**
 * Joins an existing predicate with additional predicates using the 'and' operator
 *
 * @method join
 * @param {Predicate|Predicate[]} predicates A single predicate or an array of predicates to join to the existing one.
 * @return {Predicate} Predicate object.
 */
Predicate.prototype.join = function (predicates) {
    var initialPredicate = new Predicate(this.property, this.operator, this.value);
    this.property = null;
    this.operator = null;
    this.value = null;

    if (predicates instanceof Predicate) {
        this.joinedPredicates = [initialPredicate, predicates];
    } else if (predicates instanceof Array && predicates.length > 0) {
        predicates.unshift(initialPredicate);
        this.joinedPredicates = predicates;
    }
    return this;
};

/**
 * Builds and returns a URL parameter string based on the predicate.
 *
 * @method parsePredicate
 * @returns {String}
 */
Predicate.prototype.parsePredicate = function () {
    var urlString = '';

    if (this.property && this.operator && this.value !== null) {
        var value = (typeof this.value === 'string') ? "'" + this.value + "'" : this.value.toString();
        return this.property + " " + this.operator + " " + value;
    }

    if (this.joinedPredicates.length > 0) {
        var i;
        var predicate;
        var predicateString;
        for (i = 0; i < this.joinedPredicates.length; i++) {
            predicate = this.joinedPredicates[i];
            predicateString = predicate.parsePredicate();
            urlString += (i > 0) ? ' and ' + predicateString : predicateString;
        }
    }

    return urlString;
};

if (typeof exports !== "undefined") {
    exports.Predicate = Predicate;
}