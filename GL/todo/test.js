/**
 * _ 私有属性和方法
 *
 * 无状态或纯pipe式处理 静态工具类
 */
class GLStart {
  constructor() {}

  /**
   * 编译shader代码
   * @param {*} gl
   * @param {*} type
   * @param {*} source
   *  const vertexShader = _loadShader(gl, gl.VERTEX_SHADER, vsSource);
   * @returns
   */
  static _loadShader(gl, type, source) {
    const shader = gl.createShader(type); // 创建着色器对象
    gl.shaderSource(shader, source); // 提供shader代码  绑定资源
    gl.compileShader(shader); // 编译 -> 生成着色器
    return shader;
  }

  /**
   * 初始化一个着色程序
   * @param {*} gl
   * @param {*} vsSource
   * @param {*} fsSource
   * @returns
   */
  static initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = this._loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this._loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
  }
}

// 顶点着色器代码(决定顶在哪里，大小)
let VSHADER_SOURCE =
  "attribute vec4 a_Position;\n" +
  "void main() {\n" +
  "  gl_Position = a_Position;\n" // 设置顶点的位置
"}\n";

// 片元着色器代码（给像素上色）
let FSHADER_SOURCE =
  "void main() {\n" +
  "  gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);\n" + // 设置顶点的颜色
  "}\n";

// 1.获取webgl
let canvas = document.getElementById("webgldom");
let gl = canvas.getContext("webgl"); //WebGLRenderingContext对象 绘图上下文
// 2.清空屏幕
gl.clearColor(0.5, 0.5, 0.5, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// 3.初始化着色器程序
let program = GLStart.initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
gl.program = program;
gl.useProgram(program);
let n = initVertexBuffers(gl, [0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

// 画n个点
gl.drawArrays(gl.POINTS, 0, n);

function initVertexBuffers(gl, jsArray) {
  let vertices = new Float32Array(jsArray); //点位

  let vertexBuffer = gl.createBuffer(); // 创建一个缓存对象，用于存放顶点数据
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // 绑定缓存对象
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 把数据写到缓冲对象中
  let a_Position = gl.getAttribLocation(gl.program, "a_Position"); // 获取顶点着色器代码中的顶点变量
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0); // 设置变量获取数据规则
  gl.enableVertexAttribArray(a_Position); // 允许变量从 ARRAY_BUFFER目标上绑定的缓冲区对象获取数据
  return vertices.length / 2; //返回顶点数量
}



/* eslint no-console:0 consistent-return:0 */
"use strict";


function main() {
  // Get A WebGL contex

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // code above this line is initialization code.
  // code below this line is rendering code.

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

main();