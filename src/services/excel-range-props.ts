import {extractFirstCellFromRange} from "./excel-range-filtering";

const ConvertLetterToNumber = (val: string) => {
    let base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', i, j, result = 0;

    for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
        result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
    }

    return result;
};

export class ExcelRangeProps {
    fullExcelRange: string;
    firstCell: string;
    firstCellColumn: string;
    firstCellRow: number;
    firstCellColumnNumber: number;


    constructor(fullExcelRange: string) {
        this.fullExcelRange = fullExcelRange;
        this.firstCell = extractFirstCellFromRange(fullExcelRange);

        this.firstCellColumn = this.firstCell.replace(/[^a-zA-Z]+/g, '');
        this.firstCellRow = parseInt(this.firstCell.replace(/\D/g, ''));
        this.firstCellColumnNumber = ConvertLetterToNumber(this.firstCellColumn);


    }
}