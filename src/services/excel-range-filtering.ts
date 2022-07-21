export const implementNumberedRangeOnSelection = (fullExcelRange: string) => {

  debugger;

  const match = fullExcelRange
    .match(/(?<sheet>.*)\\!(?<start>\w+)\\:(?<end>\w+)/gm);

  const { sheet, start, end } = match.groups;

  return `${sheet}!${start}1:${end}:5000`;
};
