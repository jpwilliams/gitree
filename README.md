# gitree

Print a directory tree that shows Git status and ignores files dictated by .gitignore.

``` sh
$ npm i -g gitree
$ gitree

# OR

$ npx gitree
```

![Example](https://user-images.githubusercontent.com/1736957/29526963-3e3c8178-868f-11e7-875f-a15364a49cf9.png)

# What?

`gitree` works very similarly to [tree](https://linux.die.net/man/1/tree) but only lists files related to the current git repository.

Like Git, `gitree` only tracks _files_, so empty directories will never be listed. If you wish to push an empty folder to a Git repository, add an empty `.gitignore` or `.gitkeep` file to the directory and commit it.

# What does it show?

`gitree` shows any files that your repository's `.gitignore` files allows you to see, marking them with useful statuses:

![Statuses](https://user-images.githubusercontent.com/1736957/29529312-12082cbc-8697-11e7-9d3e-a11f9bbb0d12.png)

# What if it's not a Git repository?

It won't work. You must be somewhere within a Git repository to list any files. If you just want a basic tree view _without_ Git integration, consider the built-in `tree` command for Linux/Windows or the [`tree` homebrew formula] for Mac OSX.

# Can it get any cooler?

There's a built-in alias, `gt`. Fantabulous, eh?
