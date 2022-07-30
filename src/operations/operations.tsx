export type OperationType = {
    key: string;
    name: string;
};

export const OperationKeys = {
    SimilarityById: "similarity-by-id",
    Prediction: "prediction",
    Recommendation: "recommendation"
};

export const operations: OperationType[] = [
    {key: OperationKeys.SimilarityById, name: "Similarity By Id"},
    {key: OperationKeys.Prediction, name: "Prediction"},
    {key: OperationKeys.Recommendation, name: "Recommendation"}
];



