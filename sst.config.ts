import { SSTConfig } from 'sst';
import { Stack } from 'sst/constructs';
import { RemovalPolicy, Tags } from 'aws-cdk-lib';
import { Datadog } from 'datadog-cdk-constructs-v2';
import { ExampleStack } from './stacks/ExampleStack';

export default {
  config(_input) {
    return {
      bootstrap: {
        stackName: 'SSTv2Bootstrap',
      },
      name: 'rest-api',
      region: 'us-west-1',
    };
  },

  async stacks(app) {
    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      nodejs: {
        format: 'esm',
        sourcemap: true,
      },
      architecture: 'arm_64',
      environment: {
        NODE_ENV: app.stage === 'prod' ? 'production' : 'dev',
        SERVICE_NAME: process.env.SERVICE_NAME as string,
      },
      logRetention: 'one_month',
      memorySize: '2048 MB',
      timeout: '5 minutes',
    });
    if (app.stage !== 'prod') {
      app.setDefaultRemovalPolicy(RemovalPolicy.DESTROY);
    }

    Tags.of(app).add('service', `${app.stage}-${app.name}`);

    app.stack(ExampleStack);

    app.node.children.forEach((stack) => {
      if (stack instanceof Stack) {
        Tags.of(stack).add('service', `${app.stage}-${app.name}`);
        Tags.of(stack).add('team', 'team-properties');
      }
    });

    if (!app.local) {
      await app.finish();

      app.node.children.forEach((stack) => {
        if (stack instanceof Stack) {
          // Datadog setup
          const datadog = new Datadog(stack, `${stack.stackName}-datadog`, {
            // Get the latest version from
            // https://github.com/Datadog/datadog-lambda-js/releases
            nodeLayerVersion: 104,
            // Get the latest version from
            // https://github.com/Datadog/datadog-lambda-extension/releases
            extensionLayerVersion: 52,
            apiKey: process.env.DD_API_KEY as string,
            service: process.env.SERVICE_NAME as string,
          });

          datadog.addLambdaFunctions(stack.getAllFunctions());
        }
      });
    }
  },
} satisfies SSTConfig;
