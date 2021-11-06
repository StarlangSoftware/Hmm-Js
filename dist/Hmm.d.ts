import { Matrix } from "nlptoolkit-math/dist/Matrix";
import { HmmState } from "./HmmState";
export declare abstract class Hmm<State, Symbol> {
    protected transitionProbabilities: Matrix;
    protected stateIndexes: Map<State, number>;
    protected states: Array<HmmState<State, Symbol>>;
    protected stateCount: number;
    protected abstract calculatePi(observations: Array<Array<State>>): void;
    protected abstract calculateTransitionProbabilities(observations: Array<Array<State>>): void;
    abstract viterbi(s: Array<Symbol>): Array<State>;
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
    constructor(states: Set<State>, observations: Array<Array<State>>, emittedSymbols: Array<Array<Symbol>>);
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
    calculateEmissionProbabilities(state: State, observations: Array<Array<State>>, emittedSymbols: Array<Array<Symbol>>): Map<Symbol, number>;
    /**
     * safeLog calculates the logarithm of a number. If the number is less than 0, the logarithm is not defined, therefore
     * the function returns -Infinity.
     *
     * @param x Input number
     * @return the logarithm of x. If x less than 0 return -infinity.
     */
    safeLog(x: number): number;
}
