#version 300 es

precision highp float;

uniform float u_time;

#define v v_vertex
in vec2 v_vertex;
out vec4 o_color;

float cycle = 2.6 * 3.0;
float zone = 0.2;

void main() {
  float t = u_time / 100.0;

  o_color = vec4(1);

  float scl = 5.0;

  vec2 p1 = vec2(0);
  p1.x = cos(t / cycle);
  p1.y = sin(t / cycle);
  p1 /= 2.0;
  o_color /= distance(v, p1) / zone;
  o_color.r /= p1.y * scl;

  vec2 p2 = vec2(0);
  p2.x = tan(t / cycle);
  p2.y = tan(t / cycle);
  p2 /= 2.0;
  o_color /= distance(v, p2) / zone;
  o_color.g /= p2.x * scl;

  vec2 p3 = vec2(0);
  p3.x = -tan(t / cycle);
  p3.y = sin(t / cycle);
  p3 /= 2.0;
  o_color /= distance(v, p3) / zone;
}
