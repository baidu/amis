import {CellData} from '../../../types/worksheet/CellData';
import {sortByRange} from '../sortByRange';
function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}

const cellData: CellData[][] = [
  ['8', 'h', {type: 'style', value: 'h'}],
  ['1', 'a', {type: 'style', value: 'a'}],
  ['5', 'e', {type: 'style', value: 'e'}],
  ['2', 'b', {type: 'style', value: 'b'}],
  ['4', 'd', {type: 'style', value: 'd'}],
  ['6', 'f', {type: 'style', value: 'f'}],
  ['3', 'c', {type: 'style', value: 'c'}],
  ['7', 'g', {type: 'style', value: 'g'}]
];

test('string', () => {
  sortByRange(
    cellData,
    {startRow: 1, endRow: 6, startCol: 1, endCol: 1},
    'asc'
  );

  expect(cellData[1][1]).toBe('a');

  sortByRange(
    cellData,
    {startRow: 1, endRow: 6, startCol: 1, endCol: 1},
    'desc'
  );

  expect(cellData[1][1]).toBe('f');
});
