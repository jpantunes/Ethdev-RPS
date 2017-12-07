export enum Symbols {
  ROCK = 1,
  PAPER = 2,
  SCISSOR = 3,
};

export let SymbolsList : Array<Symbols> = [
 Symbols.ROCK,
 Symbols.PAPER,
 Symbols.SCISSOR,
];

export let SymbolsUrl = {};
SymbolsUrl[Symbols.ROCK] = 'assets/rock.png';
SymbolsUrl[Symbols.PAPER] = 'assets/paper.png';
SymbolsUrl[Symbols.SCISSOR] = 'assets/scissor.png';
