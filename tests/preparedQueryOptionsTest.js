/*globals require, describe, it*/

var PreparedQueryOptions = require("../src/preparedQueryOptions"),
    Predicate = require("../src/predicate"),
    should = require("chai").should();

describe("PreparedQueryOptions", function () {

    var preparedQueryOptions;

    describe(".$top()", function () {
        it("Should require a number greater than or equal to 0", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$top(-1);

            should.not.exist(preparedQueryOptions.options.$top);

            preparedQueryOptions.$top('string');

            should.not.exist(preparedQueryOptions.options.$top);

            preparedQueryOptions.$top(0);

            preparedQueryOptions.options.$top.should.equal(0);
        });

        it("Should return preparedQueryOptions", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$top(10);

            should.exist(preparedQueryOptions.options);
        });
    });

    describe(".$skip()", function () {
        it("Should require a number greater than or equal to 0", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$skip(-1);

            should.not.exist(preparedQueryOptions.options.$skip);

            preparedQueryOptions.$skip('string');

            should.not.exist(preparedQueryOptions.options.$skip);

            preparedQueryOptions.$skip(0);

            preparedQueryOptions.options.$skip.should.equal(0);
        });

        it("Should return preparedQueryOptions", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$skip(10);

            should.exist(preparedQueryOptions.options);
        });
    });

    describe(".$orderBy()", function () {
        it("Should require a string", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$orderBy(0);

            should.not.exist(preparedQueryOptions.options.$orderBy);

            preparedQueryOptions.$orderBy('column');

            preparedQueryOptions.options.$orderBy.should.equal('column');
        });

        it("Should return preparedQueryOptions", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$orderBy('column');

            should.exist(preparedQueryOptions.options);
        });
    });

    describe(".$expand()", function () {
        it("Should take a string", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$expand(0);

            should.not.exist(preparedQueryOptions.options.$expand);

            preparedQueryOptions.$expand('foreignKey');

            preparedQueryOptions.options.$expand.should.equal('foreignKey');
        });

        it("Should take an array of strings", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$expand(['test', 'test2']);
            preparedQueryOptions.options.$expand.should.equal('test,test2');
        });

        it("Should return preparedQueryOptions", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$expand('foreignKey');

            should.exist(preparedQueryOptions.options);
        });
    });

    describe(".$filter()", function () {
        it("Should take a string", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$filter(0);

            should.not.exist(preparedQueryOptions.options.$filter);

            preparedQueryOptions.$filter('age gt 21');

            preparedQueryOptions.options.$filter.should.equal('age gt 21');
        });

        it("Should take a Predicate", function () {
            var pred = new Predicate('age').greaterThan(21);
            var fakePredicate = {
                prop: "test"
            };
            preparedQueryOptions = new PreparedQueryOptions();

            preparedQueryOptions.$filter(fakePredicate);
            should.not.exist(preparedQueryOptions.options.$filter);

            preparedQueryOptions.$filter(pred);
            preparedQueryOptions.options.$filter.should.equal('age gt 21');
        });

        it("Should return preparedQueryOptions", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$filter('clause');

            should.exist(preparedQueryOptions.options);
        });
    });

    describe(".extend()", function () {
        it("Should return the preparedQueryOptions with extended options", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$filter('clause');

            var moreOptions = new PreparedQueryOptions();
            moreOptions.$skip(10);

            preparedQueryOptions.options.$filter.should.equal('clause');
            should.not.exist(preparedQueryOptions.options.$skip);

            preparedQueryOptions.extend(moreOptions);

            preparedQueryOptions.options.$filter.should.equal('clause');
            preparedQueryOptions.options.$skip.should.equal(10);
        });

        it("Should not alter the preparedQueryOptions that are passed in", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$filter('clause');

            var moreOptions = new PreparedQueryOptions();
            moreOptions.$skip(10);

            preparedQueryOptions.extend(moreOptions);
            should.not.exist(moreOptions.options.$filter);
        });

        it("Should override existing options", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$skip(0);

            var moreOptions = new PreparedQueryOptions();
            moreOptions.$skip(10);

            preparedQueryOptions.extend(moreOptions);
            preparedQueryOptions.options.$skip.should.equal(10);
        });
    });

    describe(".parseOptions()", function () {
        it("Should return a proper URL parameter string for the set of options", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$expand('foreignKey');
            preparedQueryOptions.$orderBy('column');
            preparedQueryOptions.$skip(0);
            preparedQueryOptions.$top(10);
            preparedQueryOptions.$filter('clause');

            var paramString = preparedQueryOptions.parseOptions();
            paramString.should.equal("?$expand=foreignKey&$orderBy=column&$skip=0&$top=10&$filter=clause");
        });

        it("Should return a proper URL parameter string for a predicate", function () {
            var pred = new Predicate('age').greaterThan(21);
            var expected = pred.parsePredicate();

            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$filter(pred);

            var paramString = preparedQueryOptions.parseOptions();
            paramString.should.equal("?$filter=" + expected);
        });
    });

    describe("class.fromObject()", function () {
        it("Should return a preparedQueryOptions object from a simple object", function () {
            var obj = {
                foo: "bar",
                "$top": 10,
                $skip: 20,
                $filter: "prop gt 'value'"
            };

            var preparedQueryOptions = PreparedQueryOptions.fromObject(obj);

            var paramString = preparedQueryOptions.parseOptions();
            paramString.should.equal("?$top=10&$skip=20&$filter=prop gt 'value'");
        });
    });

});