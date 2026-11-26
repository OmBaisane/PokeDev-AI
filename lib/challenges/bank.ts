import "server-only";

export const challengeBank = [
  {
    id: "js-beginner-001",
    language: "javascript",
    difficulty: "beginner",
    title: "Predict the output",
    type: "output",
    prompt: "What will this JavaScript expression print?",
    code: `console.log(1 + "2");`,
    options: ["3", '"12"', "NaN", "TypeError"],
    correctAnswer: '"12"',
    explanation:
      "When a number is added to a string, JavaScript converts the number to a string and concatenates both values.",
  },
  {
    id: "js-intermediate-001",
    language: "javascript",
    difficulty: "intermediate",
    title: "Find the bug",
    type: "debug",
    prompt: "Why does this function return undefined?",
    code: `function getUser() {
  const user = { name: "Alex" };
  { name: user.name };
}

console.log(getUser());`,
    options: [
      "The object is invalid",
      "The function has no return statement",
      "The name property is missing",
      "console.log cannot print objects",
    ],
    correctAnswer: "The function has no return statement",
    explanation:
      "The function creates an object expression inside a block but never returns it. Add return before the object.",
  },
  {
    id: "js-advanced-001",
    language: "javascript",
    difficulty: "advanced",
    title: "Choose the correct implementation",
    type: "implementation",
    prompt:
      "Which implementation creates a new array containing only unique values?",
    code: `const values = [1, 2, 2, 3, 3];`,
    options: [
      "values.filter((value, index) => values.indexOf(value) === index)",
      "values.map((value) => value)",
      "values.slice(0, 3)",
      "values.sort()",
    ],
    correctAnswer:
      "values.filter((value, index) => values.indexOf(value) === index)",
    explanation:
      "filter keeps the first occurrence of each value because indexOf returns the index of its first occurrence.",
  },
  {
    id: "ts-beginner-001",
    language: "typescript",
    difficulty: "beginner",
    title: "Understand type inference",
    type: "output",
    prompt: "What type does TypeScript infer for this variable?",
    code: `const score = 100;`,
    options: ["string", "number", "boolean", "any"],
    correctAnswer: "number",
    explanation:
      "TypeScript infers the variable's type from its initial value. Here, the value is a number.",
  },
  {
    id: "ts-intermediate-001",
    language: "typescript",
    difficulty: "intermediate",
    title: "Fix the type error",
    type: "debug",
    prompt: "What is the problem with this assignment?",
    code: `let age: number = 25;
age = "twenty-six";`,
    options: [
      "The variable must use const",
      "A string is assigned to a number variable",
      "TypeScript does not support reassignment",
      "The number type cannot store integers",
    ],
    correctAnswer: "A string is assigned to a number variable",
    explanation:
      "The variable is explicitly typed as number. Assigning a string violates that declared type.",
  },
  {
    id: "ts-advanced-001",
    language: "typescript",
    difficulty: "advanced",
    title: "Choose the generic function",
    type: "implementation",
    prompt:
      "Which function safely returns the first element while preserving the array's element type?",
    code: `// Expected: first(["a", "b"]) returns a string | undefined`,
    options: [
      "function first<T>(items: T[]): T | undefined { return items[0]; }",
      "function first(items: any[]): any { return items[0]; }",
      "function first<T>(items: T[]): string { return items[0]; }",
      "function first(items: unknown[]): unknown[] { return items; }",
    ],
    correctAnswer:
      "function first<T>(items: T[]): T | undefined { return items[0]; }",
    explanation:
      "The generic T preserves the input element type. T | undefined also correctly represents an empty array.",
  },
  {
    id: "py-beginner-001",
    language: "python",
    difficulty: "beginner",
    title: "Predict the output",
    type: "output",
    prompt: "What does this Python code print?",
    code: `numbers = [1, 2, 3]
print(numbers[-1])`,
    options: ["1", "2", "3", "IndexError"],
    correctAnswer: "3",
    explanation:
      "Python supports negative indexing. Index -1 refers to the last element in a sequence.",
  },
  {
    id: "py-intermediate-001",
    language: "python",
    difficulty: "intermediate",
    title: "Find the loop bug",
    type: "debug",
    prompt: "Why does this loop skip the final number 3?",
    code: `for number in range(1, 3):
    print(number)`,
    options: [
      "range cannot use integers",
      "The stop value is exclusive",
      "print only accepts strings",
      "Python loops start at index 0",
    ],
    correctAnswer: "The stop value is exclusive",
    explanation:
      "The stop argument in range is exclusive. Use range(1, 4) to include 3.",
  },
  {
    id: "py-advanced-001",
    language: "python",
    difficulty: "advanced",
    title: "Understand mutable defaults",
    type: "output",
    prompt: "What is printed by the second call?",
    code: `def add_item(item, items=[]):
           items.append(item)
           return items

           print(add_item(1))
           print(add_item(2))`,
    options: ["[2]", "[1, 2]", "[1]", "TypeError"],
    correctAnswer: "[1, 2]",
    explanation:
      "Default arguments are evaluated once when the function is defined. Both calls reuse the same list. Use None as the default and create a new list inside the function instead.",
  },
] as const;

export type Challenge = (typeof challengeBank)[number];
