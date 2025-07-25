const { Client, GatewayIntentBits, Partials } = require('discord.js');
const config = require('./config.json');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ],
    partials: [Partials.GuildMember],
});
const readline = require('readline');
require('colors');

console.log('[KEVN_BRODCAST]'.black + ` Loading broadcast system... `.yellow);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});
const waitjs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatTimeReamining = (milliseconds) => {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    let time = '';
    if (days > 0) time += `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) {
        if (time.length > 0) time += ' and ';
        time += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
        if (time.length > 0) time += ' and ';
        time += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    if (seconds > 0) {
        if (time.length > 0) time += ' and ';
        time += `${seconds} second${seconds > 1 ? 's' : ''}`;
    }
    return time;

};

const formatTime = (milliseconds) => {
    const ms = milliseconds % 1000;
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);

    return `${hours}:${minutes}:${seconds}:${ms}`;
};

async function askMultiline(question, endWord = 'DONE') {
    console.log(question);
    console.log(`[WIN_SYSTEM] (Write your message. When finished type '${endWord}' on a new line)`.blue);

    let lines = [];

    while (true) {
        const line = await ask('');
        if (line.trim().toUpperCase() === endWord.toUpperCase()) break;
        lines.push(line);
    }

    return lines.join('\n');
}
const ask = (question) => new Promise(resolve => rl.question(question, resolve));

rl.question('[KEVN_BRODCAST]'.black + ' Enter discord token (for config write: config): '.green, async (token) => {
    rl.pause();
    if (token.trim() !== 'config') {
        config.token = token.trim();
    }

    let settings = {
        guild_id: null,
        delay: null,
        message: null,
        send_to: null,
    }

    console.log('[KEVN_BRODCAST]'.black + ` Token: ${config.token.slice(0, 16)}... `.blue);
    await waitjs(2000);
    console.log('[KEVN_BRODCAST]'.black + ' Token send to authorization... '.yellow);
    await waitjs(2000);

    client.once('ready', async () => {
        console.log('[DISCORD_API]'.black + ` Logged in as ${client.user.tag}`.green);
        await waitjs(4000);

        const guild_id = await ask('[KEVN_BRODCAST]'.black + ' Enter guild id: '.green);
        rl.pause();

        console.log('[KEVN_BRODCAST]'.black + ` Guild id: ${guild_id}`.blue);
        await waitjs(2000);
        console.log('[KEVN_BRODCAST]'.black + ' Guild id send to authorization... '.yellow);

        console.log('[DISCORD_API]'.black + ` Check guild id: ${guild_id}`.green);
        let guild = await client.guilds.fetch(guild_id).catch(() => { });
        if (!guild) {
            console.log('[DISCORD_API]'.black + ` Guild not found: ${guild_id}`.red);
            console.log('[KEVN_BRODCAST]'.black + ' Guild id not found...\n'.red + '[KEVN_BRODCAST]'.black + ' Will be disconnect in 5 seconds... '.red);
            setTimeout(() => process.exit(), 3000);
            return;
        }
        console.log('[DISCORD_API]'.black + ` Guild found: ${guild.name}`.green);
        await waitjs(4000);
        settings.guild_id = guild.id;

        console.log('[KEVN_BRODCAST]'.black + ' Broadcast send to:'.green);
        console.log('[KEVN_BRODCAST]'.black + ' 1) Send to all members'.blue);
        console.log('[KEVN_BRODCAST]'.black + ' 2) Send to online members'.blue);
        console.log('[KEVN_BRODCAST]'.black + ' 3) Send to offline members'.blue);
        console.log('[KEVN_BRODCAST]'.black + ' 4) Send to role members'.blue);

        const choice = await ask('[KEVN_BRODCAST]'.black + ' Enter number of your choice: '.green);
        rl.pause();

        if (choice === '1') {
            settings.send_to = 'all';
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" received: "All Members"'.blue);
            await waitjs(2000);
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" send to system... '.yellow);
            await waitjs(4000);
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" added to system successfully! '.green);
        } else if (choice === '2') {
            settings.send_to = 'online';
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" received: "Online Members"'.blue);
            await waitjs(2000);
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" send to system... '.yellow);
            await waitjs(4000);
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" added to system successfully! '.green);
        } else if (choice === '3') {
            settings.send_to = 'offline';
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" received: "Offline Members"'.blue);
            await waitjs(2000);
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" send to system... '.yellow);
            await waitjs(4000);
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" added to system successfully! '.green);
        } else if (choice === '4') {
            settings.send_to = 'role';

            console.log('[KEVN_BRODCAST]'.black + ' "Send To" received: "Role Members"'.blue);
            await waitjs(2000);
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" send to system... '.yellow);
            await waitjs(4000);
            console.log('[KEVN_BRODCAST]'.black + ' "Send To" added to system successfully! '.green);

            const role_id = await ask('[KEVN_BRODCAST]'.black + ' Enter role id: '.green);
            rl.pause();

            console.log('[KEVN_BRODCAST]'.black + ' Role id received.'.blue);
            await waitjs(2000);
            console.log('[KEVN_BRODCAST]'.black + ' Role id send to authorization... '.yellow);

            console.log('[DISCORD_API]'.black + ` Check role id: ${role_id}`.green);
            let role = await guild.roles.fetch(role_id).catch(() => { });
            if (!role) {
                console.log('[DISCORD_API]'.black + ` Role not found: ${role_id}`.red);
                console.log('[KEVN_BRODCAST]'.black + ' Role id not found...\n'.red + '[KEVN_BRODCAST]'.black + ' Will be disconnect in 5 seconds... '.red);
                setTimeout(() => process.exit(), 3000);
                return;
            }
            console.log('[DISCORD_API]'.black + ` Role found: ${role.name}`.green);
            await waitjs(2000);
            settings.send_to = role.id;
        } else {
            console.log('[KEVN_BRODCAST]'.black + ' Invalid selection.'.red);
            rl.close();
            return;
        }

        const delay = await ask('[KEVN_BRODCAST]'.black + ' Enter delay (recommended: 5000-10000): '.green);
        rl.pause();
        settings.delay = delay;
        console.log('[KEVN_BRODCAST]'.black + ` Delay received: ${delay}`.blue);
        if (delay < 1 || delay > 60000) {
            console.log('[KEVN_BRODCAST]'.black + ' Invalid delay.'.red);
            console.log('[KEVN_BRODCAST]'.black + ' Will be disconnect in 5 seconds... '.red);
            setTimeout(() => process.exit(), 3000);
            return;
        }
        console.log('[KEVN_BRODCAST]'.black + ' Delay send to system... '.yellow);
        await waitjs(2000);
        console.log('[KEVN_BRODCAST]'.black + ' Delay added to system successfully!'.green);


        const message = await askMultiline('[KEVN_BRODCAST]'.black + ' Enter message:'.green);
        rl.pause();
        settings.message = message;
        console.log('[KEVN_BRODCAST]'.black + ' Message received successfully'.blue);
        console.log('[KEVN_BRODCAST]'.black + ' Message send to system... '.yellow);
        await waitjs(2000);
        console.log('[KEVN_BRODCAST]'.black + ' Message added to system successfully!'.green);
        rl.close();

        if (settings.send_to === 'all') {
            console.log('[KEVN_BRODCAST]'.black + ' Loading broadcast...'.blue);

            await client.guilds.fetch(settings.guild_id).then(async guild => {
                console.log('[DISCORD_API]'.black + ` Loaded guild: ${guild.name} (${guild.id}) loaded successfully`.green);

                const members = guild.members.cache.filter((member) => !member.user.bot)

                console.log('[DISCORD_API]'.black + ` Loaded members: ${members.size} members loaded successfully`.green);

                console.log('[DISCORD_API]'.black + ` Time to send: ${formatTimeReamining(members.size * settings.delay)}`.green);

                for (const [index, member] of members.entries()) {
                    const timer = formatTime(Date.now());
                    console.log('[DISCORD_API]'.black + ` Sending message to: ${member.user.username} (${member.id}) successfully `.green + `[${timer}]`.bgCyan);
                    try {
                        await member.send({ content: `${settings.message}\n<@${member.user.id}>` });
                    } catch (err) {
                        console.log(`[DISCORD_API] Failed to send to ${member.user.username} (${member.id}): ${err.message} `.red + `[${timer}]`.bgRed);
                    }
                    await waitjs(settings.delay);
                }
                console.log('[KEVN_BRODCAST]'.black + ' Broadcast complete!'.green);
                console.log('[KEVN_BRODCAST]'.black + ' Will be disconnect in 5 seconds... '.red);
                setTimeout(() => process.exit(), 3000);
            });

        } else if (settings.send_to === 'online') {
            console.log('[KEVN_BRODCAST]'.black + ' Loading broadcast...'.blue);

            await client.guilds.fetch(settings.guild_id).then(async guild => {
                console.log('[DISCORD_API]'.black + ` Loaded guild: ${guild.name} (${guild.id}) loaded successfully`.green);

                const members = guild.members.cache.filter((member) => !member.user.bot && member.presence && member.presence.status !== 'offline')

                console.log('[DISCORD_API]'.black + ` Loaded members: ${members.size} members loaded successfully`.green);

                console.log('[DISCORD_API]'.black + ` Time to send: ${formatTimeReamining(members.size * settings.delay)}`.green);

                for (const [index, member] of members.entries()) {
                    const timer = formatTime(Date.now());
                    console.log('[DISCORD_API]'.black + ` Sending message to: ${member.user.username} (${member.id}) successfully `.green + `[${timer}]`.bgCyan);
                    try {
                        await member.send(settings.message);
                    } catch (err) {
                        console.log(`[DISCORD_API] Failed to send to ${member.user.username} (${member.id}): ${err.message} `.red + `[${timer}]`.bgRed);
                    }
                    await waitjs(settings.delay);
                }
                console.log('[KEVN_BRODCAST]'.black + ' Broadcast complete!'.green);
                console.log('[KEVN_BRODCAST]'.black + ' Will be disconnect in 5 seconds... '.red);
                setTimeout(() => process.exit(), 3000);
            });
        } else if (settings.send_to === 'offline') {
            console.log('[KEVN_BRODCAST]'.black + ' Loading broadcast...'.blue);

            await client.guilds.fetch(settings.guild_id).then(async guild => {
                console.log('[DISCORD_API]'.black + ` Loaded guild: ${guild.name} (${guild.id}) loaded successfully`.green);

                const members = guild.members.cache.filter((member) => !member.user.bot && member.presence && member.presence.status === 'offline')

                console.log('[DISCORD_API]'.black + ` Loaded members: ${members.size} members loaded successfully`.green);

                console.log('[DISCORD_API]'.black + ` Time to send: ${formatTimeReamining(members.size * settings.delay)}`.green);

                for (const [index, member] of members.entries()) {
                    const timer = formatTime(Date.now());
                    console.log('[DISCORD_API]'.black + ` Sending message to: ${member.user.username} (${member.id}) successfully `.green + `[${timer}]`.bgCyan);
                    try {
                        await member.send(settings.message);
                    } catch (err) {
                        console.log(`[DISCORD_API] Failed to send to ${member.user.username} (${member.id}): ${err.message} `.red + `[${timer}]`.bgRed);
                    }
                    await waitjs(settings.delay);
                }
                console.log('[KEVN_BRODCAST]'.black + ' Broadcast complete!'.green);
                console.log('[KEVN_BRODCAST]'.black + ' Will be disconnect in 5 seconds... '.red);
                setTimeout(() => process.exit(), 3000);
            });
        } else {
            console.log('[KEVN_BRODCAST]'.black + ' Loading broadcast...'.blue);

            await client.guilds.fetch(settings.guild_id).then(async guild => {
                console.log('[DISCORD_API]'.black + ` Loaded guild: ${guild.name} (${guild.id}) loaded successfully`.green);

                const members = guild.roles.cache.get(settings.send_to).members.filter((member) => !member.user.bot)

                console.log('[DISCORD_API]'.black + ` Loaded members: ${members.size} members loaded successfully`.green);

                console.log('[DISCORD_API]'.black + ` Time to send: ${formatTimeReamining(members.size * settings.delay)}`.green);

                for (const [index, member] of members.entries()) {
                    const timer = formatTime(Date.now());
                    console.log('[DISCORD_API]'.black + ` Sending message to: ${member.user.username} (${member.id}) successfully `.green + `[${timer}]`.bgCyan);
                    try {
                        await member.send(settings.message);
                    } catch (err) {
                        console.log(`[DISCORD_API] Failed to send to ${member.user.username} (${member.id}): ${err.message} `.red + `[${timer}]`.bgRed);
                    }
                    if (index + 1 <= members.size) {
                        await waitjs(settings.delay);
                    }
                }
                console.log('[KEVN_BRODCAST]'.black + ' Broadcast complete!'.green);
                console.log('[KEVN_BRODCAST]'.black + ' Will be disconnect in 5 seconds... '.red);
                setTimeout(() => process.exit(), 3000);
            });
        }
    });

    client.login(config.token).then(() => {
        console.log('[DISCORD_API]'.black + ` Recived token: ${config.token.slice(0, 16)}... `.yellow);
    }).catch(err => {
        console.error('[DISCORD_API]'.black + ' Login failed:'.red, err.message);
    });
});

process.removeAllListeners('warning');