// slack token
// xoxp-2540982134-17693948869-849817580385-cfc913b3caee3c9580b2d3cc81706bf8


/**

npm i bluebird slack-node

CREATE YOUR TOKEN: https://api.slack.com/docs/oauth-test-tokens?team_id=T024G49EC&action=reissue&sudo=1

npm package:       https://www.npmjs.com/package/slack-node
user.list:         https://api.slack.com/methods/users.list
reactions.list:    https://api.slack.com/methods/reactions.list

* */
import { Slack } from 'slack-node';
import * as Promise from 'bluebird';

function Emojis() {
  const apiToken = 'xoxp-2540982134-17693948869-849817580385-cfc913b3caee3c9580b2d3cc81706bf8';
  const slack = new Slack(apiToken);

  Array.prototype.flatten = () => this.reduce((prev, cur) => {
    const more = [].concat(cur).some(Array.isArray);
    return prev.concat(more ? cur.flatten() : cur);
  }, []);

  function listUsers() {
    console.info('fetching users...');
    return new Promise(((win, lose) => {
      slack.api('users.list', (err, response) => {
        if (err) return lose(err);
        // console.info(response);
        const people = response.members;
        const active = people.filter((p) => !p.deleted);
        console.info('has:', people.length, 'total,', active.length, 'active');
        //
        win(active);
        // debug: win([active[0],active[1]])
      });
    }));
  }

  function getEmojis() {
    return new Promise(((resolve, reject) => {
      slack.api('emoji.list', (err, response) => {
        if (err) return lose(err);
        // name -> url||alias
        const emojis = response.emoji;
        const emojisAlias = [];
        const emojisUrl = [];
        const emojisAll = [];
        for (const key in emojis) {
          emojisAll.push(key);
          if (emojis[key].includes('alias:')) {
            emojisAlias.push(key);
          } else {
            emojisUrl.push(key);
          }
        }
        console.info('emojis:', emojisAll.length, emojisUrl.length, emojisAlias.length);
        resolve({ emojisAll, emojisUrl, emojisAlias });
      });
    }));
  }

  // reactionsFromUser({id:'U025188NM'})
  function reactionsFromUser(user) {
    const { id } = user;
    // console.info('fetching reactions from:', id, user.name);
    return new Promise(((resolve, reject) => {
      slack.api('reactions.list', { user: id, count: 100 }, (err, response) => {
        if (err) return reject(err);
        let totalCount = 0;
        // console.info(response)
        const { items } = response;
        const reactions = items
          .filter((m) => m.type === 'message')
          .map((r) => r.message.reactions.map((r) => r.name))
          .flatten();
        const reactionsCounted = {};
        reactions.forEach((r) => {
          totalCount += 1;
          reactionsCounted[r] = reactionsCounted[r] != null ? reactionsCounted[r] + 1 : 1;
        });
        console.info('Reactions', id, user.name, totalCount);
        resolve(reactionsCounted);
      });
    }));
  }


  function run() {
    // keep variables along the execution
    const ctx = {
      allReactions: {},
    };

    // start the chain
    return getEmojis().then((emojis) => {
      ctx.ourEmojis = emojis.emojisUrl;
      // console.info('ctx.emojis.emojisUrl', ctx.emojis.emojisUrl)
      return listUsers();
    }).then((activeUsers) => {
      console.info('activeUsers:', activeUsers.length);
      ctx.activeUsers = activeUsers;
      // name -> count of uses
      ctx.emojiCount = {};
      return Promise.map(activeUsers, reactionsFromUser, { concurrency: 3 });
    }).then((reactionsMap) => {
      console.info('aggregating data from', reactionsMap.length, 'emoji counts');
      reactionsMap.forEach((reactionsCounted) => { // each item is like emojiname -> use count
        for (const name in reactionsCounted) {
          if (ctx.allReactions[name] === undefined) ctx.allReactions[name] = 0;
          ctx.allReactions[name] += reactionsCounted[name];
        }
      });
    })
      // if any step along the way has failed it will break
      .catch((err) => console.error('!FAIL!', err))
      .then(() => {
        const ar = ctx.allReactions;
        // all of the emojis, default and custom
        const emojisSortedByUse = {};
        // only our emojis
        const ourEmojisUsage = {};
        Object.keys(ar).sort((a, b) => ar[b] - ar[a]).forEach((name) => {
          emojisSortedByUse[name] = ar[name];
          if (ctx.ourEmojis.includes(name)) ourEmojisUsage[name] = ar[name];
          else console.info(name, 'not found in ourEmojisUsage, which means its system default');
        });
        // fill with 0 emojis that were not used at all
        ctx.ourEmojis.forEach((name) => ourEmojisUsage[name] = ourEmojisUsage[name] || 0);
        console.info('Done! Total list of emojis used:');
        console.info(emojisSortedByUse);
        console.info('now our own custom emojis used:');
        console.info(ourEmojisUsage);
      });
  }

  run();
}

export default Emojis;
