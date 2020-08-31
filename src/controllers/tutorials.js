const tutorials = [
  {
    fileName: 'Tutorial 1 - Loading and Describing Data',
    content:
`// Welcome to OpenStata tutorials!
// Tutorial #1: Loading data and summarizing

// In Stata, each command in written on a new line.
// Stata executes these commands in order, line by line.
// Stata works with one dataset at a time; that dataset is referred to as "in memory".
// In this tutorial, we will load a tutorial dataset,
// and learn commands that summarize our data.

// Note: Lines that start with two forward slashes are comments.
// Stata ignores these lines and blank lines.

// The first three commands below are done for you!
// Press the "Run" button in the bottom right to see how they work.
// Then fill in the last two commands yourself!
// If you get the right commands, your output should end with "Tutorial Passed!"

// First, we want to load our data:
use tutorial-one

// Now let's see what variables our in our data.
// We use the "describe" command to find out.
// We can either just type "describe" to describe every variable in the dataset
// or type "describe varone vartwo" to learn more about varone and vartwo
describe

// Let's get some summary statistics about the variable age
// We use the "summarize" comamnd to do this.
// "summarize" works just like describe (with or without a list of variables)
summarize age

// Now it's your turn!
// If you get stuck, take a look our docs to see a list of all supported commands and how each is used.

// Write a command to find out the what type the variable sex is
// (i.e. it it a float? a string?)

// Finally, get summary statistics for all variables in the dataset with one command

`,
    tutorialID: 'tutorial_01',
  },
  {
    fileName: 'Tutorial 2',
    content:
`

`,
    tutorialID: 'tutorial_02',
  },
  {
    fileName: 'Tutorial 3',
    content:
`

`,
    tutorialID: 'tutorial_03',
  },
];

export default tutorials;
