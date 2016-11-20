var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
function randn_bm() {
    var u = 1 - Math.random();
    var v = 1 - Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
class Edge {
    constructor() {
        this.weight = 1;
        this.weight = randn_bm();
    }
}
class Vert {
    constructor() {
        this.val = 0;
        this.inputConnections = [];
    }
    compute() {
        this.val = sigmoid(this.inputConnections.map((e) => e.weight * e.inputNode.val).reduce((prev, cur) => prev + cur, 0));
        console.log(this.val);
    }
}
class Layer {
    constructor(size) {
        this.verticies = [];
        for (var i = 0; i < size; i++) {
            this.verticies.push(new Vert());
        }
    }
    toNumArr() {
        return this.verticies.map((v) => v.val);
    }
}
class Network {
    constructor(layerSizes) {
        this.layers = [];
        layerSizes.forEach((size, index) => {
            this.layers.push(new Layer(size));
        });
        this.layers.forEach((curLayer, index) => {
            if (index > 0) {
                var prevLayer = this.layers[index - 1];
                prevLayer.verticies.forEach((prevVert) => {
                    curLayer.verticies.forEach((curVert) => {
                        var edge = new Edge();
                        edge.inputNode = prevVert;
                        curVert.inputConnections.push(edge);
                    });
                });
            }
        });
    }
    compute(input) {
        var inputLayer = this.layers[0];
        inputLayer.verticies.forEach((v, i) => {
            v.val = sigmoid(input[i]);
        });
        this.layers.forEach((layer, index) => {
            if (index > 0) {
                layer.verticies.forEach((vert) => {
                    vert.compute();
                });
            }
        });
        var outputLayer = this.layers[this.layers.length - 1];
        return outputLayer.toNumArr();
    }
    train(inputLayer, outputLayer) {
    }
}
var main = () => __awaiter(this, void 0, void 0, function* () {
    var nn = new Network([2, 2, 2]);
    nn.train([2, 3], [3, 6]);
    nn.train([5, 2], [6, 10]);
    nn.train([1, 1], [2, 1]);
    console.log(nn.compute([5, 3]));
});
main();
