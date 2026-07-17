const locationImages = [
  {
    keyword: "greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "canada",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "morocco",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "italy",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "iceland",
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "bali",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "portugal",
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "south africa",
    image: "https://images.unsplash.com/photo-1576485375217-d6a95e34d043?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "jordan",
    image: "https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "vietnam",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "switzerland",
    image: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "scotland",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "new zealand",
    image: "https://images.unsplash.com/photo-1469521669194-babb45599def?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "dubai",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "spain",
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "tanzania",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "cuba",
    image: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "peru",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "paris",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "bordeaux",
    image: "https://plus.unsplash.com/premium_photo-1694475389691-dfb656cf0711?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "austria",
    image: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "egypt",
    image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "finland",
    image: "https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "argentina",
    image: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "taiwan",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "norway",
    image: "https://plus.unsplash.com/premium_photo-1697729974131-40aabc4817c0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "czech",
    image: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "guatemala",
    image: "https://images.unsplash.com/photo-1680374635234-ba4bc7e44641?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "oman",
    image: "https://images.unsplash.com/photo-1585134339424-0fc98d0bfe86?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "poland",
    image: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "belgium",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "sri lanka",
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "mexico",
    image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "croatia",
    image: "https://images.unsplash.com/photo-1628502301579-bf8b22d3c685?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "australia",
    image: "https://images.unsplash.com/photo-1661674753163-0f8bca582509?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "latvia",
    image: "https://images.unsplash.com/photo-1709409063412-3e2d6757cf8d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "thailand",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "malta",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "ecuador",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "philippines",
    image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "estonia",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "kenya",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "chile",
    image: "https://plus.unsplash.com/premium_photo-1669377593274-41985c518d03?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "slovenia",
    image: "https://images.unsplash.com/photo-1599925355535-2d7385f1cccc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "ghana",
    image: "https://images.unsplash.com/photo-1727023663928-1772e2c7e679?auto=format&fit=crop&w=1200&q=80",
  },
  {
    keyword: "arizona",
    image: "https://images.unsplash.com/photo-1591155033309-fe509a7cf426?auto=format&fit=crop&w=1200&q=80",
  },
];

export const getLocationImage = (location) => {
  if (!location) return null;

  const value = location.toLowerCase();

  const match = locationImages.find((item) =>
    value.includes(item.keyword)
  );

  return match?.image || null;
};