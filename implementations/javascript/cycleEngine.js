// Universal Cycle Framework (UCF)
// Minimal JavaScript implementation of the 8-step cycle engine.
//
// License: GPLv3 + Non-Commercial Addendum
// Original Author: zacco

class CycleContext {
  constructor(initialState = {}) {
    this.state = initialState;
    this.log = [];
    this.cycleCount = 0;
  }

  register(phase, data) {
    this.log.push({
      cycle: this.cycleCount,
      phase,
      timestamp: new Date().toISOString(),
      data
    });
  }
}

class CycleEngine {
  constructor(handlers = {}) {
    this.handlers = {
      request: handlers.request || ((ctx) => ctx),
      acquisition: handlers.acquisition || ((ctx) => ctx),
      holding: handlers.holding || ((ctx) => ctx),
      center: handlers.center || ((ctx) => ctx),
      progression: handlers.progression || ((ctx) => ctx),
      registration: handlers.registration || ((ctx) => ctx),
      emergence: handlers.emergence || ((ctx) => ctx),
      return: handlers.return || ((ctx) => ctx)
    };
  }

  async runCycle(context) {
    context.cycleCount += 1;

    // 1. Request
    context = await this.handlers.request(context);
    context.register('request', context.state);

    // 2. Acquisition
    context = await this.handlers.acquisition(context);
    context.register('acquisition', context.state);

    // 3. Holding
    context = await this.handlers.holding(context);
    context.register('holding', context.state);

    // 4. Center
    context = await this.handlers.center(context);
    context.register('center', context.state);

    // 5. Progression
    context = await this.handlers.progression(context);
    context.register('progression', context.state);

    // 6. Registration
    context = await this.handlers.registration(context);
    context.register('registration', context.state);

    // 7. Emergence
    context = await this.handlers.emergence(context);
    context.register('emergence', context.state);

    // 8. Return
    context = await this.handlers.return(context);
    context.register('return', context.state);

    return context;
  }
}

// Example: minimal usage
// (you can move this to a separate example file if you want)

async function example() {
  const ctx = new CycleContext({ value: 0 });

  const engine = new CycleEngine({
    request: (ctx) => {
      ctx.state.intent = 'increment';
      return ctx;
    },
    acquisition: (ctx) => {
      ctx.state.input = 1;
      return ctx;
    },
    holding: (ctx) => {
      ctx.state.buffer = ctx.state.input;
      return ctx;
    },
    center: (ctx) => {
      ctx.state.operation = 'add';
      return ctx;
    },
    progression: (ctx) => {
      if (ctx.state.operation === 'add') {
        ctx.state.value = (ctx.state.value || 0) + ctx.state.buffer;
      }
      return ctx;
    },
    registration: (ctx) => {
      ctx.state.lastResult = ctx.state.value;
      return ctx;
    },
    emergence: (ctx) => {
      ctx.state.output = ctx.state.value;
      return ctx;
    },
    return: (ctx) => {
      ctx.state.previous = ctx.state.output;
      return ctx;
    }
  });

  const result = await engine.runCycle(ctx);
  console.log('Final state:', result.state);
  console.log('Log:', result.log);
}

// Uncomment to run example in Node:
// example();

module.exports = {
  CycleContext,
  CycleEngine
};
