const regexPattern = "(?<sheet>.*)\\!(?<start>\\D+)\\:(?<end>\\D+)";

export const implementNumberedRangeOnSelection = (fullExcelRange: string) => {

  const regex = new RegExp(regexPattern, "gm");
  const match = regex.exec(fullExcelRange);

  if (!match || !match.groups)
    return fullExcelRange;

  const { sheet, start, end } = match.groups;

  return `${sheet}!${start}1:${end}5000`;
};

export const extractAddressRange = (fullExcelRange: string) => {

  const regex = new RegExp(regexPattern, "gm");
  const match = regex.exec(fullExcelRange);

  if (!match || !match.groups)
    return fullExcelRange;

  const { start, end } = match.groups;

  return `${start}1:${end}5000`;
};

export const extractFirstCellFromRange = (fullExcelRange: string) => {

  const regex = new RegExp(regexPattern, "gm");
  const match = regex.exec(fullExcelRange);

  if (!match || !match.groups)
    return fullExcelRange;

  const { start } = match.groups;

  return start;
};
