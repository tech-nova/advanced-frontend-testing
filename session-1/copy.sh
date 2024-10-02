#!/bin/bash

# Define the source directory
SOURCE_DIR=~/Developer/advanced-frontend-testing-draft/space-station-docking-system/

# Define the branches and their corresponding exercise numbers
BRANCHES=(
    "4-problem:4"
    "5-problem:5"
    "6-problem:6"
    "7-problem:7"
    "7.2-problem:7.2"
    "8-problem:8"
    "4-solution:4"
    "5-solution:5"
    "6-solution:6"
    "7-solution:7"
    "7.2-solution:7.2"
    "8-solution:8"
)

# Function to copy files
copy_files() {
    local branch=$1
    local exercise=$2
    local type=$3

    # Create the destination directory
    mkdir -p "./exercise-$exercise/$type"

    # Checkout the branch
    git -C "$SOURCE_DIR" checkout "$branch"

    # Copy files, excluding node_modules
    rsync -av --exclude='node_modules' "$SOURCE_DIR" "./exercise-$exercise/$type/"

    echo "Copied $branch to ./exercise-$exercise/$type"
}

# Main loop
for branch_info in "${BRANCHES[@]}"; do
    IFS=':' read -r branch exercise <<< "$branch_info"

    if [[ $branch == *-problem ]]; then
        copy_files "$branch" "$exercise" "problem"
    elif [[ $branch == *-solution ]]; then
        copy_files "$branch" "$exercise" "solution"
    fi
done

echo "All copying operations completed."
