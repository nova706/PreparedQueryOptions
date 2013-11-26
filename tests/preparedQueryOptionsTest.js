var PreparedQueryOptions = require("../lib/preparedQueryOptions").PreparedQueryOptions,
    should = require("chai").should();

describe("PreparedQueryOptions", function () {

    var preparedQueryOptions;

    describe(".$top()", function () {
        it("Should require a number greater than or equal to 0", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$top(-1);

            should.not.exist(preparedQueryOptions.arguments.$top);

            preparedQueryOptions.$top('string');

            should.not.exist(preparedQueryOptions.arguments.$top);

            preparedQueryOptions.$top(0);

            preparedQueryOptions.arguments.$top.should.equal(0);
        });

        it("Should return preparedQueryOptions", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$top(10);

            should.exist(preparedQueryOptions.arguments);
        });
    });

    describe(".$skip()", function () {
        it("Should require a number greater than or equal to 0", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$skip(-1);

            should.not.exist(preparedQueryOptions.arguments.$skip);

            preparedQueryOptions.$skip('string');

            should.not.exist(preparedQueryOptions.arguments.$skip);

            preparedQueryOptions.$skip(0);

            preparedQueryOptions.arguments.$skip.should.equal(0);
        });

        it("Should return preparedQueryOptions", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$skip(10);

            should.exist(preparedQueryOptions.arguments);
        });
    });

    describe(".$orderBy()", function () {
        it("Should require a string", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$orderBy(0);

            should.not.exist(preparedQueryOptions.arguments.$orderBy);

            preparedQueryOptions.$orderBy('column');

            preparedQueryOptions.arguments.$orderBy.should.equal('column');
        });

        it("Should return preparedQueryOptions", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$orderBy('column');

            should.exist(preparedQueryOptions.arguments);
        });
    });

    describe(".$expand()", function () {
        it("Should require a string", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$expand(0);

            should.not.exist(preparedQueryOptions.arguments.$expand);

            preparedQueryOptions.$expand('foreignKey');

            preparedQueryOptions.arguments.$expand.should.equal('foreignKey');
        });

        it("Should return preparedQueryOptions", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$expand('foreignKey');

            should.exist(preparedQueryOptions.arguments);
        });
    });

    describe(".$filter()", function () {
        it("Should take a string", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$filter(0);

            should.not.exist(preparedQueryOptions.arguments.$filter);

            preparedQueryOptions.$filter('column asc');

            preparedQueryOptions.arguments.$filter.should.equal('column asc');
        });

        it("Should return preparedQueryOptions", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$filter('clause');

            should.exist(preparedQueryOptions.arguments);
        });
    });

    describe(".extend()", function () {
        it("Should return the preparedQueryOptions with extended options", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$filter('clause');

            var moreOptions = new PreparedQueryOptions();
            moreOptions.$skip(10);

            preparedQueryOptions.arguments.$filter.should.equal('clause');
            should.not.exist(preparedQueryOptions.arguments.$skip);

            preparedQueryOptions.extend(moreOptions);

            preparedQueryOptions.arguments.$filter.should.equal('clause');
            preparedQueryOptions.arguments.$skip.should.equal(10);
        });

        it("Should not alter the preparedQueryOptions that are passed in", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$filter('clause');

            var moreOptions = new PreparedQueryOptions();
            moreOptions.$skip(10);

            preparedQueryOptions.extend(moreOptions);
            should.not.exist(moreOptions.arguments.$filter);
        });

        it("Should override existing options", function () {
            preparedQueryOptions = new PreparedQueryOptions();
            preparedQueryOptions.$skip(0);

            var moreOptions = new PreparedQueryOptions();
            moreOptions.$skip(10);

            preparedQueryOptions.extend(moreOptions);
            preparedQueryOptions.arguments.$skip.should.equal(10);
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
    });

});