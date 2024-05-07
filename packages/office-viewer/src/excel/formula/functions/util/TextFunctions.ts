export const TextFunctions = {
  REPT: (text: string, number_times: number) => {
    let str = '';

    for (let i = 0; i < number_times; i++) {
      str += text;
    }
    return str;
  }
};
