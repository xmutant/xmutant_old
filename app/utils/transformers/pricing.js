
  /**
   * Turns a string tezos input into an int number
   */
  export function transformTezosInputToMutezNumber(input) {
    return Math.floor(parseFloat(input) * 1000000);
  }
  
  /**
   * Turns a tezos mutez price int into a string/1000000
   */
  export function transformTezosMutezToInputString(mutez) {
    return (mutez / 1000000).toString();
  }
  
  /**
   * Turns the strings in the pricing fixed input into numbers
   */
  export function transformPricingFixedInputToNumbers(input) {
    return {
      price: transformTezosInputToMutezNumber(input.price),
      opensAt: input.opensAt,
    };
  }
  
  /**
   * Turns the numbers in the pricing fixed into strings
   */
  export function transformPricingFixedNumbersToString(input) {
    return {
      price: transformTezosMutezToInputString(input.price),
      opensAt: input.opensAt ? new Date(input.opensAt) : null,
    };
  }
  
  /**
   * Turns the strings in the pricing dutch auction into mutez numbers
   */
  export function transformPricingDutchInputToNumbers(input) {
    return {
      levels: input.levels.map((v) => transformTezosInputToMutezNumber(v)),
      decrementDuration: parseInt(input.decrementDuration),
      opensAt: input.opensAt,
    };
  }
  
  /**
   * Turns the mutez numbers in the pricing dutch auction into string tez
   */
  export function transformPricingDutchNumbersToString(input) {
    return {
      levels: input.levels.map((v) => transformTezosMutezToInputString(v)),
      decrementDuration: (input.decrementDuration / 60).toFixed(0),
      opensAt: input.opensAt ? new Date(input.opensAt) : null,
    };
  }
  
  /**
   * Turns the string of a whole Gen Tok Pricing Form into numbers
   */
  export function transformPricingFormToNumbers(input) {
    return {
      ...input,
      pricingFixed: input.pricingFixed
        ? transformPricingFixedInputToNumbers(input.pricingFixed)
        : null,
      pricingDutchAuction: input.pricingDutchAuction
        ? transformPricingDutchInputToNumbers(input.pricingDutchAuction)
        : null,
    };
  }
  
  /**
   * Turns the string of a whole Gen Tok Pricing Form into numbers
   */
  export function transformPricingNumbersToString(input) {
    return {
      ...input,
      pricingFixed: transformPricingFixedNumbersToString(input.pricingFixed),
      pricingDutchAuction: transformPricingDutchNumbersToString(input.pricingDutchAuction),
    };
  }
  