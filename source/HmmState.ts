export class HmmState<State, Symbol> {

    private emissionProbabilities: Map<Symbol, number>
    private readonly state: State

    /**
     * A constructor of {@link HmmState} class which takes a state and emission probabilities as inputs and
     * initializes corresponding class variable with these inputs.
     *
     * @param state Data for this state.
     * @param emissionProbabilities Emission probabilities for this state
     */
    constructor(state: State, emissionProbabilities: Map<Symbol, number>) {
        this.state = state
        this.emissionProbabilities = emissionProbabilities
    }

    /**
     * Accessor method for the state variable.
     *
     * @return state variable.
     */
    getState(): State{
        return this.state
    }

    /**
     * getEmitProb method returns the emission probability for a specific symbol.
     *
     * @param symbol Symbol for which the emission probability will be get.
     * @return Emission probability for a specific symbol.
     */
    getEmitProb(symbol: Symbol): number{
        if (this.emissionProbabilities.has(symbol)){
            return this.emissionProbabilities.get(symbol)
        } else {
            return 0.0
        }
    }
}