# Get started

1. [Install Node.js](https://nodejs.org/en/download/)
1. `npm install --legacy-peer-deps` (only need to do that once)
1. `npm start`
1. Open [http://localhost:8080](http://localhost:8080) in a web browser
1. Make edits, save, and it'll reload!


## Other scripts


### Launching Storybook

```
npm run storybook
```


### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


## Staging website

Code in master will automatically get built and deployed to https://app.powerplanner.net via GitHub Actions (yes, straight to the main site). I think pull requests might get published to a staging site... it's using Azure Static Websites, so I think a pull request gets deployed to a subdomain. There might be issues with external pull requests not publishing to those staging sites though.