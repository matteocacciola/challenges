# Andela Challenges

## First Task
Write a function that counts how many different ways you can make change for an amount of money, given an array of coin
denominations. For example, there are 3 ways to give change for 4 if you have coins with denomination 1 and 2:
```
1+1+1+1, 1+1+2, 2+2.
```

The order of coins does not matter:
```
1+1+2 == 2+1+1
```
Also, assume that you have an infinite amount of coins.

Your function should take an amount to change and an array of unique denominations for the coins:
```
countChange(4, [1,2]) # => 3
countChange(10, [5,2,3]) # => 4
countChange(11, [5,7]) # => 0
```
### Specification
```
countChange(money, coins)
```

**Parameters**
    
    money: Integer - Number to make change for
    coins: Array<Integer> - Array of denominations

**Return Value**

    Integer - Number of ways change can be made

### Examples
| money | coins   | Return Value |
|-------|---------|--------------|
| 4     | [1,2]   | 3            |
| 10    | [5,2,3] | 4            |
| 11    | [5,7]   | 0            |

# Second Task
In this challenge, your task is to sort the columns of a CSV file. The contents of the CSV will be provided to you as a
string adhering to the description below.
- The columns are separated by commas (,)
- The rows are separated by a newline (\n)
- The first line contains the names of the columns
- A blank space counts as an empty string
- Treat every value as a string
- The CSV has a dynamic number of rows and columns
Write a method that sorts the columns by the names of the columns alphabetically, and case-insensitive.
- 
### Specification
```
sortCsvColumns(csvData)
```
Takes comma separated values and sorts it alphabetically

**Parameters**

    csvData: String - Unsorted CSV

**Return Value**

    String - Sorted CSV

### Examples
Raw Input:

    Beth,Charles,Danielle,Adam,Eric\n
    17945,10091,10088,3907,10132\n
    2,12,13,48,11

As a Table:

| Beth  | Charles | Danielle | Adam | Eric  |
| ----- | ------- | -------- | ---- | ----- |
| 17945 | 10091   | 10088    | 3907 | 10132 |
| 2     | 12      | 13       | 48   | 11    |

Example Output

Raw output:

    Adam,Beth,Charles,Danielle,Eric\n
    3907,17945,10091,10088,10132\n
    48,2,12,13,11

As a Table:

| Adam | Beth  | Charles | Danielle | Eric  |
|------|-------|---------|----------|-------|
| 3907 | 17945 | 10091   | 10088    | 10132 |
| 48   | 2     | 12      | 13       | 11    |

