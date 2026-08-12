# Branching and release flow

`main` is the release branch. `staging` is the integration branch. Work is
developed on short-lived `feature/*` branches and merged into `staging` after
review and checks pass. A tested staging commit is promoted to `main`.

Configure these repository rules in GitHub before enabling collaboration:

- Require pull requests and a passing build for `main` and `staging`.
- Disallow direct pushes and force pushes to `main` and `staging`.
- Require the branch to be up to date before merging.
- Allow only administrators to bypass the rules in an emergency.

The local branch names mirror this policy; GitHub branch protection itself must
be enabled in the repository settings because it is enforced remotely.
