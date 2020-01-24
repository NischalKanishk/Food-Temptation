var express     = require('express');
var app         = express();
var port        = process.env.PORT || 3000;
var mongoose    = require('mongoose');
var passport    = require('passport');
var flash       = require('connect-flash');
var request     = require('request');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var methodOverride = require('method-override');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url,{
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true});


require('./config/passport')(passport);

app.use(express.static('public'));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use(session({secret: 'Airport-Authority-AK12'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Hosted '+ port);