export async function fetchMemeCoins() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=10&page=1&sparkline=false",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch meme coins:", response.statusText);
    return [];
  }

  const data = await response.json();

  return data.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    current_price: coin.current_price,
    market_cap: coin.market_cap,
    total_volume: coin.total_volume,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    total_supply: coin.total_supply,
    ath: coin.ath, // All Time High 
    atl: coin.atl, // All Time Low
  }));
}
