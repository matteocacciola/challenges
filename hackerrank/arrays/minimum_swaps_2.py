def minimumSwaps(arr):
    swaps = i = 0
    while i < len(arr):
        # Check if the current element is not in its correct position
        if arr[i] != i + 1:
            # Swap the current element with the one at its correct position
            arr[arr[i] - 1], arr[i] = arr[i], arr[arr[i] - 1]
            swaps += 1
            continue
        i += 1

    return swaps