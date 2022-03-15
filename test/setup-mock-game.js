const game = {
  creeps: { },
  rooms: [ ],
  spawns: { },
  time: 100,
  cpu: {
    getUsed: () => 0,
  }
};

const memory = {
  creeps: { },
};

global.ResetGlobalGameContext = function () {
  global.Game = _.cloneDeep(game);
  global.Memory = _.cloneDeep(memory);
}

ResetGlobalGameContext();
