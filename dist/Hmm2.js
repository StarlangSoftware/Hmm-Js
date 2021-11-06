(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Hmm", "nlptoolkit-math/dist/Matrix", "nlptoolkit-math/dist/Vector"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hmm2 = void 0;
    const Hmm_1 = require("./Hmm");
    const Matrix_1 = require("nlptoolkit-math/dist/Matrix");
    const Vector_1 = require("nlptoolkit-math/dist/Vector");
    class Hmm2 extends Hmm_1.Hmm {
        /**
         * A constructor of {@link Hmm2} class which takes a {@link Set} of states, an array of observations (which also
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
         * calculatePi calculates the prior probability matrix (initial probabilities for each state combinations)
         * from a set of observations. For each observation, the function extracts the first and second states in
         * that observation.  Normalizing the counts of the pair of states returns us the prior probabilities for each
         * pair of states.
         *
         * @param observations A set of observations used to calculate the prior probabilities.
         */
        calculatePi(observations) {
            this.pi = new Matrix_1.Matrix(this.stateCount, this.stateCount);
            for (let observation of observations) {
                let first = this.stateIndexes.get(observation[0]);
                let second = this.stateIndexes.get(observation[1]);
                this.pi.increment(first, second);
            }
            this.pi.columnWiseNormalize();
        }
        /**
         * calculateTransitionProbabilities calculates the transition probabilities matrix from each state to another state.
         * For each observation and for each transition in each observation, the function gets the states. Normalizing the
         * counts of the three of states returns us the transition probabilities.
         *
         * @param observations A set of observations used to calculate the transition probabilities.
         */
        calculateTransitionProbabilities(observations) {
            this.transitionProbabilities = new Matrix_1.Matrix(this.stateCount * this.stateCount, this.stateCount);
            for (let current of observations) {
                for (let j = 0; j < current.length - 2; j++) {
                    let from1 = this.stateIndexes.get(current[j]);
                    let from2 = this.stateIndexes.get(current[j + 1]);
                    let to = this.stateIndexes.get(current[j + 2]);
                    this.transitionProbabilities.increment(from1 * this.stateCount + from2, to);
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
                result.add(this.safeLog(this.transitionProbabilities.getValue(Math.floor(i * this.stateCount + column / this.stateCount), column % this.stateCount)));
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
            let gamma = new Matrix_1.Matrix(sequenceLength, this.stateCount * this.stateCount);
            let phi = new Matrix_1.Matrix(sequenceLength, this.stateCount * this.stateCount);
            let qs = new Vector_1.Vector(sequenceLength, 0);
            let result = new Array();
            /*Initialize*/
            let emission1 = s[0];
            let emission2 = s[1];
            for (let i = 0; i < this.stateCount; i++) {
                for (let j = 0; j < this.stateCount; j++) {
                    let observationLikelihood = this.states[i].getEmitProb(emission1) * this.states[j].getEmitProb(emission2);
                    gamma.setValue(1, i * this.stateCount + j, this.safeLog(this.pi.getValue(i, j)) + this.safeLog(observationLikelihood));
                }
            }
            /*Iterate Dynamic Programming*/
            for (let t = 2; t < sequenceLength; t++) {
                let emission = s[t];
                for (let j = 0; j < this.stateCount * this.stateCount; j++) {
                    let current = this.logOfColumn(j);
                    let previous = gamma.getRowVector(t - 1).skipVector(this.stateCount, Math.floor(j / this.stateCount));
                    current.addVector(previous);
                    let maxIndex = current.maxIndex();
                    let observationLikelihood = this.states[j % this.stateCount].getEmitProb(emission);
                    gamma.setValue(t, j, current.getValue(maxIndex) + this.safeLog(observationLikelihood));
                    phi.setValue(t, j, Math.floor(maxIndex * this.stateCount + j / this.stateCount));
                }
            }
            /*Backtrack pointers*/
            qs.setValue(sequenceLength - 1, gamma.getRowVector(sequenceLength - 1).maxIndex());
            result.unshift(this.states[qs.getValue(sequenceLength - 1) % this.stateCount].getState());
            for (let i = sequenceLength - 2; i >= 1; i--) {
                qs.setValue(i, phi.getValue(i + 1, qs.getValue(i + 1)));
                result.unshift(this.states[qs.getValue(i) % this.stateCount].getState());
            }
            result.unshift(this.states[Math.floor(qs.getValue(1) / this.stateCount)].getState());
            return result;
        }
    }
    exports.Hmm2 = Hmm2;
});
//# sourceMappingURL=Hmm2.js.map