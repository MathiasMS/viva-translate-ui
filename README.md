# Viva Translate UI
Viva translate UI is the main frontend component layer for viva translate challenge. The frontend is built using Typescript, Create React App, and Redux.

- [Typescript](https://www.typescriptlang.org/docs/home.html) - A strongly typed, object oriented, compiled language.
- [Create React App](https://create-react-app.dev) - Tool to create single-page React applications that is officially supported by the React team.
- [Redux](https://redux.js.org/) - Redux is simply a store to store the state in your app

## Development
To start development, Please do the following. Note: this service depends on the [Viva Translate Api](https://github.com/MathiasMS/viva-translate-be). So make sure you have run it to enjoy the app!
### Configuration
Add env variables to run the project adding the following or use the defaults value.
``` touch .env ```
#### .env
```
//Application variables
REACT_APP_VIVA_APPLICATION_API_URL=http://localhost:5000
`````

#### Run the Project
Run the following commands. The app will run in watch mode at http://locahost:3000/
``` npm install ```
``` npm run start ```

## Production Build
To create a production build, please run the following:
``` npm run build ```
