## Day 1

- [`Part 1`](#part-1)
- [`Part 2`](#part-2)

### Part 1

- Utilizing a `read stream` to access the file.
- Implementing `readline` for a line-by-line stream reading.
- Extracting the gameId: Since every line starts with `Game ${id}:`, the id is found between index 5 and the first encountered `:`. Iterating from index 5 until a `:` is found retrieves the id.
- Obtaining colors: The format `${number of cubes} ${color}` is used to determine the number of cubes and color. For instance, a space-prefixed `r` indicates a red color cube, and the number of cubes is obtained by retrieving characters before the `r`. Similar approaches are applied for blue (`b`) and green (`g`) cubes.
- If any colored cube exceeds the specified limit, the game is deemed impossible.

### Part 2

- Mirroring [`Part 1`](#part-1) with the goal of returning the maximum count of green, red, and blue cubes in each game.
- For each game (each line), tracking the maximum number of colored cubes for each color is crucial.
