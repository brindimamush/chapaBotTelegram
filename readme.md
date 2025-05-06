# Telegram Product Bot

A Telegram bot that posts products to authorized channels and handles payments via Chapa API.

## Features

- Admin management
- Product management
- Channel authorization
- Payment processing via Chapa
- Order tracking

## Setup

1. Get a Telegram bot token from [@BotFather](https://t.me/BotFather)
2. Sign up for Chapa API at [Chapa](https://chapa.co) and get API key
3. Clone this repository
4. Install dependencies: `npm install`
5. Create `.env` file with your credentials
6. Start the bot: `node bot.js`

## Commands

Admin commands:

- `/addproduct` - Add new product
- `/authorizechannel` - Authorize a channel

User flow:

1. Admins add products
2. Admins authorize channels
3. Users view products and make purchases
4. Payments processed via Chapa
5. Successful orders posted to authorized channels

## Database Schema

- users: Stores bot users and admins
- products: Contains product information
- orders: Tracks payment status
- channels: Authorized channels for posting

## Payment Flow

1. User initiates payment
2. Bot generates Chapa payment link
3. User completes payment
4. Chapa sends webhook notification
5. System verifies payment and posts product to channel
