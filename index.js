const Slash = require('slash');
const fs = require('fs');

module.exports = function lastonline(dispatch) {
  const classes = {
    0: 'Warrior',
    1: 'Lancer',
    2: 'Slayer',
    3: 'Berserker',
    4: 'Sorcerer',
    5: 'Archer',
    6: 'Priest',
    7: 'Mystic',
    8: 'Reaper',
    9: 'Gunner',
    10: 'Brawler',
    11: 'Ninja',
    12: 'Valkyrie',
  };
  const slash = new Slash(dispatch);
  let members = new Array();
  let id;
  let name;
  let collect = false;

  function save() {
    const filename = name.replace(/\s+/g, '') + '.csv';
    const stream = fs.createWriteStream(filename);
    stream.on('open', () => {
      members.sort((a,b) => b.lastOnline - a.lastOnline);
      for (const e of members) {
        let last = new Date(Date.now() - e.lastOnline * 1000);
        last = last.toLocaleDateString();
        stream.write([e.name, last, e.level, classes[e.class], '\'' + e.note + '\''].join(','));
        stream.write('\n');
      }
      slash.print('Finished collecting guild list.');
      slash.print(`See bin directory for ${filename}`);
      stream.end();
    });
  }

  // Disable module until we're sure we're in a guild
  dispatch.hook('S_LOGIN', 1, () => {
    members = [];
    id = null;
  });

  dispatch.hook('S_GUILD_INFO', 1, (event) => {
    ({ id, name } = event);
  });

  dispatch.hook('S_GUILD_MEMBER_LIST', 1, (event) => {
    if (!collect) return;
    for (const m of event.members) {
      const ins = {name: m.name, lastOnline: m.lastOnline.low, note: m.note, level: m.level, class: m.class };
      if (members.find((a) => a.name === m.name)) continue;
      members.push(ins);
    }
    if (event.last) {
      collect = false;
      save();
    }

    // Squelch while collecting
    return false;
  });

  slash.on('glist', () => {
    if (!id) {
      slash.print('You are either not in a guild or this module is broken.');
      return;
    }
    collect = true;
    dispatch.toServer('C_REQUEST_GUILD_INFO', 1, { guildId: id, type: 5 });
  });
};
