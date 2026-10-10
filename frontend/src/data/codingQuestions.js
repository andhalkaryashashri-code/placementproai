const codingQuestions = [

  // ================= EASY =================

  {
    id: 1,
    difficulty: "Easy",
    topic: "Strings",
    title: "Reverse a String",
    description: "Reverse the given string.",
    problem:
      "Write a function that takes a string as input and returns the reversed string.",
    example:
`Input: hello
Output: olleh`,
    constraints: [
      "1 <= length <= 1000",
      "Use any programming language"
    ]
  },

  {
    id: 2,
    difficulty: "Easy",
    topic: "Arrays",
    title: "Find Largest Element",
    description: "Find largest number in array.",
    problem:
      "Given an array of integers, return the largest element.",
    example:
`Input: [2,7,9,1]

Output: 9`,
    constraints: [
      "Array size <=1000",
      "O(n)"
    ]
  },

  {
    id: 3,
    difficulty: "Easy",
    topic: "Math",
    title: "Palindrome Number",
    description: "Check palindrome number.",
    problem:
      "Return true if number is palindrome otherwise false.",
    example:
`Input:121

Output:true`,
    constraints:[
      "0<=n<=100000"
    ]
  },

  {
    id:4,
    difficulty:"Easy",
    topic:"Loops",
    title:"Factorial",
    description:"Find factorial.",
    problem:"Calculate factorial of given number.",
    example:
`Input:5

Output:120`,
    constraints:[
      "1<=n<=20"
    ]
  },

  // ================= MEDIUM =================

  {
    id:5,
    difficulty:"Medium",
    topic:"Arrays",
    title:"Two Sum",
    description:"Find two numbers.",
    problem:
      "Return indices whose sum equals target.",
    example:
`nums=[2,7,11,15]
target=9

Output:[0,1]`,
    constraints:[
      "Exactly one solution exists."
    ]
  },

  {
    id:6,
    difficulty:"Medium",
    topic:"Searching",
    title:"Binary Search",
    description:"Binary Search implementation.",
    problem:
      "Search target using Binary Search.",
    example:
`Input:
1 3 5 7 9

Target=7

Output=3`,
    constraints:[
      "Sorted array"
    ]
  },

  {
    id:7,
    difficulty:"Medium",
    topic:"Stack",
    title:"Valid Parentheses",
    description:"Check balanced brackets.",
    problem:
      "Return true if brackets are balanced.",
    example:
`Input:
()[]{}

Output:
true`,
    constraints:[
      "Only (),{},[]"
    ]
  },

  // ================= HARD =================

  {
    id:8,
    difficulty:"Hard",
    topic:"Graph",
    title:"Word Ladder",
    description:"Shortest transformation sequence.",
    problem:
      "Find minimum transformation steps.",
    example:
`Input:
hit
cog

Output:
5`,
    constraints:[
      "Dictionary provided"
    ]
  },

  {
    id:9,
    difficulty:"Hard",
    topic:"Design",
    title:"LRU Cache",
    description:"Design LRU Cache.",
    problem:
      "Support get() and put() in O(1).",
    example:
`Capacity=2`,
    constraints:[
      "O(1)"
    ]
  },

  {
    id:10,
    difficulty:"Hard",
    topic:"Arrays",
    title:"Merge Intervals",
    description:"Merge overlapping intervals.",
    problem:
      "Merge all overlapping intervals.",
    example:
`[[1,3],[2,6]]

Output:
[[1,6]]`,
    constraints:[
      "Sort first"
    ]
  }

];

export default codingQuestions;