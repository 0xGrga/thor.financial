# thor.financial

This project is functional version of [Thor Financial Treasury](https://treasury.thor.financial/), site is now fully defunct, I created this project to learn JS and to learn more about web development. I have no relations with Thor project.

### Install Dependencies

In project directory, run: `npm install`

This install all node modules needed.

### Starting project

To start project, enter project directory and simply run:`npm start`

This will automatically open new tab in your browser, you can see site from [http://localhost:3000](http://localhost:3000)

### Building project

To build run: `npm run build`

This will build project, after than you can find all files needed for hosting a site in `build` folder. After that you can run:

```
npm install -g serve
serve -s build
```

to host the site on local machine, but in most cases you want to take those files and upload them to a proper server

### Testing project
For running test of project run: `npm test`

This will launch interactive test runner, that will help with finding error and bugs in project
