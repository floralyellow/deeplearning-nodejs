import * as fs from "fs";

let tf = require('@tensorflow/tfjs-node');
const argparse = require('argparse');
import { MnistDataset } from './MnistData';
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views');
let twing = new TwingEnvironment(loader);
let express = require('express'),
    app = express();
import {UseModel} from './useModel';

app.get('/', async function (req :any, res :any) {
    twing.render('index.twig', /*{dataTest :await run()}*/).then((output : any) => {
        res.end(output);
    });
});

app.listen(3000);

/*async function showExamples(data : MnistDataset) {
    const  {images: trainImages, labels: trainLabels} = data.getTrainData();
    const numExamples = trainImages.shape[0];
    let imageArray = [];
    for (let i = 0; i < 3; i++) {
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
}*/

async function train(model : any, data: MnistDataset,epochs : number, batchSize : number, modelSavePath : string) {
    const {images: trainImages, labels: trainLabels} = data.getTrainData();
    model.summary();
    let epochBeginTime;
    let millisPerStep;
    const validationSplit = 0.15;
    const numTrainExamplesPerEpoch =
        trainImages.shape[0] * (1 - validationSplit);
    const numTrainBatchesPerEpoch =
        Math.ceil(numTrainExamplesPerEpoch / batchSize);
    await model.fit(trainImages, trainLabels, {
        epochs,
        batchSize,
        validationSplit
    });
    const {images: testImages, labels: testLabels} = data.getTestData();
    const evalOutput = model.evaluate(testImages, testLabels);

    console.log(
        `\nEvaluation result:\n` +
        `  Loss = ${evalOutput[0].dataSync()[0].toFixed(3)}; `+
        `Accuracy = ${evalOutput[1].dataSync()[0].toFixed(3)}`);

    if (modelSavePath != null) {
        await model.save(`file://${modelSavePath}`);
        console.log(`Saved model to path: ${modelSavePath}`);
    }
}
async function run() {
    const data = new MnistDataset;
    await data.loadData();

    const parser = new argparse.ArgumentParser({
        description: 'TensorFlow.js-Node MNIST Example.',
        addHelp: true
    });
    parser.addArgument('--epochs', {
        type: 'int',
        defaultValue: 20,
        help: 'Number of epochs to train the model for.'
    });
    parser.addArgument('--batch_size', {
        type: 'int',
        defaultValue: 128,
        help: 'Batch size to be used during model training.'
    });
    parser.addArgument('--model_save_path', {
        type: 'string',
        defaultValue: './model-save',
        help: 'Path to which the model will be saved after training.'
    });
    const args = parser.parseArgs();
    if( fs.existsSync('./model-save')) {
        const model = await tf.loadLayersModel('./model-save/model.json');
    }
    else{
        const model = require('./model');
        await train(model, data, args.epochs, args.batch_size, args.model_save_path);
    }
    const prediction = UseModel.doPrediction(model,data);
    const confusion = await UseModel.showConfusion(model,data);
    const accuracy = await UseModel.showAccuracy(model,data);

    //return await showExamples(data);
}
