type CategorySums = {
  [name: string]: number;
};

export const stockList = (listOfBooks: string[], categories: string[]): string => {
  if (listOfBooks.length === 0 || categories.length === 0) {
    return '';
  }

  const categorySums: CategorySums = {};

  for (const book of listOfBooks) {const [code, quantityStr] = book.split(' ');
    const category = code[0];

    if (categories.includes(category)) {
      const quantity = parseInt(quantityStr);
      categorySums[category] = (categorySums[category] || 0) + quantity;
    }
  }

  return categories.map((category) => `(${category} : ${categorySums[category] || 0})`).join(" - ");
};
