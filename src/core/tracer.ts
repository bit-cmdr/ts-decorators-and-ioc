/* eslint-disable @typescript-eslint/ban-types */
import pkg from 'dd-trace';

const { tracer } = pkg;

tracer.init({
  plugins: false,
  logInjection: true,
}); // initialized in a different file to avoid hoisting.

tracer.use('express', {
  enabled: true,
});

tracer.use('graphql', {
  enabled: true,
  signature: true,
  source: true,
});

tracer.use('aws-sdk', {
  enabled: true,
  sqs: true,
  dynamodb: true,
  eventbridge: true,
  lambda: true,
});

export function apm<Args extends unknown[], Return>(className: string) {
  return (
    _: unknown,
    methodName: string,
    context: TypedPropertyDescriptor<(...args: Args) => Return>,
  ) => {
    let fn: (...args: Args) => Return;
    let patchedFn: ((...args: Args) => Return) | undefined;
    const prefix = `${className}.${methodName}`;

    if (context.value) {
      fn = context.value;
    }

    return {
      configurable: true,
      enumerable: false,
      get() {
        if (!patchedFn) {
          patchedFn = tracer.wrap(prefix, (...args: Args) =>
            fn.call(this, ...args),
          );
        }
        return patchedFn;
      },
      set: (newFn: (...args: Args) => Return) => {
        patchedFn = undefined;
        fn = newFn;
      },
    };
  };
}

export default tracer;
