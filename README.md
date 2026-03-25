### 1️⃣ What is the difference between var, let, and const?

**var:**
- Function-scoped (accessible throughout the entire function where it's declared)
- Can be redeclared and updated
- Hoisted to the top of the function (initialized as undefined)
- Can be used before declaration (will be undefined)

**let:**
- Block-scoped (only accessible within the block {} where it's declared)
- Can be updated but NOT redeclared in the same scope
- Hoisted but NOT initialized (Temporal Dead Zone - TDZ)
- Cannot be used before declaration (ReferenceError)

**const:**
- Block-scoped like let
- Cannot be updated or redeclared
- Must be initialized at declaration
- For objects/arrays, the reference is constant but contents can be modified

```javascript
// Example:
var x = 10;    // Function scoped, can be redeclared
let y = 20;    // Block scoped, can be updated
const z = 30;  // Block scoped, cannot be changed

if (true) {
    var a = 1;   // Accessible outside this block
    let b = 2;   // Only accessible inside this block
    const c = 3; // Only accessible inside this block
}
console.log(a); // 1
console.log(b); // ReferenceError
```

### 2️⃣ What is the spread operator (...)?

The spread operator (`...`) allows an iterable (array, string, object) to be expanded in places where zero or more arguments or elements are expected.

**Use cases:**

1. **Copying arrays:**
```javascript
const arr1 = [1, 2, 3];
const arr2 = [...arr1]; // Creates a new copy: [1, 2, 3]
```

2. **Merging arrays:**
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const merged = [...arr1, ...arr2]; // [1, 2, 3, 4]
```

3. **Copying objects:**
```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }
```

4. **Function arguments:**
```javascript
function sum(a, b, c) {
    return a + b + c;
}
const numbers = [1, 2, 3];
console.log(sum(...numbers)); // 6
```

### 3️⃣ What is the difference between map(), filter(), and forEach()?

**forEach():**
- Executes a function for each array element
- Does NOT return a new array
- Used for side effects (like logging, modifying external variables)
- Cannot be chained

```javascript
const nums = [1, 2, 3];
nums.forEach(num => console.log(num)); // Prints 1, 2, 3
// Returns undefined
```

**map():**
- Creates a NEW array with transformed elements
- Returns an array of same length
- Used for transforming data
- Can be chained

```javascript
const nums = [1, 2, 3];
const doubled = nums.map(num => num * 2); // [2, 4, 6]
// Original array unchanged
```

**filter():**
- Creates a NEW array with elements that pass a test
- Returns an array of equal or smaller length
- Used for selecting/filtering data
- Can be chained

```javascript
const nums = [1, 2, 3, 4, 5];
const evens = nums.filter(num => num % 2 === 0); // [2, 4]
// Original array unchanged
```

**Key differences:**
| Method | Returns | Modifies Original | Use Case |
|--------|---------|-------------------|----------|
| forEach | undefined | No | Side effects |
| map | New array (same length) | No | Transform data |
| filter | New array (filtered) | No | Select data |

### 4️⃣ What is an arrow function?

An arrow function is a shorter syntax for writing functions in JavaScript, introduced in ES6.

**Syntax:**
```javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With single parameter (no parentheses needed)
const double = x => x * 2;

// With no parameters
const greet = () => "Hello!";

// With multiple statements (needs braces and return)
const calculate = (a, b) => {
    const sum = a + b;
    return sum * 2;
};
```

**Key characteristics:**
1. **Shorter syntax** - More concise than traditional functions
2. **No own `this`** - Inherits `this` from the enclosing scope (lexical this)
3. **No `arguments` object** - Cannot use the `arguments` keyword
4. **Cannot be used as constructors** - Cannot use `new` keyword
5. **No `prototype` property**

**When to use:**
- Callbacks in map, filter, forEach
- Short functions
- When you need to preserve `this` context

### 5️⃣ What are template literals?

Template literals are string literals that allow embedded expressions, multi-line strings, and string interpolation. They are enclosed by backticks (\` \`) instead of quotes.

**Features:**

1. **String interpolation:**
```javascript
const name = "John";
const age = 25;
const message = `My name is ${name} and I am ${age} years old.`;
// "My name is John and I am 25 years old."
```

2. **Multi-line strings:**
```javascript
const multiLine = `
    This is line 1
    This is line 2
    This is line 3
`;
// Preserves line breaks without \n
```

3. **Expression evaluation:**
```javascript
const a = 5;
const b = 10;
const result = `Sum: ${a + b}, Product: ${a * b}`;
// "Sum: 15, Product: 50"
```

4. **Nested templates:**
```javascript
const isAdmin = true;
const greeting = `Welcome, ${isAdmin ? `Admin` : `User`}!`;
// "Welcome, Admin!"
```

5. **Tagged templates (advanced):**
```javascript
function highlight(strings, ...values) {
    return strings.reduce((acc, str, i) => 
        `${acc}${str}<strong>${values[i] || ''}</strong>`, '');
}
const name = "JavaScript";
const output = highlight`Learning ${name} is fun!`;
```

**Benefits over regular strings:**
- More readable code
- No need for string concatenation (+)
- Easy to create HTML templates
- Support for expressions inside strings