// eslint-disable-next-line
export default function next(value) {
  if (value) {
    if (value.errorDetails) return value.errorDetails;
  }
  return false;
}
