// @ts-check

const UNIFORM_LOC_NULL = /** @type {WebGLUniformLocation  | null} */ (null);
const VERT_SHADER = `#version 300 es
  in vec2 a_vertex;
  out vec2 v_vertex;

  void main() {
    v_vertex = a_vertex;
    gl_Position = vec4(a_vertex, 0, 1);
  }`;

export class ShaderRunner extends HTMLElement {
  /** @type {WebGL2RenderingContext} */ gl;
  ready = false;
  uniforms = {
    time: {
      value: 0.0,
      type: "uniform1f",
      loc: UNIFORM_LOC_NULL,
    },
    resolution: {
      value: [0.0, 0.0],
      type: "uniform2fv",
      loc: UNIFORM_LOC_NULL,
    },
    pointer: {
      value: [0.0, 0.0],
      type: "uniform2fv",
      loc: UNIFORM_LOC_NULL,
    },
  };

  constructor() {
    super();

    this.canvas = document.createElement("canvas");
    this.canvas.style.display = "block";
    this.canvas.style.background = "black";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.touchAction = "none";

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(this.canvas);

    const gl = this.canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("WebGL2 not supported");
    }
    this.gl = gl;

    this.canvas.addEventListener("pointermove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.uniforms.pointer.value[0] = e.clientX - rect.left;
      this.uniforms.pointer.value[1] =
        this.canvas.height - (e.clientY - rect.top);
    });

    if (this.getAttribute("animate") !== null) {
      const renderLoop = (/** @type {number} */ timestamp) => {
        this.uniforms.time.value = timestamp;
        this.render(this.gl);
        window.requestAnimationFrame(renderLoop);
      };
      window.requestAnimationFrame(renderLoop);
    }
  }

  resizeObserver = new ResizeObserver(() => this.resize());
  connectedCallback() {
    this.resizeObserver.observe(this);
  }
  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }
  resize() {
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    this.uniforms.resolution.value[0] = this.canvas.width;
    this.uniforms.resolution.value[1] = this.canvas.height;
    this.uniforms.pointer.value[0] = this.canvas.width / 2;
    this.uniforms.pointer.value[1] = this.canvas.height / 2;
  }

  static observedAttributes = ["frag-src"];
  async attributeChangedCallback(
    /** @type {string} */ attrName,
    /** @type {string} */ _oldValue,
    /** @type {string} */ newValue
  ) {
    if (attrName === "frag-src" && newValue) {
      this.ready = false;
      const fragShaderUrl = newValue;
      const fragShaderSource = await fetchText(fragShaderUrl);
      this.compileAndInitProgram(this.gl, fragShaderSource);
      this.ready = true;
      this.render(this.gl);
    }
  }

  compileAndInitProgram(
    /** @type {WebGL2RenderingContext} */ gl,
    /** @type {string} */ fragShaderSource
  ) {
    const vertShader = compileShader(gl, gl.VERTEX_SHADER, VERT_SHADER);
    const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(
        "Shader program failed to link: " + gl.getProgramInfoLog(program)
      );
    }

    for (const uniformName of Object.keys(this.uniforms)) {
      this.uniforms[uniformName].loc = gl.getUniformLocation(
        program,
        "u_" + uniformName
      );
    }

    const positionAttrLoc = gl.getAttribLocation(program, "a_vertex");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      // fill rect
      new Float32Array([-1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1]),
      gl.STATIC_DRAW
    );
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttrLoc);
    gl.vertexAttribPointer(positionAttrLoc, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);
  }

  render(/** @type {WebGL2RenderingContext} */ gl) {
    if (!this.ready) {
      return;
    }

    for (const uniform of Object.values(this.uniforms)) {
      gl[uniform.type](uniform.loc, uniform.value);
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clearColor(0, 0, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

async function fetchText(/** @type {string} */ url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return await response.text();
}

function compileShader(
  /** @type {WebGL2RenderingContext} */ gl,
  /** @type {GLenum} */ type,
  /** @type {string} */ source
) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Shader creation failed");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error("Shader compile error: " + gl.getShaderInfoLog(shader));
  }

  return shader;
}

customElements.define("shader-runner", ShaderRunner);
