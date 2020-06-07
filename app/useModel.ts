export class UseModel {
    classNames = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

    static doPrediction(model : any, data : any, testDataSize = 500) {
        const IMAGE_WIDTH = 28;
        const IMAGE_HEIGHT = 28;
        const testData = data.nextTestBatch(testDataSize);
        const testxs = testData.xs.reshape([testDataSize, IMAGE_WIDTH, IMAGE_HEIGHT, 1]);
        const labels = testData.labels.argMax(-1);
        const preds = model.predict(testxs).argMax(-1);

        testxs.dispose();
        return [preds, labels];
    }


    static async showAccuracy(model : any, data : any) {
        const [preds, labels] = UseModel.doPrediction(model, data);
        //const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
        const container = {name: 'Accuracy', tab: 'Evaluation'};
        //tfvis.show.perClassAccuracy(container, classAccuracy, classNames);

        labels.dispose();
    }

    static async showConfusion(model : any, data : any) {
        const [preds, labels] = UseModel.doPrediction(model, data);
        //const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
        const container = {name: 'Confusion Matrix', tab: 'Evaluation'};
        //tfvis.render.confusionMatrix(
        //container, {values: confusionMatrix}, classNames);

        labels.dispose();
    }
}
