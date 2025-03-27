const main = () => {
  const array = [1, 2, 3, 4, 5];

  const result = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i] % 2 !== 0) {
      result.push(array[i]);
    }
  }

  console.log(result);
};

main();

