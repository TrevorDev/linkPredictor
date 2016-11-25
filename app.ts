// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function sigmoid(x){
  return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x){
  return sigmoid(x)*(1-sigmoid(x))
}

class Edge {
  derivative:number = 0
  weight:number = 0
  inputNode: Vert
  outputNode: Vert
  getDerivative():number{
    //todo dont repeat this
    this.derivative = 0

    if(this.outputNode.outputConnections.length == 0){
      this.derivative = this.inputNode.val * this.outputNode.activePrime
    }else{
      this.derivative = this.outputNode.outputConnections.map(n=> this.inputNode.val * this.outputNode.activePrime * n.outputNode.activePrime * n.weight).reduce((prev, cur)=> prev+cur, 0)
    }

    return this.derivative
  }
  constructor(){
    this.weight = randn_bm()
  }
}
class Vert {
  val:number = 0
  activePrime:number = 0
  inputConnections:Edge[] = []
  outputConnections:Edge[] = []
  compute(){
    this.val = sigmoid(this.inputConnections
                              .map((e)=>e.weight*e.inputNode.val)
                              .reduce((prev, cur)=> prev+cur, 0))
    this.activePrime = sigmoidDerivative(this.inputConnections
                              .map((e)=>e.weight*e.inputNode.val)
                              .reduce((prev, cur)=> prev+cur, 0))
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
      v.val = input[i]//sigmoid(input[i])
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
    var computed = this.compute(inputLayer)
    var errDif = computed
                  .map((x, index)=> (computed[index]-outputLayer[index]))
    // var err = computed
    //             .map((x, index)=> (1/2)*(computed[index]-outputLayer[index])*(computed[index]-outputLayer[index]))
    //             .reduce((prev, cur)=> prev+cur, 0)
    var derivativeStart = errDif.map((x)=> -x)

    this.layers[this.layers.length-1].verticies.forEach((v, index)=>{
      v.activePrime *= derivativeStart[index]
    })

    this.layers.forEach((l, index)=>{
      if(index > 0){
        l.verticies.forEach((v)=>{
          v.inputConnections.forEach((e)=>{
            e.getDerivative()
          })
        })
      }
    })

    this.layers.forEach((l, index)=>{
      if(index > 0){
        l.verticies.forEach((v)=>{
          v.inputConnections.forEach((e)=>{
            e.weight += e.derivative * 0.5;
            //console.log(e.derivative)
          })
        })
      }
    })

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
            edge.outputNode = curVert
            curVert.inputConnections.push(edge)
            prevVert.outputConnections.push(edge)
          })
        })
      }
    })
  }
}
var main = async ()=>{
  var nn = new Network([2,5,2])
  for(var i =0; i<10000;i++){
    //nn.train([2,3], [0.5,0.5])
    nn.train([0,0],[0,0])
    nn.train([1,0],[0,1])
    nn.train([1,1],[1,1])
    nn.train([0,1],[0,1])
    // nn.train([1,1], [0,0])
  }

  console.log(nn.compute([0,0]))
  console.log(nn.compute([0,1]))
  console.log(nn.compute([1,1]))
  nn.layers.forEach((l, index)=>{
    if(index == nn.layers.length-1){
      return
    }
    l.verticies.forEach((v)=>{
      v.outputConnections.forEach(c => {
        //console.log(c.weight)
      })
    })
  })
}
  main().catch((e)=>{
    console.log(e)
  })
