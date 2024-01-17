def bonetrousle(n: int, k: int, b: int) -> list:
    cur_sum = int(b * (1 + b) / 2)
    if cur_sum > n:
        return [-1]

    res = [x + 1 for x in range(b)]
    max_shift = k - b
    for i in reversed(range(b)):
        shift = min(max_shift, n - cur_sum)
        res[i] += shift
        cur_sum += shift
    if cur_sum < n:
        return [-1]

    return res