# Path of Exile Trade Companion

## Overview

This project is a trade companion tool designed for Path of Exile on Windows. The aim is to provide a more streamlined experience trading than the current offered in game solution.

## Features

- **Current Values**: Incoming trades will show the current market value of the base item and whether or not that is an increase in 5 day pricing history.
- **Directly interacts with the game without the need of your personal information**: This companion does not require any OAuth access to your account nor will it ever, it only requires the local filepath to your in game chat log. Trades are handled semi-autonomously as you just choose the option you wish to proceed with.  
- **Stored trades**: Your trades will be saved to a local database to allow you to parse back and figure out your earnings over a period of time.
- **Lightweight and unobtrusive**: The experience works best in a dual monitor setup, this is ideally as unobtrusive to your in-game immersion as possible.

![Incoming Requests](https://i.imgur.com/JC77vmA.png)
![Historical Requests](https://i.imgur.com/J8DDNKK.png)

### Created with Electron, React, Typescript, NextUI and TailwindCSS
