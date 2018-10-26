#!/usr/bin/env bash

branch="testPro"

pre_confirm () {
    read -p "DANGEROUS: This script going to delete ${branch} and regenerate it with updated client code both on origin and local. Are you sparta? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1
    fi
}


has_uncommited_changes () {
    git update-index -q --ignore-submodules --refresh
    err=0

    if ! git diff-files --quiet --ignore-submodules --
    then
        echo >&2 "cannot $1: you have unstaged changes."
        git diff-files --name-status -r --ignore-submodules -- >&2
        err=1
    fi

    if ! git diff-index --cached --quiet HEAD --ignore-submodules --
    then
        echo >&2 "cannot $1: your index contains uncommitted changes."
        git diff-index --cached --name-status -r --ignore-submodules HEAD -- >&2
        err=1
    fi

    if [ $branch = $(git symbolic-ref --short -q HEAD) ]
    then
        echo >&2 "You're on ${branch}, which is reserved for ionic pro. Checkout to different branch you want to deploy."
        exit 1
    fi

    if [ $err = 1 ]
    then
        echo >&2 "You've uncommited changes. Please commit or stash them."
        exit 1
    fi
}

delete_git_branch () {
    echo -e "\n => Deleting ${branch} from git on both local and origin. You choose for it.\n"
    git push --delete origin ${branch}
    git branch -d ${branch}
}

the_amazon() {
    echo -e "\n => Checking out to ${branch} from present branch."
    git checkout -b ${branch}

    echo -e "\n => Preparing..."

    # Delete exerything except client.
    find * -maxdepth 0 -name 'client' -prune -o -exec rm -rf '{}';
}

#pre_confirm

#has_uncommited_changes

delete_git_branch

the_amazon

echo "Here"