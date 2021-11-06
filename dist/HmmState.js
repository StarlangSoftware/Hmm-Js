(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HmmState = void 0;
    class HmmState {
        /**
         * A constructor of {@link HmmState} class which takes a state and emission probabilities as inputs and
         * initializes corresponding class variable with these inputs.
         *
         * @param state Data for this state.
         * @param emissionProbabilities Emission probabilities for this state
         */
        constructor(state, emissionProbabilities) {
            this.state = state;
            this.emissionProbabilities = emissionProbabilities;
        }
        /**
         * Accessor method for the state variable.
         *
         * @return state variable.
         */
        getState() {
            return this.state;
        }
        /**
         * getEmitProb method returns the emission probability for a specific symbol.
         *
         * @param symbol Symbol for which the emission probability will be get.
         * @return Emission probability for a specific symbol.
         */
        getEmitProb(symbol) {
            if (this.emissionProbabilities.has(symbol)) {
                return this.emissionProbabilities.get(symbol);
            }
            else {
                return 0.0;
            }
        }
    }
    exports.HmmState = HmmState;
});
//# sourceMappingURL=HmmState.js.map