# Change directory
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