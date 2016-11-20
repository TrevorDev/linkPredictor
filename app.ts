// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function sigmoid(x){
  return 1 / (1 + Math.exp(-x));
}

class Edge {
  weight:number = 1
  inputNode: Vert
  constructor(){
    this.weight = randn_bm()
  }
}
class Vert {
  val:number = 0
  inputConnections:Edge[] = []
  compute(){
    this.val = sigmoid(this.inputConnections.map((e)=>e.weight*e.inputNode.val).reduce((prev, cur)=> prev+cur, 0))
    console.log(this.val)
  }
  constructor(){

  }
}
class Layer {
  verticies: Vert[] = []
  constructor(size:number){
     for(var i = 0;i<size;i++){
       this.verticies.push(new Vert())
     }
  }
  toNumArr():number[]{
    return this.verticies.map((v)=>v.val)
  }
}
class Network {
  layers:Layer[] = []
  compute(input:number[]):number[]{
    //setup input layer
    var inputLayer = this.layers[0]
    inputLayer.verticies.forEach((v, i)=>{
      v.val = sigmoid(input[i])
    })

    //compute each layer
    this.layers.forEach((layer, index)=>{
      if(index > 0){
        layer.verticies.forEach((vert)=>{
          vert.compute()
        })
      }
    })

    //output layer
    var outputLayer = this.layers[this.layers.length - 1]
    return outputLayer.toNumArr()
  }
  train(inputLayer:number[], outputLayer:number[]){
    //TODO
  }
  constructor(layerSizes:number[]){
    //initialize unconnected layers
    layerSizes.forEach((size, index)=>{
      this.layers.push(new Layer(size))
    })

    //create edges
    this.layers.forEach((curLayer, index)=>{
      if(index > 0){
        var prevLayer = this.layers[index-1]
        prevLayer.verticies.forEach((prevVert)=>{
          curLayer.verticies.forEach((curVert)=>{
            var edge = new Edge()
            edge.inputNode = prevVert
            curVert.inputConnections.push(edge)
          })
        })
      }
    })
  }
}
var main = async ()=>{
  var nn = new Network([2,2,2])
  nn.train([2,3], [3, 6])
  nn.train([5,2], [6, 10])
  nn.train([1,1], [2, 1])
  console.log(nn.compute([5,3]))

  // var trainInput = []
  // var expectedOutput = []
  //
  // for(var i=0;i<2;i++){
  //   for(var j=0;j<5;j++){
  //     for(var k=0;k<2;k++){
  //       var inputSet = [i,j,k]
  //       var outputSet = [(i+j+k)/(1+j), Math.tanh(j)]
  //       trainInput.push(inputSet)
  //       expectedOutput.push(outputSet)
  //     }
  //   }
  // }
  // console.log(trainInput)
  // console.log(expectedOutput)
}
main()
