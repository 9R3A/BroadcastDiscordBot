require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ] 
});

client.once('ready', () => {
    console.log('
    ╔═════════════════════════════════════════════════════════════════════════════════╗
    ║                                                                                 ║
    ║                                                                                 ║
    ║                       █████╗ ██████╗ ██████╗  █████╗ 			              	  ║
    ║                      ██╔══██╗██╔══██╗╚════██╗██╔══██╗			                  ║
    ║                      ╚██████║██████╔╝ █████╔╝███████║			                  ║
    ║                       ╚═══██║██╔══██╗ ╚═══██╗██╔══██║                           ║
    ║                       █████╔╝██║  ██║██████╔╝██║  ██║                           ║
    ║                       ╚════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝                           ║
    ║                                < 3                                              ║
    ║                                                                                 ║
    ╚═════════════════════════════════════════════════════════════════════════════════╝ 
                          ════════════════════════════════════════
                              All Systems Operations Active         
                            → Bot: ${client.user.tag}   
                            → Status: Online 
                            → Pray For Syria & Palastine ❤	
                            → Github: https://github.com/9R3A
                          ════════════════════════════════════════
                                              <3                    
      ');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'broadcast') {
        if (!interaction.member.permissions.has('Administrator')) {
            return await interaction.reply({ 
                content: 'You need Administrator permission to use this command!', 
                ephemeral: true 
            });
        }

        const message = interaction.options.getString('message');
        const guild = interaction.guild;

        try {
            await guild.members.fetch();
            
            const members = guild.members.cache.filter(member => !member.user.bot);
            let successCount = 0;
            let failCount = 0;

            await interaction.reply({ 
                content: `Starting broadcast to ${members.size} members...`, 
                ephemeral: true 
            });

            for (const [_, member] of members) {
                try {
                    await member.send(message);
                    successCount++;
                } catch (error) {
                    failCount++;
                    console.error(`Failed to send message to ${member.user.tag}: ${error}`);
                }
            }

            await interaction.followUp({ 
                content: `Broadcast complete!\nSuccess: ${successCount}\nFailed: ${failCount}`, 
                ephemeral: true 
            });
        } catch (error) {
            console.error(error);
            await interaction.reply({ 
                content: 'An error occurred while broadcasting the message.', 
                ephemeral: true 
            });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [
                {
                    name: 'broadcast',
                    description: 'Send a message to all members in the server (Admin only)',
                    options: [
                        {
                            type: 3,
                            name: 'message',
                            description: 'The message to broadcast to all members',
                            required: true,
                        },
                    ],
                },
            ] },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
