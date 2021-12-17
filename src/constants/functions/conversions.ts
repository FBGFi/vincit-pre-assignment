const dateToTimeStamp = (date: string): number => {
    return new Date(date).getTime() / 1000;
}

const timeStampToDate = (date: Date): string => `${date.getUTCDate()}.${date.getUTCMonth() + 1}.${date.getUTCFullYear()}`;

const addZeroesToStartOfNumber = (value: number, length: number): string => {
    let returnValue = value.toString();
    for(let i = returnValue.length; i < length; i++) {
        returnValue = "0" + returnValue;
    }
    return returnValue;
}

const timeStampToDateInputFormat = (date: Date): string => {
    return addZeroesToStartOfNumber(date.getUTCFullYear(), 2)
    + '-' +
    addZeroesToStartOfNumber(date.getUTCMonth() + 1, 2)
    + '-' +
    addZeroesToStartOfNumber(date.getUTCDate(), 2)
};

export { dateToTimeStamp, timeStampToDate, timeStampToDateInputFormat }