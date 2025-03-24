# Initialize the .git directory

we get the git command.
for now we only handle the `init` command.

In the init case, we create a `.git` folder, and in it `objects` and `refs`; then a `HEAD` file with `ref: refs/heads/main` in it