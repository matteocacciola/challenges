# Rank players
Develop a ranking system where we can sort points and calculate the position of an individual or a team competing in a game/competition.

Note:
If two or more persons have the same number of points, they should have same position number and sorted by name (name is unique).

For example, Input structure:

    [{
        name: "John",
        points: 100,
    },
    {
        name: "Bob",
        points: 130,
    },
    {
        name: "Mary",
        points: 120,
    },
    {
        name: "Kate",
        points: 120,
    }]

Output should be:

    [{
        name: "Bob",
        points: 130,
        position: 1,
    },
    {
        name: "Kate",
        points: 120,
        position: 2,
    },
    {
        name: "Mary",
        points: 120,
        position: 2,
    },
    {
        name: "John",
        points: 100,
        position: 4,
    }]
