#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;

#define v v_vertex
in vec2 v_vertex;
out vec4 o_color;

float zone = 0.05;

void main() {
  vec2 p = u_pointer / u_resolution;

  float d = distance((v + 1.0) / 2.0, p);

  o_color = vec4(cos(v.x), sin(v.yx), 1);

  float l = d / zone;
  o_color *= l;
}
