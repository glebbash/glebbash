#version 300 es

precision highp float;

uniform float u_time;

#define v v_vertex
in vec2 v_vertex;
out vec4 o_color;

float cycle = 2.6 * 3.0;
float zone = 0.3;

void main() {
  float t = u_time / 100.0;

  o_color = vec4(1);

  float scl = 5.0;

  vec2 p3 = vec2(0);
  p3.x = sin(t / cycle) / sin(v.y);
  p3.y = -atan(t / cycle) / cos(v.y) / 2.0;
  p3 /= 2.0;
  o_color /= distance(v, p3) / zone;
  o_color.b /= p3.y * scl;

  vec2 p2 = vec2(0);
  p2.x = cos(t / cycle) / sin(v.y);
  p2.y = sin(t / cycle) / cos(v.y) / 2.0;
  p2 /= 2.0;
  o_color /= distance(v, p2) / zone;
  o_color.b /= p2.y * scl;

  // vec2 p4 = vec2(0);
  // p4.x = sin(t / cycle) / sin(v.y);
  // p4.y = sin(t / cycle) / cos(v.y) / 2.0;
  // p4 /= 2.0;
  // o_color /= distance(v, p4) / zone;
  // o_color.b /= p4.y * scl;

  // if (v.y > 0.0) {
  //   o_color.a = 0.0;
  // }
}
