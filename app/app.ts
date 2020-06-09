import {HomeController} from "./controller/HomeController";
import {ResultController} from "./controller/ResultController";
let bodyParser = require('body-parser');
let express = require('express'),
    app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', HomeController.render);
app.post('/result', ResultController.render);

app.listen(3000);

