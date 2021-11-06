import * as assert from "assert";
import {Hmm2} from "../dist/Hmm2";

describe('Hmm2Test', function() {
    describe('Hmm2Test', function() {
        it('testViterbi', function() {
            let states = new Set<string>()
            states.add("HOT")
            states.add("COLD")
            let observations = [["HOT", "HOT", "HOT"],
                ["HOT", "COLD", "COLD", "COLD"],
                ["HOT", "COLD", "HOT", "COLD"],
                ["COLD", "COLD", "COLD", "HOT", "HOT"],
                ["COLD", "HOT", "HOT", "COLD", "COLD"]]
            let emittedSymbols = [[3, 2, 3],
                [2, 2, 1, 1],
                [3, 1, 2, 1],
                [3, 1, 2, 2, 3],
                [1, 2, 3, 2, 1]]
            let hmm = new Hmm2<string, number>(states, observations, emittedSymbols)
            let observed = [1, 1, 1, 1, 1, 1]
            let observedStates = hmm.viterbi(observed)
            assert.strictEqual("COLD", observedStates[0])
            assert.strictEqual("COLD", observedStates[1])
            assert.strictEqual("COLD", observedStates[2])
            assert.strictEqual("COLD", observedStates[3])
            assert.strictEqual("COLD", observedStates[4])
            assert.strictEqual("COLD", observedStates[5])
            observed = [1, 2, 3, 3, 2, 1]
            observedStates = hmm.viterbi(observed)
            assert.strictEqual("COLD", observedStates[0])
            assert.strictEqual("HOT", observedStates[1])
            assert.strictEqual("HOT", observedStates[2])
            assert.strictEqual("HOT", observedStates[3])
            assert.strictEqual("HOT", observedStates[4])
            assert.strictEqual("COLD", observedStates[5])
            observed = [3, 3, 3, 3, 3, 3]
            observedStates = hmm.viterbi(observed)
            assert.strictEqual("HOT", observedStates[0])
            assert.strictEqual("HOT", observedStates[1])
            assert.strictEqual("HOT", observedStates[2])
            assert.strictEqual("HOT", observedStates[3])
            assert.strictEqual("HOT", observedStates[4])
            assert.strictEqual("HOT", observedStates[5])
        });
    });
});
