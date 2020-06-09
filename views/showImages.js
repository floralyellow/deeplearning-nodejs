document.addEventListener(
    "DOMContentLoaded",
    setTimeout(function (test = /*{{ dataTest|json_encode() }}*/) {
    try{
        for( let i in test ){
            const arrayMoreValue = [];
            test[i].map(arr=> {
                arrayMoreValue.push(arr * 255);
                arrayMoreValue.push(arr * 255);
                arrayMoreValue.push(arr * 255);
                arrayMoreValue.push(255);
            });
            let transformArray = new Uint8Array(arrayMoreValue);
            let arrayTest = Uint8ClampedArray.from(transformArray);
            let image = new ImageData(arrayTest,28);
            let body = document.getElementsByTagName('body')[0];
            let canvas = document.createElement('canvas');
            canvas.width = 28;
            canvas.height = 28;
            body.appendChild(canvas);
            let ctx = canvas.getContext('2d');
            ctx.createImageData(image);
            ctx.putImageData(image, 0, 0);
        }
    }catch (e) {
        console.log(e)
    }
}
,10));
