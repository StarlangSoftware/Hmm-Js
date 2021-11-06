(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./HmmState", "nlptoolkit-datastructure/dist/CounterHashMap"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hmm = void 0;
    const HmmState_1 = require("./HmmState");
    const CounterHashMap_1 = require("nlptoolkit-datastructure/dist/CounterHashMap");
    class Hmm {
        /**
         * A constructor of {@link Hmm} class which takes a {@link Set} of states, an array of observations (which also
         * consists of an array of states) and an array of instances (which also consists of an array of emitted symbols).
         * The constructor initializes the state array with the set of states and uses observations and emitted symbols
         * to calculate the emission probabilities for those states.
         *
         * @param states A {@link Set} of states, consisting of all possible states for this problem.
         * @param observations An array of instances, where each instance consists of an array of states.
         * @param emittedSymbols An array of instances, where each instance consists of an array of symbols.
         */
        constructor(states, observations, emittedSymbols) {
            let i = 0;
            this.stateCount = states.size;
            this.states = new Array();
            this.stateIndexes = new Map();
            for (let state of states) {
                this.stateIndexes.set(state, i);
                i++;
            }
            this.calculatePi(observations);
            i = 0;
            for (let state of states) {
                let emissionProbabilities = this.calculateEmissionProbabilities(state, observations, emittedSymbols);
                this.states[i] = new HmmState_1.HmmState(state, emissionProbabilities);
                i++;
            }
            this.calculateTransitionProbabilities(observations);
        }
        /**
         * calculateEmissionProbabilities calculates the emission probabilities for a specific state. The method takes the state,
         * an array of observations (which also consists of an array of states) and an array of instances (which also consists
         * of an array of emitted symbols).
         *
         * @param state The state for which emission probabilities will be calculated.
         * @param observations An array of instances, where each instance consists of an array of states.
         * @param emittedSymbols An array of instances, where each instance consists of an array of symbols.
         * @return A {@link Map} Emission probabilities for a single state. Contains a probability for each symbol emitted.
         */
        calculateEmissionProbabilities(state, observations, emittedSymbols) {
            let counts = new CounterHashMap_1.CounterHashMap();
            let emissionProbabilities = new Map();
            for (let i = 0; i < observations.length; i++) {
                for (let j = 0; j < observations[i].length; j++) {
                    let currentState = observations[i][j];
                    let currentSymbol = emittedSymbols[i][j];
                    if (currentState == state) {
                        counts.put(currentSymbol);
                    }
                }
            }
            let sum = counts.sumOfCounts();
            for (let symbol of counts.keys()) {
                emissionProbabilities.set(symbol, counts.get(symbol) / sum);
            }
            return emissionProbabilities;
        }
        /**
         * safeLog calculates the logarithm of a number. If the number is less than 0, the logarithm is not defined, therefore
         * the function returns -Infinity.
         *
         * @param x Input number
         * @return the logarithm of x. If x less than 0 return -infinity.
         */
        safeLog(x) {
            if (x <= 0) {
                return Number.NEGATIVE_INFINITY;
            }
            else {
                return Math.log(x);
            }
        }
    }
    exports.Hmm = Hmm;
});
//# sourceMappingURL=Hmm.js.map