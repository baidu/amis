export const WildCard = {
  isWildCard: (obj: string) => {
    if (typeof obj === 'string') return /[*?]/.test(obj);
    return false;
  },
  toRegex: (lookupText: string, flags?: string) => {
    return RegExp(
      lookupText
        .replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape the special char for js regex
        .replace(/([^~]??)[?]/g, '$1.') // ? => .
        .replace(/([^~]??)[*]/g, '$1.*') // * => .*
        .replace(/~([?*])/g, '$1'),
      flags
    ); // ~* => * and ~? => ?
  }
};
