export class UseModel {
    classNames = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

    static doPrediction(model : any, data : any) {
        const IMAGE_WIDTH = 28;
        const IMAGE_HEIGHT = 28;

        const testxs = data.reshape([1, IMAGE_WIDTH, IMAGE_HEIGHT, 1]);
        const preds = model.predict(testxs).argMax(-1);

        testxs.dispose();
        return preds;
    }
}
