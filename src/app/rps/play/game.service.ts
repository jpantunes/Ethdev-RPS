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

export let SymbolsName = {};
SymbolsName[Symbols.ROCK] = 'Rock';
SymbolsName[Symbols.PAPER] = 'Paper';
SymbolsName[Symbols.SCISSOR] = 'Scissor';

export let SymbolsNameToId = {};
SymbolsNameToId['Rock'] = Symbols.ROCK;
SymbolsNameToId['Paper'] = Symbols.PAPER;
SymbolsNameToId['Scissor'] = Symbols.SCISSOR;
