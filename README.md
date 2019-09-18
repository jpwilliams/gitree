# @jpwilliams/gitree

Print a directory tree that shows Git status and ignores files dictated by `.gitignore`.

``` sh
$ npm i -g @jpwilliams/gitree
$ gitree

# OR

$ npx @jpwilliams/gitree
```

<p align="center">
  <img src="https://user-images.githubusercontent.com/1736957/65135842-8783e780-d9fe-11e9-887b-3e04381795ac.png">
</p>

# What?

`gitree` works very similarly to [tree](https://linux.die.net/man/1/tree) but only lists files related to the current git repository.

Like Git, `gitree` only tracks _files_, so empty directories will never be listed. If you wish to push an empty folder to a Git repository, add an empty `.gitignore` or `.gitkeep` file to the directory and commit it.

# What does it show?

`gitree` shows any files that your repository's `.gitignore` files allows you to see, marking them with useful statuses like the ones in the screenshot above.

# What if it's not a Git repository?

It won't work. You must be somewhere within a Git repository to list any files. If you just want a basic tree view _without_ Git integration, consider the built-in `tree` command for Linux/Windows or the [`tree` homebrew formula](http://brewformulas.org/Tree) for Mac OSX.

# What else can it do?

Just this stuff:

``` sh
Usage: gitree [options] [dir]


Options:

  -V, --version           output the version number
  -m, --modified          only show modified files
  -t, --tracked           only show tracked files
  -I, --ignore <pattern>  do not list files that match the given pattern
  -h, --help              output usage information
```

# Can it get any cooler?

There's a built-in alias, `gt`. Fantabulous, eh?
