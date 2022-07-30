export type QueryType = {
    value: string;
    label: string;
};

export const QueryKeys = {
    AtoB: "a-to-b",
    BtoA: "b-to-a",
    ALookalike: "a-lookalike",
    BLookalike: "b-lookalike"
};

export const queryTypesList = (a, b): QueryType[] => {
    return [
        {value: QueryKeys.AtoB, label: `${a} to ${b}`},
        {value: QueryKeys.BtoA, label: `${b} to ${a}`},
        {value: QueryKeys.ALookalike, label: `${a} lookalike`},
        {value: QueryKeys.BLookalike, label: `${b} lookalike`}
    ];
}
