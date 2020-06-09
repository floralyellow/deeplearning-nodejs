let tf = require('@tensorflow/tfjs-node');
import {MnistDataset} from "../MnistData";
import * as fs from "fs";
const argparse = require('argparse');
export class TrainingController {
    async train(model : any, data: MnistDataset,epochs : number, batchSize : number, modelSavePath : string) {
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
    async runTest() {
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
            defaultValue: './app/model-save',
            help: 'Path to which the model will be saved after training.'
        });
        const args = parser.parseArgs();
        if( fs.existsSync('./model-save')) {
            const model = await tf.loadLayersModel('./model-save/model.json');
        }
        else{
            const model = require('./model');
            await this.train(model, data, args.epochs, args.batch_size, args.model_save_path);
        }
        //return await showExamples(data);
    }
}
