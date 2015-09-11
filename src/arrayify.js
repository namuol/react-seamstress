export default function arrayify (obj) {
  return Array.isArray(obj) ? obj : [obj];
}