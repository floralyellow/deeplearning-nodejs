const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views');
let twing = new TwingEnvironment(loader);

export class HomeController {
    /**
    * @param {Request} req The request
    * @param {any} res The request
    */
    static render(req :Request, res :any){
        twing.render('index.twig').then((output : any) => {
            res.end(output);
        });
    }
}
