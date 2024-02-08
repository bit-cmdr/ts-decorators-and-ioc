import { SSTConfig } from "sst";

export default {
  config(_input) {
    return {
      name: "rest-api",
      region: "us-west-1",
    };
  },

  stacks(app) { }
} satisfies SSTConfig;