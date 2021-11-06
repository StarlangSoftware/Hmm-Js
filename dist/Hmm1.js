(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Hmm", "nlptoolkit-math/dist/Vector", "nlptoolkit-math/dist/Matrix"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hmm1 = void 0;
    const Hmm_1 = require("./Hmm");
    const Vector_1 = require("nlptoolkit-math/dist/Vector");
    const Matrix_1 = require("nlptoolkit-math/dist/Matrix");
    class Hmm1 extends Hmm_1.Hmm {
        /**
         * A constructor of {@link Hmm1} class which takes a {@link Set} of states, an array of observations (which also
         * consists of an array of states) and an array of instances (which also consists of an array of emitted symbols).
         * The constructor calls its super method to calculate the emission probabilities for those states.
         *
         * @param states A {@link Set} of states, consisting of all possible states for this problem.
         * @param observations An array of instances, where each instance consists of an array of states.
         * @param emittedSymbols An array of instances, where each instance consists of an array of symbols.
         */
        constructor(states, observations, emittedSymbols) {
            super(states, observations, emittedSymbols);
        }
        /**
         * calculatePi calculates the prior probability vector (initial probabilities for each state) from a set of
         * observations. For each observation, the function extracts the first state in that observation. Normalizing the
         * counts of the states returns us the prior probabilities for each state.
         *
         * @param observations A set of observations used to calculate the prior probabilities.
         */
        calculatePi(observations) {
            this.pi = new Vector_1.Vector(this.stateCount, 0.0);
            for (let observation of observations) {
                let index = this.stateIndexes.get(observation[0]);
                this.pi.addValue(index, 1.0);
            }
            this.pi.l1Normalize();
        }
        /**
         * calculateTransitionProbabilities calculates the transition probabilities matrix from each state to another state.
         * For each observation and for each transition in each observation, the function gets the states. Normalizing the
         * counts of the pair of states returns us the transition probabilities.
         *
         * @param observations A set of observations used to calculate the transition probabilities.
         */
        calculateTransitionProbabilities(observations) {
            this.transitionProbabilities = new Matrix_1.Matrix(this.stateCount, this.stateCount);
            for (let current of observations) {
                for (let j = 0; j < current.length - 1; j++) {
                    let from = this.stateIndexes.get(current[j]);
                    let to = this.stateIndexes.get(current[j + 1]);
                    this.transitionProbabilities.increment(from, to);
                }
            }
            this.transitionProbabilities.columnWiseNormalize();
        }
        /**
         * logOfColumn calculates the logarithm of each value in a specific column in the transition probability matrix.
         *
         * @param column Column index of the transition probability matrix.
         * @return A vector consisting of the logarithm of each value in the column in the transition probability matrix.
         */
        logOfColumn(column) {
            let result = new Vector_1.Vector(0, 0);
            for (let i = 0; i < this.stateCount; i++) {
                result.add(this.safeLog(this.transitionProbabilities.getValue(i, column)));
            }
            return result;
        }
        /**
         * viterbi calculates the most probable state sequence for a set of observed symbols.
         *
         * @param s A set of observed symbols.
         * @return The most probable state sequence as an {@link Array}.
         */
        viterbi(s) {
            let sequenceLength = s.length;
            let gamma = new Matrix_1.Matrix(sequenceLength, this.stateCount);
            let phi = new Matrix_1.Matrix(sequenceLength, this.stateCount);
            let qs = new Vector_1.Vector(sequenceLength, 0);
            let result = new Array();
            /*Initialize*/
            let emission = s[0];
            for (let i = 0; i < this.stateCount; i++) {
                let observationLikelihood = this.states[i].getEmitProb(emission);
                gamma.setValue(0, i, this.safeLog(this.pi.getValue(i)) + this.safeLog(observationLikelihood));
            }
            /*Iterate Dynamic Programming*/
            for (let t = 1; t < sequenceLength; t++) {
                emission = s[t];
                for (let j = 0; j < this.stateCount; j++) {
                    let tempArray = this.logOfColumn(j);
                    tempArray.addVector(gamma.getRowVector(t - 1));
                    let maxIndex = tempArray.maxIndex();
                    let observationLikelihood = this.states[j].getEmitProb(emission);
                    gamma.setValue(t, j, tempArray.getValue(maxIndex) + this.safeLog(observationLikelihood));
                    phi.setValue(t, j, maxIndex);
                }
            }
            /*Backtrack pointers*/
            qs.setValue(sequenceLength - 1, gamma.getRowVector(sequenceLength - 1).maxIndex());
            result.unshift(this.states[qs.getValue(sequenceLength - 1)].getState());
            for (let i = sequenceLength - 2; i >= 0; i--) {
                qs.setValue(i, phi.getValue(i + 1, qs.getValue(i + 1)));
                result.unshift(this.states[qs.getValue(i)].getState());
            }
            return result;
        }
    }
    exports.Hmm1 = Hmm1;
});
//# sourceMappingURL=Hmm1.js.map