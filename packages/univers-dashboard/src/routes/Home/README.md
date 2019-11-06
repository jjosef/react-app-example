# Home route

- Components
  - HomeView

- Dependencies
  - react-univers-auth

The home page uses [conditional rendering]() to show the email login and proceed to a new view with the password. This is meant to be similar to a Google sign in which prompts for your email, then some secondary action could take like like looking up a user's gravatar.

The Auth container is a state service built on `redux`, it handles actions for logging in with the different Firebase providers such as Google and Facebook and maintains persistence throughout the app with the current logged in user.
