# Challenges

This is a repository containing the solutions to different challenges, time by time approached in my free time.

## Change directory
The test is proposed on [TestDome](https://www.testdome.com/questions/php/path/7265): write a function that provides
change directory (cd) function for an abstract file system.

Notes:

    Root path is '/'.
    Path separator is '/'.
    Parent directory is addressable as '..'.
    Directory names consist only of English alphabet letters (A-Z and a-z).

For example:

    $path = new Path('/a/b/c/d');
    echo $path->cd('../x')->currentPath;

should display `/a/b/c/x`.

Note: Do not use built-in path-related functions.

## Count Vowels
Implementation in Typescript of a solution to the following problem.
Write a function that returns the number (count) of vowels in a given string. Letters considered as vowels are: a, i, e, o, and u.
The function should be able to take all types of characters as input, including lower case letters, upper case letters, symbols, and numbers.

## Describe Function
You have to create a function calcType, which receives 3 arguments: 2 numbers, and the result of an unknown operation performed on them (also a number).
Based on those 3 values you have to return a string, that describes which operation was used to get the given result.
The possible return strings are: "+", "-", "*", "/".
In case of division you should expect that the result of the operation is obtained by using / operator on the input values.

Here, I propose a solution in Typescript.

## Loneliest number
Implementation in Typescript of the so-called Loneliest number problem.
The range of vision of a digit is equal to its own value. 1 can see one digit to the left and one digit to the right, 2 can see two digits, and so on.
Thus, the loneliness of a digit is the sum of the digits which it can see.
Given a non-negative integer, your function must determine the loneliest number in the string.

## Longest Word
Implementation in Typescript of the test able to find the longest word in a string, where a word can be composed by letters and/or numbers.

## Next Palindromic Number
Implementation in Typescript of the test able to find the next palindromic number, given a positive integer
For example: if num is 24, then your program should return 33 because that is the next largest number that is a palindrome.

## Obfuscate Phone Number
This is a solution in Typescript to the following problem.
write a function that encrypts phone numbers. The method should hide the last six digits of each phone number.

    Example 1 (Using US phone number)
    IN: 201-680-0202 => OUT: 201-6XX-XXXX

You can also have the code check the validity of the phone number's format.

    Example 2
    IN: 145-201-680-0202 => OUT: false

## Percentage of the zone covered by shoppers
Suppose you have:
- a `haversine(lat1, lng1, lat2, lng2)` function that returns the distance (measured in km) between the coordinates of two given geographic point (lat and lng are latitude and longitude)

- an array of geographical zones (`locations`):
```
    locations = [
        {'id': 1000, 'zip_code': '37069', 'lat': 45.35, 'lng': 10.84},
        {'id': 1001, 'zip_code': '37121', 'lat': 45.44, 'lng': 10.99},
        {'id': 1001, 'zip_code': '37129', 'lat': 45.44, 'lng': 11.00},
        {'id': 1001, 'zip_code': '37133', 'lat': 45.43, 'lng': 11.02},
        ...
    ];
```
- an array of shoppers:
```
  shoppers = [
      {'id': 'S1', 'lat': 45.46, 'lng': 11.03, 'enabled': true},
      {'id': 'S2', 'lat': 45.46, 'lng': 10.12, 'enabled': true},
      {'id': 'S3', 'lat': 45.34, 'lng': 10.81, 'enabled': true},
      {'id': 'S4', 'lat': 45.76, 'lng': 10.57, 'enabled': true},
      {'id': 'S5', 'lat': 45.34, 'lng': 10.63, 'enabled': true},
      {'id': 'S6', 'lat': 45.42, 'lng': 10.81, 'enabled': true},
      {'id': 'S7', 'lat': 45.34, 'lng': 10.94, 'enabled': true},
  ];
```

The goal is to calculate the percentage of the zone covered by enabled shoppers (`coverage`).
One shopper covers a zone if the distance among the coordinates is less than 10 km.
Resulted array should be sorted (desc) as the following one:
```
    sorted = [
        {shopper_id': 'S3', 'coverage': 72},
        {shopper_id': 'S1', 'coverage': 43},
        {shopper_id': 'S6', 'coverage': 12},
    ];
```

## Stock List
A bookseller has lots of books classified in 26 categories labeled A, B, ... Z. Each book has a code c of 3, 4, 5 or more capital letters. The 1st letter of code is the capital letter of the book category.
In the bookseller's stocklist, each code c is followed by a space and by a positive integer n (int n >= 0) which indicates the quantity of books of this code in stock.
For example an extract of one of the stocklists could be:

    L = {"ABART 20", "CDXEF 50", "BKWRK 25", "BTSQZ 89", "DRTYM 60"}
or

    L = ["ABART 20", "CDXEF 50", "BKWRK 25", "BTSQZ 89", "DRTYM 60"]

You will be given a stocklist (e.g. : L) and a list of categories in capital letters e.g :

    M = {"A", "B", "C", "W"}

or

    M = ["A", "B", "C", "W"]

and your task is to find all the books of L with codes belonging to each category of M and to sum their quantity according to each category.
For the lists L and M of example you have to return the string (in Haskell/Clojure/Racket a list of pairs):

    (A : 20) - (B : 114) - (C : 50) - (W : 0)

where A, B, C, W are the categories, 20 is the sum of the unique book of category A, 114 the sum corresponding to "BKWRK" and "BTSQZ",
50 corresponding to "CDXEF" and 0 to category 'W' since there are no code beginning with W.
If L or M are empty return string is "" (Clojure and Racket should return an empty array/list instead).

Note:
In the result codes and their values are in the same order as in M.

## register.it
This is the PHP code prepared by myself for the code challenge proposed by Register.it during their selection process.

## TheFork
This is the NodeJS code prepared by myself for the code challenge proposed by TheFork during their selection process.

## Prime
A PHP function implementing the evaluation of prime numbers.
