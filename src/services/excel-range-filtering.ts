import {ExcelRangeProps} from "./excel-range-props";

const regexPattern = "(?<sheet>.*)\\!(?<start>\\D+)\\:(?<end>\\D+)";
const regexCellPattern = "(?<sheet>.*)!(?<start>.*)";
const regexCellsPattern = "(?<sheet>.*)!(?<start>.*):(?<end>.*)";

export const implementNumberedRangeOnSelection = (fullExcelRange: string) => {

    const regex = new RegExp(regexPattern, "gm");
    const match = regex.exec(fullExcelRange);

    if (!match || !match.groups)
        return fullExcelRange;

    const {sheet, start, end} = match.groups;

    return `${sheet}!${start}1:${end}5000`;
};

function getPattern(fullExcelRange: string): string {
    if (fullExcelRange.includes(":")) {
        return regexCellsPattern;
    }
    return regexCellPattern;
}

export const extractFirstCellFromRange = (fullExcelRange: string) => {
    let pattern = getPattern(fullExcelRange);

    const regex = new RegExp(pattern, "gm");
    const match = regex.exec(fullExcelRange);

    if (!match || !match.groups)
        return fullExcelRange;

    const {start} = match.groups;

    return start;
};

export const extractCollectionRange = (selectedOutputRange: string, columnsNumber: number, collectionLength: number) => {
    let rangeProps = new ExcelRangeProps(selectedOutputRange);
    const secondColumnLetter = String.fromCharCode((columnsNumber - 1) + rangeProps.firstCellColumnNumber + 64);
    return `${rangeProps.firstCell}:${secondColumnLetter}${(collectionLength - 1) + rangeProps.firstCellRow}`;
};


