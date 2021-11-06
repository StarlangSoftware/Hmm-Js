import { Hmm } from "./Hmm";
export declare class Hmm2<State, Symbol> extends Hmm<State, Symbol> {
    private pi;
    /**
     * A constructor of {@link Hmm2} class which takes a {@link Set} of states, an array of observations (which also
     * consists of an array of states) and an array of instances (which also consists of an array of emitted symbols).
     * The constructor calls its super method to calculate the emission probabilities for those states.
     *
     * @param states A {@link Set} of states, consisting of all possible states for this problem.
     * @param observations An array of instances, where each instance consists of an array of states.
     * @param emittedSymbols An array of instances, where each instance consists of an array of symbols.
     */
    constructor(states: Set<State>, observations: Array<Array<State>>, emittedSymbols: Array<Array<Symbol>>);
    /**
     * calculatePi calculates the prior probability matrix (initial probabilities for each state combinations)
     * from a set of observations. For each observation, the function extracts the first and second states in
     * that observation.  Normalizing the counts of the pair of states returns us the prior probabilities for each
     * pair of states.
     *
     * @param observations A set of observations used to calculate the prior probabilities.
     */
    protected calculatePi(observations: Array<Array<State>>): void;
    /**
     * calculateTransitionProbabilities calculates the transition probabilities matrix from each state to another state.
     * For each observation and for each transition in each observation, the function gets the states. Normalizing the
     * counts of the three of states returns us the transition probabilities.
     *
     * @param observations A set of observations used to calculate the transition probabilities.
     */
    protected calculateTransitionProbabilities(observations: Array<Array<State>>): void;
    /**
     * logOfColumn calculates the logarithm of each value in a specific column in the transition probability matrix.
     *
     * @param column Column index of the transition probability matrix.
     * @return A vector consisting of the logarithm of each value in the column in the transition probability matrix.
     */
    private logOfColumn;
    /**
     * viterbi calculates the most probable state sequence for a set of observed symbols.
     *
     * @param s A set of observed symbols.
     * @return The most probable state sequence as an {@link Array}.
     */
    viterbi(s: Array<Symbol>): Array<State>;
}
