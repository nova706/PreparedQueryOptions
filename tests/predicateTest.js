var Predicate = require("../lib/predicate").Predicate,
    should = require("chai").should();

describe("Predicate", function () {

    var predicate;

    describe("Constructing a new Predicate", function () {
        it("Should initialize the predicate properties", function () {
            predicate = new Predicate("property", "op", "value");

            predicate.joinedPredicates.length.should.equal(0);
            predicate.property.should.equal("property");
            predicate.operator.should.equal("op");
            predicate.value.should.equal("value");
        });
    });

    describe("Class level .join()", function () {
        it("Should create and return new Predicate", function () {
            var first = new Predicate("property1", "op", "value");
            var second = new Predicate("property2", "op", "value");
            var returned = Predicate.join([first, second]);

            should.equal(true, returned instanceof Predicate);
        });

        it("Should only accept an array of predicates", function () {
            var first = new Predicate("property1", "op", "value");
            var second = new Predicate("property2", "op", "value");
            var returned;

            returned = Predicate.join("string");
            should.equal(null, returned);

            returned = Predicate.join(first);
            should.equal(null, returned);

            returned = Predicate.join(1);
            should.equal(null, returned);

            returned = Predicate.join([first, second]);
            returned.joinedPredicates.length.should.equal(2);
        });

        it("Should add the predicates to the predicates array", function () {
            var first = new Predicate("property1", "op", "value");
            var second = new Predicate("property2", "op", "value");
            var returned = Predicate.join([first, second]);

            returned.joinedPredicates.length.should.equal(2);
            returned.joinedPredicates[0].property.should.equal("property1");
            returned.joinedPredicates[1].property.should.equal("property2");
        });
    });

    describe("Instance level .join()", function () {
        it("Should return the original predicate", function () {
            var predicate = new Predicate("property1", "op", "value");
            var additional = new Predicate("property2", "op", "value");
            var returned = predicate.join(additional);

            should.equal(returned, predicate);
        });

        it("Should clear the values of the original predicate", function () {
            var predicate = new Predicate("property1", "op", "value");
            var additional = new Predicate("property2", "op", "value");
            predicate.join(additional);

            should.equal(null, predicate.property);
            should.equal(null, predicate.operator);
            should.equal(null, predicate.value);
        });

        it("Should accept a predicate", function () {
            var predicate = new Predicate("property1", "op", "value");
            var additional = new Predicate("property2", "op", "value");

            predicate.join("string");
            predicate.joinedPredicates.length.should.equal(0);

            predicate.join(1);
            predicate.joinedPredicates.length.should.equal(0);

            predicate.join(additional);
            predicate.joinedPredicates.length.should.equal(2);
        });

        it("Should accept an array of predicates", function () {
            var predicate = new Predicate("property1", "op", "value");
            var additional1 = new Predicate("property2", "op", "value");
            var additional2 = new Predicate("property3", "op", "value");

            predicate.join("string");
            predicate.joinedPredicates.length.should.equal(0);

            predicate.join(1);
            predicate.joinedPredicates.length.should.equal(0);

            predicate.join([additional1, additional2]);
            predicate.joinedPredicates.length.should.equal(3);
        });

        it("Should add the predicates to the predicates array", function () {
            var predicate = new Predicate("property1", "op", "value");
            var additional = new Predicate("property2", "op", "value");
            predicate.join(additional);

            predicate.joinedPredicates.length.should.equal(2);
            predicate.joinedPredicates[0].property.should.equal("property1");
            predicate.joinedPredicates[1].property.should.equal("property2");
        });
    });

    describe(".parsePredicate()", function () {
        it("Should return a string for a simple predicate", function () {
            var predicate = new Predicate("property1", "op", "value");
            var urlString = predicate.parsePredicate();

            urlString.should.equal("property1 op 'value'");
        });

        it("Should quote string values", function () {
            var predicate = new Predicate("property1", "op", "value");
            var urlString = predicate.parsePredicate();

            urlString.should.equal("property1 op 'value'");
        });

        it("Should not quote int values", function () {
            var predicate = new Predicate("property1", "op", 1);
            var urlString = predicate.parsePredicate();

            urlString.should.equal("property1 op 1");
        });

        it("Should not quote boolean values", function () {
            var predicate = new Predicate("property1", "op", true);
            var urlString = predicate.parsePredicate();

            urlString.should.equal("property1 op true");

            predicate = new Predicate("property1", "op", false);
            urlString = predicate.parsePredicate();

            urlString.should.equal("property1 op false");
        });

        it("Should return a string when an existing predicate is joined", function () {
            var predicate = new Predicate("property1", "op", "value");
            var additional = new Predicate("property2", "op", 1);
            predicate.join(additional);

            var urlString = predicate.parsePredicate();

            urlString.should.equal("property1 op 'value' and property2 op 1");
        });

        it("Should return a string when predicates are joined", function () {
            var predicate = new Predicate("property1", "op", "value");
            var additional = new Predicate("property2", "op", false);
            var joinedPredicate = Predicate.join([predicate, additional]);

            var urlString = joinedPredicate.parsePredicate();

            urlString.should.equal("property1 op 'value' and property2 op false");
        });
    });
});