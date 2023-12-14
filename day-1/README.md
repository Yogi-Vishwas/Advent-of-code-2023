## Day 1

- [`Part 1`](#part-1)
- [`Part 2`](#part-2)

### Part 1

- Utilizing a readStream, I read the file and interpret its content as ASCII values.
- I maintain two pointers, denoted as `left` and `right`, for each line.
- The `left` pointer signifies the first occurrence of a number in a line.
- The `right` pointer denotes the last occurrence of a number in a line.
- Initially, both `left` and `right` pointers are set to `undefined`.
- Upon encountering the first instance of a number, both `left` and `right` are updated to that number.
- Subsequent appearances of numbers update only the `right` pointer.
- Upon encountering a new line (`\n`), both `left` and `right` are reset to `undefined`.
- To identify whether a character in the line is a number, I compare its ASCII value using the condition `char >= "0" && char <= "9"`.

### Part 2

- The overall process in [`Part 2`](#part-2) follows the same structure as outlined in [`Part 1`](#part-1), with the primary modification being the updated logic for identifying numeric characters.

- In this part of the problem, character sequences such as `one`, `two`, etc., are also considered as numbers. To accommodate this, a lookup table is employed, functioning as a map that associates the initial character of a number word with its complete representation. The lookup table is structured as follows:

  ```javascript
  {
      o: ["one"],
      t: ["two", "three"],
      f: ["four", "five"],
      s: ["six", "seven"],
      e: ["eight"],
      n: ["nine"],
  };
  ```

- When iterating through a line, upon encountering a character that could be the start of a number word, a forward lookup is initiated. For instance, if the line is `aontwo`, when the iterator reaches `o`, it considers it a potential match and performs a forward lookup for up to 3 characters (since `one` is 3 characters long) using the lookup table. It checks if all the characters in the line match the value associated with `o` in the table, which is `one`. If, for example, after `on`, it does not find `e`, the function returns `false`, indicating that it is not a number. However, when the iterator reaches `t`, it successfully matches `two`, and the function returns `true`.

- To associate a numeric value with a sequence of characters, a reverse lookup table is utilized:

  ```javascript
  {
      one: "1",
      two: "2",
      three: "3",
      four: "4",
      five: "5",
      six: "6",
      seven: "7",
      eight: "8",
      nine: "9",
  };
  ```

- All the process is same as [`Part 1`](#part-1) just the logic to check if the character is number is updated.
- In the part 2 of the problem character sequence like `one`, `two` etc will also be counted as number.
- I am using a lookup table which is a map that stores initial char of a number word. Like for char `o` `one` is stored as its value. Lookup table looks like

```javascript
{
    o: ["one"],
    t: ["two", "three"],
    f: ["four", "five"],
    s: ["six", "seven"],
    e: ["eight"],
    n: ["nine"],
};
```

- Whenever iterating over a line, I encounter a character that can be a start of a number word. I suspect this as a potential match and I do a forward lookup. So for example, let's say the line is `aontwo` when I reach `o` I suspect it as a potential match and I do forward lookup for upto 3 characters (as `one` is 3 characters long) using my lookup table and see if all the characters in the line are matching for the value of `o` which is `one`. In this case, after `on` I'll not get `e` so the function will return `false` or declare it as not number. But when our iterator will reach `t` it will indeed find `two` and our function will return `true`.
- For finding the number associated with the sequence of character, I am using a reverse lookup table which is

```javascript
{
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
};
```
