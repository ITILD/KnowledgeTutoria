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
  "  gl_Position = a_Position;\n" + // 设置顶点的位置
  "  gl_PointSize = 10.0;\n" + // 设置顶点的大小
  "}\n";

// 片元着色器代码（给像素上色）
let FSHADER_SOURCE =
  "void main() {\n" +
  "  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n" + // 设置顶点的颜色
  "}\n";

let canvas = document.getElementById("webgldom");
let gl = canvas.getContext("webgl");
let program = GLStart.initShaderProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
gl.program = program;
gl.useProgram(program);

let n = initVertexBuffers(gl);

// 每一次重绘时的背景色
gl.clearColor(0.5, 0.5, 0.5, 1.0);

// 清除 <canvas>
gl.clear(gl.COLOR_BUFFER_BIT);

// 画n个点
gl.drawArrays(gl.POINTS, 0, n);

function initVertexBuffers(gl) {
  let vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  // 画三个点
  let n = 3;

  // 创建一个缓存对象，用于存放顶点数据
  let vertexBuffer = gl.createBuffer();
  // 绑定缓存对象
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 把数据写到缓冲对象中
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  // 获取顶点着色器代码中的顶点变量
  let a_Position = gl.getAttribLocation(gl.program, "a_Position");
  // 设置变量获取数据规则
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // 允许变量从 ARRAY_BUFFER目标上绑定的缓冲区对象获取数据
  gl.enableVertexAttribArray(a_Position);

  return n;
}
// 获取WebGL上下文
function createWebGLContext(canvas) {
  let names = ["experimental-webgl", "webgl", "webkit-3d", "moz-webgl"];
  let webglContext = null;
  for (let i = 0; i < names.length; i++) {
    try {
      webglContext = canvas.getContext(names[i]);
      if (webglContext) {
        break;
      }
    } catch (e) {}
  }
  return webglContext;
}
Float32Array.length