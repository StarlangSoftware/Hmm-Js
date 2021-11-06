import {Hmm} from "./Hmm";
import {Vector} from "nlptoolkit-math/dist/Vector";
import {Matrix} from "nlptoolkit-math/dist/Matrix";

export class Hmm1<State, Symbol> extends Hmm<State, Symbol>{

    private pi: Vector

    /**
     * A constructor of {@link Hmm1} class which takes a {@link Set} of states, an array of observations (which also
     * consists of an array of states) and an array of instances (which also consists of an array of emitted symbols).
     * The constructor calls its super method to calculate the emission probabilities for those states.
     *
     * @param states A {@link Set} of states, consisting of all possible states for this problem.
     * @param observations An array of instances, where each instance consists of an array of states.
     * @param emittedSymbols An array of instances, where each instance consists of an array of symbols.
     */
    constructor(states: Set<State>, observations: Array<Array<State>>, emittedSymbols: Array<Array<Symbol>>) {
        super(states, observations, emittedSymbols)
    }

    /**
     * calculatePi calculates the prior probability vector (initial probabilities for each state) from a set of
     * observations. For each observation, the function extracts the first state in that observation. Normalizing the
     * counts of the states returns us the prior probabilities for each state.
     *
     * @param observations A set of observations used to calculate the prior probabilities.
     */
    protected calculatePi(observations: Array<Array<State>>) {
        this.pi = new Vector(this.stateCount, 0.0)
        for (let observation of observations) {
            let index = this.stateIndexes.get(observation[0])
            this.pi.addValue(index, 1.0)
        }
        this.pi.l1Normalize()
    }

    /**
     * calculateTransitionProbabilities calculates the transition probabilities matrix from each state to another state.
     * For each observation and for each transition in each observation, the function gets the states. Normalizing the
     * counts of the pair of states returns us the transition probabilities.
     *
     * @param observations A set of observations used to calculate the transition probabilities.
     */
    protected calculateTransitionProbabilities(observations: Array<Array<State>>) {
        this.transitionProbabilities = new Matrix(this.stateCount, this.stateCount)
        for (let current of observations) {
            for (let j = 0; j < current.length - 1; j++) {
                let from = this.stateIndexes.get(current[j])
                let to = this.stateIndexes.get(current[j + 1])
                this.transitionProbabilities.increment(from, to)
            }
        }
        this.transitionProbabilities.columnWiseNormalize()
    }

    /**
     * logOfColumn calculates the logarithm of each value in a specific column in the transition probability matrix.
     *
     * @param column Column index of the transition probability matrix.
     * @return A vector consisting of the logarithm of each value in the column in the transition probability matrix.
     */
    private logOfColumn(column: number): Vector{
        let result = new Vector(0, 0)
        for (let i = 0; i < this.stateCount; i++){
            result.add(this.safeLog(this.transitionProbabilities.getValue(i, column)))
        }
        return result
    }

    /**
     * viterbi calculates the most probable state sequence for a set of observed symbols.
     *
     * @param s A set of observed symbols.
     * @return The most probable state sequence as an {@link Array}.
     */
    viterbi(s: Array<Symbol>): Array<State> {
        let sequenceLength = s.length
        let gamma = new Matrix(sequenceLength, this.stateCount)
        let phi = new Matrix(sequenceLength, this.stateCount)
        let qs = new Vector(sequenceLength, 0)
        let result = new Array<State>()
        /*Initialize*/
        let emission = s[0]
        for (let i = 0; i < this.stateCount; i++){
            let observationLikelihood = this.states[i].getEmitProb(emission)
            gamma.setValue(0, i, this.safeLog(this.pi.getValue(i)) + this.safeLog(observationLikelihood))
        }
        /*Iterate Dynamic Programming*/
        for (let t = 1; t < sequenceLength; t++){
            emission = s[t]
            for (let j = 0; j < this.stateCount; j++){
                let tempArray = this.logOfColumn(j)
                tempArray.addVector(gamma.getRowVector(t - 1))
                let maxIndex = tempArray.maxIndex()
                let observationLikelihood = this.states[j].getEmitProb(emission)
                gamma.setValue(t, j, tempArray.getValue(maxIndex) + this.safeLog(observationLikelihood))
                phi.setValue(t, j, maxIndex);
            }
        }
        /*Backtrack pointers*/
        qs.setValue(sequenceLength - 1, gamma.getRowVector(sequenceLength - 1).maxIndex())
        result.unshift(this.states[qs.getValue(sequenceLength - 1)].getState())
        for (let i = sequenceLength - 2; i >= 0; i--){
            qs.setValue(i, phi.getValue(i + 1, qs.getValue(i + 1)))
            result.unshift(this.states[qs.getValue(i)].getState())
        }
        return result
    }

}