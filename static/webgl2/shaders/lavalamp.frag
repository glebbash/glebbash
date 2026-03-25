#version 300 es

precision highp float;

uniform float u_time;

#define v v_vertex
in vec2 v_vertex;
out vec4 o_color;

float cycle = 2.6 * 3.0;
float zone = 0.05;

void main() {
  float t = u_time / 100.0;

  vec2 p = vec2(0);
  p.x = cos(t / cycle);
  p.y = tan(t / cycle);
  p /= 2.0;

  o_color = vec4(0.7, 0, 0, 1);
  o_color /= (1.0 - v.y);
  o_color /= (v.y + 1.0);

  o_color /= distance(v, p) / zone;
}
