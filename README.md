# moneythat

## Project Description

moneythat is a simple web application that allows users to explore real-time cryptocurrency data in an easy and clear way. The idea behind the project is to keep things minimal and understandable, so users can quickly see basic information about different cryptocurrencies without using complicated platforms.

The application uses the CoinGecko API to fetch live data and displays it in a simple card layout. Each cryptocurrency is shown with its name, image, and current price, making it easy to scan through the list.

## Basic Functioning

When the application loads, it makes a request to the CoinGecko API and retrieves a list of cryptocurrencies along with their details. While the data is being fetched, a loading message is displayed to indicate that the content is being loaded.

Once the data is received, it is dynamically rendered on the webpage using JavaScript. Each item is displayed as a small card containing basic information like the coin name, its image, and its current price.

The layout is designed to adjust across different screen sizes, so the application works on mobile, tablet, and desktop devices without any major issues.

At this stage, the project mainly focuses on fetching and displaying real-time data, along with handling loading states and maintaining a simple responsive design. More interactive features like search, filtering, and sorting will be added in the next stages.
