import { Request,Response } from 'express';
let tf = require('@tensorflow/tfjs-node');
import * as fs from "fs";
import {UseModel} from "../useModel";

export class ResultController {
    /**
     * @param {Request} req The request
     * @param {Response} res The response
     */
    static async render(req :Request, res :Response){
        const data = tf.tensor(req.body.data);
        fs.realpath('./app/model-save/model.json',  async(error, resolvedPath) => {
            if (error) {
                console.log(error);
            }
            else {
                const model = await tf.loadLayersModel('file://'+resolvedPath);
                const prediction = await (UseModel.doPrediction(model,data).data());
                res.set("Content-Type",'application/json');
                res.send({result :'Vous avez écrit un : '+prediction[0]+'.'})
            }
        });
    }
}
