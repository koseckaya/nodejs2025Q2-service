interface DataToLog {
  fieldName: string;
  fieldValue: string;
}

export const formatData = (dataToLog: DataToLog[]) => {
  return dataToLog
    .map(
      ({ fieldName, fieldValue }) =>
        `${fieldName}: ${JSON.stringify(fieldValue)}`,
    )
    .join(' ');
};
