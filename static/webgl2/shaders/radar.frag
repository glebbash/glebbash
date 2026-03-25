#version 300 es

precision highp float;

uniform float u_time;

#define v v_vertex
in vec2 v_vertex;
out vec4 o_color;

float cycle = 2.6;
float zone = 0.05;

void main() {
  vec2 p = vec2(0);
  p.x = sin(u_time / cycle);
  p.y = cos(u_time / cycle);
  p /= 1.5;

  o_color = vec4(0, 0.5, 0, 1);
  o_color /= (1.0 - v.x);
  o_color /= (v.x + 1.0);
  o_color /= (1.0 - v.y);
  o_color /= (v.y + 1.0);

  o_color /= distance(v, p) / zone;
}
