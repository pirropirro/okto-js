export function Refresh(_: any, __: string, descriptor: TypedPropertyDescriptor<any>) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    const result = originalMethod.apply(this, args);
    if (result && result.then) {
      return result.then(data => {
        if (this.__update__) this.__update__();
        return data;
      });
    } else {
      if (this.__update__) this.__update__();
      return result;
    }
  };

  return descriptor;
}
