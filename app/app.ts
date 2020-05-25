const tf = require('@tensorflow/tfjs');
import { MnistDataset } from './MnistData';
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views');
let twing = new TwingEnvironment(loader);
let express = require('express'),
    app = express();


app.get('/', async function (req :any, res :any) {
    twing.render('index.twig', {dataTest :await run()}).then((output : any) => {
        res.end(output);
    });
});

app.listen(3000);

async function showExamples(data : MnistDataset) {
    const  {images: trainImages, labels: trainLabels} = data.getTrainData();
    const numExamples = trainImages.shape[0];
    let imageArray = [];
    for (let i = 0; i < 1; i++) {
        const imageTensor = tf.tidy(() => {
            return trainImages
                .slice([i, 0], [1, trainImages.shape[1]])
                .reshape([28, 28, 1]);
        });
        const values = await imageTensor.data();
        imageArray.push(values);
        imageTensor.dispose();
    }
    return imageArray;
}
function getModel() {
    const model = tf.sequential({
        layers: [tf.layers.dense({units: 32, inputShape: [50]}),
            tf.layers.dense({units: 4})]
    });
    console.log(JSON.stringify(model.outputs[0].shape));
}
async function run() {
    const data = new MnistDataset;
    await data.loadData();
    return await showExamples(data);
}
