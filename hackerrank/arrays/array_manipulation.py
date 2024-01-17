def arrayManipulation(n, queries):
    def applyQuery(query: list) -> list:
        a, b, k = query
        arr[a - 1] += k
        arr[b] -= k
        return arr

    arr = [0] * (n + 1)
    max_v = current = 0

    arr = [applyQuery(query) for query in queries][-1]

    for item in arr:
        current += item
        max_v = max(max_v, current)

    return max_v


# def arrayManipulation(n, queries):
#     arr = [0] * (n + 1)
#     max_v = current = 0
#
#     for query in queries:
#         a, b, k = query
#         arr[a - 1] += k
#         arr[b] -= k
#
#     for item in arr:
#         current += item
#         max_v = max(max_v, current)
#
#     return max_v