/*
 * Converts unix timestamp into string format
 * @returns string representation of timestamp - eg. 01/01/2001
 */
export const convertDateToString = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp)
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
}
