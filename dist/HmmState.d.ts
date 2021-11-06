export declare class HmmState<State, Symbol> {
    private emissionProbabilities;
    private readonly state;
    /**
     * A constructor of {@link HmmState} class which takes a state and emission probabilities as inputs and
     * initializes corresponding class variable with these inputs.
     *
     * @param state Data for this state.
     * @param emissionProbabilities Emission probabilities for this state
     */
    constructor(state: State, emissionProbabilities: Map<Symbol, number>);
    /**
     * Accessor method for the state variable.
     *
     * @return state variable.
     */
    getState(): State;
    /**
     * getEmitProb method returns the emission probability for a specific symbol.
     *
     * @param symbol Symbol for which the emission probability will be get.
     * @return Emission probability for a specific symbol.
     */
    getEmitProb(symbol: Symbol): number;
}
