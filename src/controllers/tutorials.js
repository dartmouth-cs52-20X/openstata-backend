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
// Note: Describe has aliases; you can also just type "d" in place of "describe"
describe

// Let's get some summary statistics about the variable age
// We use the "summarize" comamnd to do this.
// "summarize" works just like describe (with our without a list of variables)
// Note: Summarize also has aliases; you can try "su" in place of "summarize"
summarize age

// Now it's your turn!
// If you get stuck, take a look our docs to see a list of all supported commands and how each is used.

// Write a command to find out the what type the variable sex is
// (i.e. is it a float? a string?)

// Finally, get summary statistics for all variables in the dataset with one command

`,
    tutorialID: 'tutorial_01',
  },
  {
    fileName: 'Tutorial 2 - Clearing data and logging output',
    content:
`// Welcome to OpenStata tutorials!
// Tutorial #2: Clearing data and log files

// Reminder: Stata works with one dataset at a time; that dataset is referred to as "in memory".
// Sometimes we want to change which data we are working with in the middle of a program.
// To do this, we use the "clear" command (just the word "clear")
// Then we can load another dataset with another use command.

// Additionally, at times we want to store the output of our program.
// Stata provides commands to automatically create "log" files (text files with the ending .log)
// These files just store the output you see on the left side after running a program.
// To start logging output, we use the command "log using filename"
// Note that this running this command will automatically replace a pre-existing log file of the same name
// in our implementation, but in regular Stata, you would add the option replace: "log using filename, replace"
// To store a log file, you will need to stop logging before the end of your program.
// Close the log file with "capture log close."

// Now on to the fun part! The first three commands below are done for you!
// Press the "Run" button in the bottom right to see how they work.
// Then fill in the last three commands yourself!
// If you get the right commands, your output should end with "Tutorial Passed!"

// First, we want to load our data:
use tutorial-one

// Oops, that's the wrong one! Let's clear the data in memory.
clear

// And load the correct data:
use tutorial-two

// Now it's your turn!
// If you get stuck, take a look our docs to see a list of all supported commands and how each is used.
// Write a command to begin logging output in a file called "tutorial-two"

// Write a command to summarize the dataset

// Write a command to close the log file.

// To see that your code worked, you click the log files folder
// in the left hand side navigation pane, and see that a "tutorial-two" log file is created
// Double click to view what was logged!

`,
    tutorialID: 'tutorial_02',
  },
  {
    fileName: 'Tutorial 3 - Generate, Mean, Regression',
    content:
`// Welcome to OpenStata tutorials!
// Tutorial #3: Generate, mean, regress

// You've made it to the most important tutorial!
// These are the commands that may be most useful for initial work with Stata.

// Load the tutorial data
use tutorial-three

// Let's say you want to find the mean of an a variable age. Easy!
mean age

// Often, we are interested in the relationship between two variables.
// For example: wages and age. Let's run a regression of the wage_hr (hourly wage) variable on age
// using the "regress" command (alias: "reg").
regress wage_hr age

// What if we're interested in seeing whether hourly wages are related to
// either transformation of the variable age? We can generate a new variable in Stata with
// the "generate" command (alias: "gen"). It's syntax is:
// gen newvariable = [do something with oldvariable]
// For example, if we want to generate a variable that represent a persons
// age minus their years of education:
// gen newvar = age - yrsed

// Now on to the fun part! Press the "Run" button in the bottom right
// to see how the above commands work. Then fill in the last four commands yourself!
// If you get the right commands, your output should end with "Tutorial Passed!"
// If you get stuck, take a look our docs to see a list of all supported commands and how each is used.

// Start a new log file with the file name "tutorial-three"

// Generate a new variable called "age2" which is equal to the age variable squared.

// Finally, regress hourly wages on the two variables age and age2!

// Remember to close your log file to save it as well.

`,
    tutorialID: 'tutorial_03',
  },
];

export default tutorials;
