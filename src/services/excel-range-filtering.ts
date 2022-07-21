export const implementNumberedRangeOnSelection = (fullExcelRange: string) => {

  const pattern = new RegExp("(?<sheet>.*)\\!(?<start>\\D+)\\:(?<end>\\D+)", "gm");
  const match = pattern.exec(fullExcelRange);

  if (!match || !match.groups)
    return fullExcelRange;

  const { sheet, start, end } = match.groups;

  return `${sheet}!${start}1:${end}:5000`;
};
