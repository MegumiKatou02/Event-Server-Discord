const isPositiveInteger = (str: string): boolean => {
  if (str === "") return false;

  const regex = /^[1-9]\d*$/;
  if (!regex.test(str)) return false;

  const num = Number(str);
  return Number.isInteger(num) && num > 0;
}

export { isPositiveInteger }
