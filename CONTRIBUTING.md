## Contributing

Want to contribute to RAWGraphs's development? You are more than welcome! Start by cloning the repository (the "Code" button at the top-right corner of this page) and follow the instructions in [README file](https://github.com/rawgraphs/rawgraphs-app#installation) to install dependencies and set it up.
Then you can use Github's issues and pull requests to discuss and share your work.

You will need to sign a [Contributor License Agreement (CLA)](https://www.clahub.com/agreements/densitydesign/raw) before making a submission. It will be automatically prompted in the moment you will make a "pull request" to the repository. We adopted CLA to be sure that the project will remain open source.
For more information, write us: <hello@rawgraphs.io>.

## The "obvius fix" RULE

Inspired by [CARTO](https://carto.com/contributions/#obvious-fix) "obvious fix" rule we decided to integrate that rule also into our contribution policy.
RAWGraphs's contribution policy is aimed at encouraging broad participation from our community and minimizing risks to the project owners and our community due to inappropriate contributions of the intellectual property of others.
As a general standard, RAWGraphs requires every contributor to fill out a Contributor License Agreement (“CLA”), either individually or on behalf of a corporate entity.
HOWEVER, very small contributions (such as fixing spelling errors), where the content change is small enough to not be considered intellectual property, can be submitted by a contributor as a patch, without a CLA.

## How does the obvious fix rule work?

Any committer may commit fixes without first signing a CLA for obvious typos, grammar mistakes, and formatting problems wherever they may be.
Whenever you invoke the Obvious Fix Rule, please say so in your commit message. For example:

```
commit fed5f73b831906878a32bddaee98dcc5652f1716
Author: giovanna <giovanna@rawgraphs.io>
Date: Mon Feb 06 09:41:00 2017 +0100
Fix typo in README.
Obvious fix.
```

## What qualifies as an obvious fix?

An obvious fix is a pull request that does not contain creative work. We rely on your judgment to determine what is “obvious”; if you’re not sure, just ask by sending an email to: hello@rawgraphs.io
As a rule of thumb, changes are obvious fixes if they do not introduce any new functionality or creative thinking. As long as the change does not affect functionality, some likely examples include the following:

- Spelling/grammar fixes;
- Correcting typos;
- Cleaning up comments in the code;
- Changes to white space or formatting;
- Bug fixes that change default return values or error codes stored in constants, literals, or simple variable types;
- Adding logging messages or debugging output;
- Changes to ‘metadata’ files like Gemfile, rebar.config, Makefile, app.config, sys.config, .gitignore, example configuration files, build scripts, etc.;
- Changes that reflect outside facts, like renaming a build directory or changing a constant;
- Changes in build or installation scripts;
- Re-ordering of objects or subroutines within a source file (such as alphabetizing routines);
- Moving source files from one directory or package to another, with no changes in code;
- Breaking a source file into multiple source files, or consolidating multiple source files into one source file, with no change in code behavior;
- Changes to words or phrases isolated from their context;
- Changes to typeface.
